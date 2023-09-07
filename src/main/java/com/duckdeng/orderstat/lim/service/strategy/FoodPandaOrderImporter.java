package com.duckdeng.orderstat.lim.service.strategy;

import com.duckdeng.orderstat.lim.model.OrderDetail;
import com.duckdeng.orderstat.lim.model.OrderItems;
import com.duckdeng.orderstat.lim.model.OrderPlatformDetail;
import com.duckdeng.orderstat.lim.service.OrderItemsService;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.FieldPath;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class FoodPandaOrderImporter implements OrderImporter {

    private final OrderItemsService orderItemsService;

    @Autowired
    public FoodPandaOrderImporter(OrderItemsService orderItemsService) {
        this.orderItemsService = orderItemsService;
    }
    @Override
    public void processOrder(List<OrderPlatformDetail> orderDetails) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Step 1. 做出一個不重複的訂單日期map
        Map<String, List<OrderPlatformDetail>> groupedOrders = orderDetails.stream()
                .collect(Collectors.groupingBy(OrderPlatformDetail::getOrderDate));

        // Step 2. 利用批次資料做一個完整的Transaction
        ApiFuture<Void> future = dbFirestore.runTransaction(transaction -> {
            Map<String, Integer> maxIdsForDate = new HashMap<>();
            Map<String, List<String>> existingOrderPlatformIdsByDate = new HashMap<>();

            for (String date : groupedOrders.keySet()) {
                String datePart = date.substring(1);

                // Step 1. 獲取DB目前已經有的orderPlatformIds
                ApiFuture<QuerySnapshot> future1 = transaction.get(dbFirestore.collection("orderDetail")
                        .whereGreaterThanOrEqualTo(FieldPath.documentId(), datePart + "001")
                        .whereLessThanOrEqualTo(FieldPath.documentId(), datePart + "999"));
                List<QueryDocumentSnapshot> documentsForIdCheck = future1.get().getDocuments();
                List<String> existingOrderPlatformIds = documentsForIdCheck.stream()
                        .map(doc -> doc.getString("orderPlatformId"))
                        .collect(Collectors.toList());
                existingOrderPlatformIdsByDate.put(date, existingOrderPlatformIds);

                String highestOrderID = documentsForIdCheck.stream()
                        .map(QueryDocumentSnapshot::getId)
                        .max(String::compareTo)
                        .orElse(datePart + "000");
                int startID = Integer.parseInt(highestOrderID.substring(7));
                maxIdsForDate.put(date, startID);
            }

            for (Map.Entry<String, List<OrderPlatformDetail>> entry : groupedOrders.entrySet()) {
                String datePart = entry.getKey().substring(1);
                int startID = maxIdsForDate.get(entry.getKey());

                // Step 2. 過濾掉已存在的訂單
                List<OrderPlatformDetail> toBeInserted = entry.getValue().stream()
                        .filter(order -> !existingOrderPlatformIdsByDate.get(entry.getKey()).contains(order.getOrderPlatformId()))
                        .toList();

                // Step 3. 插入新的訂單
                for (OrderPlatformDetail orderDetailDTO : toBeInserted) {
                    String orderItemKey = datePart + String.format("%03d", ++startID);

                    OrderDetail orderDetail = new OrderDetail();
                    orderDetail.setOrderId(orderItemKey);
                    orderDetail.setTotalAmount(orderDetailDTO.getTotalAmount());
                    orderDetail.setRemark("import from foodpanda");
                    orderDetail.setOrderPlatformId(orderDetailDTO.getOrderPlatformId());

                    //處理字串成為訂單樣式
                    Map<String, Integer> idWithCountMap = parseWithRegex(orderDetailDTO.getOrderDtlStr());
                    orderDetail.setOrderItem(idWithCountMap);

                    transaction.set(dbFirestore.collection("orderDetail").document(orderItemKey), orderDetail);
                }
            }
            return null;
        });
        future.get();
    }

    private Map<String, Integer> parseWithRegex(String orderDtlStr) throws ExecutionException, InterruptedException {
        String menuString = "1 半鴨二吃 [1 荷葉餅【一份10片】, 1 甜麵醬【一份】], 1 手扒雞【半隻】 [1 荷葉餅【一份10片】]";
        // Step 1. 取得菜單內的FoodPandaNote
        Map<String, List<OrderItems>> orderItemsMap =orderItemsService.getAllOrderItems();
        List<OrderItems> orderItems = orderItemsMap.get("menuDtl");
        Map<String, String> idWithNoteMap = orderItems.stream()
                .filter(item -> item.getNoteFoodPanda() != null)
                .collect(Collectors.toMap(OrderItems::getItemId, OrderItems::getNoteFoodPanda));

        // Step 2. 正規表達式處理字串，做成一張字串與數量的map
        Pattern pattern = Pattern.compile("(\\d+) ([^\\[\\],]+)");
        Matcher matcher = pattern.matcher(menuString);
        // 用於追蹤每一種品項的總數
        HashMap<String, Integer> orderItemCountPanda = new HashMap<>();
        while (matcher.find()) {
            int quantity = Integer.parseInt(matcher.group(1));
            String item = matcher.group(2).trim();
            orderItemCountPanda.put(item, orderItemCountPanda.getOrDefault(item, 0) + quantity);
        }

        // Step 3. 將兩個map整合
        Map<String, Integer> idWithCountMap = new HashMap<>();

        for (Map.Entry<String, String> entry : idWithNoteMap.entrySet()) {
            String id = entry.getKey();
            String name = entry.getValue();

            Integer count = orderItemCountPanda.get(name);
            if (count != null) {
                idWithCountMap.put(id, count);
            }
        }
        return idWithCountMap;
    }
}