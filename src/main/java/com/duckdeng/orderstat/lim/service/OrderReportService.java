package com.duckdeng.orderstat.lim.service;

import com.duckdeng.orderstat.lim.model.CountDetail;
import com.duckdeng.orderstat.lim.model.OrderDetail;
import com.duckdeng.orderstat.lim.model.OrderItems;
import com.duckdeng.orderstat.lim.model.ReportData;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collector;
import java.util.stream.Collectors;

@Service
public class OrderReportService {
    private OrderDetailService orderDetailService;
    private OrderItemsService orderItemsService;

    @Autowired
    public OrderReportService(OrderDetailService orderDetailService, OrderItemsService orderItemsService) {
        this.orderDetailService = orderDetailService;
        this.orderItemsService = orderItemsService;
    }
    public ReportData getReportDataByDateAndType(String startDate,
                                                 String endDate,
                                                 String dataRangeType,
                                                 String itemType) throws ExecutionException, InterruptedException {

        ReportData reportData = new ReportData();

        // Step 1: 取得日期範圍內的訂單
        Map<String, List<OrderDetail>> orderDetailsMap = orderDetailService.getMultiOrderDetailByDate(startDate, endDate);
        List<OrderDetail> orderDetails = orderDetailsMap.get("orderDtl");

        // Step 2: 取得所有菜單
        Map<String, List<OrderItems>> orderItemsMap = orderItemsService.getAllOrderItems();
        List<OrderItems> orderItems = orderItemsMap.get("menuDtl");

        // Step 3: 新增一個map，裡面是訂單資料依照日期進行分組相加
        Map<String, Map<String, Integer>> orderDetailsItemsGroupByDate = groupAndAggregate(orderDetails, dataRangeType);

        // Step 4: 用itemType值幫菜單進行分組
        Map<String, List<String>> orderGroupByField = orderItems.stream()
                    .filter(item -> getValueByField(item, itemType) != null)
                    .collect(Collectors.groupingBy(item -> getValueByField(item, itemType),
                            Collectors.mapping(OrderItems::getItemId, Collectors.toList())));

        // Step 5: 將依照烹飪方式分類的菜單Map，跟依日期分類的訂單map進行整合
        // 5-1. 將菜單對應的屬性做成一張map
        Map<String, String> itemIdToTypeMap = new HashMap<>();
        for (Map.Entry<String, List<String>> entry : orderGroupByField.entrySet()) {
            String type = entry.getKey();
            List<String> itemIds = entry.getValue();
            for (String itemId : itemIds) {
                itemIdToTypeMap.put(itemId, type);
            }
        }

        // 5-2. 將分類好的訂單跟菜單開始做對照，做出一個新的map
        Map<String, Map<String, Integer>> transformedGroupedData = new HashMap<>();

        for (Map.Entry<String, Map<String, Integer>> entry : orderDetailsItemsGroupByDate.entrySet()) {
            String date = entry.getKey();
            Map<String, Integer> itemCounts = entry.getValue();

            Map<String, Integer> transformedCounts = new HashMap<>();
            for (Map.Entry<String, Integer> itemCountEntry : itemCounts.entrySet()) {
                String itemId = itemCountEntry.getKey();
                Integer count = itemCountEntry.getValue();

                String type = itemIdToTypeMap.get(itemId); // Convert item ID to type
                if (type != null) {
                    transformedCounts.merge(type, count, Integer::sum); // Merge counts by type
                }
            }

            transformedGroupedData.put(date, transformedCounts);
        }

        List<CountDetail> countDetails = transformedGroupedData.entrySet().stream()
                .map(entry -> {
                    CountDetail detail = new CountDetail();
                    detail.setRange(entry.getKey());
                    detail.setCount(entry.getValue());
                    return detail;
                })
                .toList();


        // Step 6: set各個回傳值
        reportData.setItemType(orderGroupByField.keySet());
        reportData.setRangeType(dataRangeType);
        reportData.setCountDtl(countDetails);

        return reportData;
    }

    public ReportData getReportDataRevenueAndCost(String startDate, String endDate, String dataRangeType) throws ExecutionException, InterruptedException {
        ReportData reportData = new ReportData();
        // Step 1: 取得日期範圍內的訂單
        Map<String, List<OrderDetail>> orderDetailsMap = orderDetailService.getMultiOrderDetailByDate(startDate, endDate);
        List<OrderDetail> orderDetails = orderDetailsMap.get("orderDtl");

        // Step 2: 取得所有菜單，並將菜單轉為ID與Cost對應的Map
        Map<String, List<OrderItems>> orderItemsMap = orderItemsService.getAllOrderItems();
        List<OrderItems> orderItems = orderItemsMap.get("menuDtl");
        Map<String, Integer> itemIdToCostMap = orderItems.stream()
                .collect(Collectors.toMap(OrderItems::getItemId, OrderItems::getItemCost));

        // Step 3: 新增一個map，裡面是訂單資料，依照日期進行分組相加，並轉化為訂單總成本
        Map<String, Map<String, Integer>> orderDetailsItemsGroupByDateMap = groupAndAggregate(orderDetails, dataRangeType);
        // 將訂單資料變成流，取出每個map。用訂單裡面的東西作為key去菜單裡尋找，
        Map<String, Map<String, Integer>> orderCostByDateMap = orderDetailsItemsGroupByDateMap.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> {
                            int totalCost = entry.getValue().entrySet().stream()
                                    .filter(itemEntry -> itemIdToCostMap.containsKey(itemEntry.getKey()))
                                    .mapToInt(itemEntry -> itemEntry.getValue() * itemIdToCostMap.get(itemEntry.getKey()))
                                    .sum();
                            Map<String, Integer> costMap = new HashMap<>();
                            costMap.put("cost", totalCost);
                            return costMap;
                        }
                ));

        // Step 4: 新增另一個map，裡面是訂單總金額，依照日期進行分組相加
        Map<String, Map<String, Integer>> orderRevenueByDateMap = orderDetails.stream()
                .collect(Collectors.groupingBy((OrderDetail detail) -> getDateFromOrderId(detail.getOrderId(),dataRangeType),
                        Collector.of(HashMap<String, Integer>::new,this::aggregateOrderDetailsValue,this::combineMaps)));

        // Step 5: 將兩個整理好的map進行組合，並轉為List
        Map<String, Map<String, Integer>> finalResultMap = new HashMap<>();
        orderCostByDateMap.forEach((date, costMap) -> {
            finalResultMap.computeIfAbsent(date, k -> new HashMap<>()).putAll(costMap);
        });
        orderRevenueByDateMap.forEach((date, revenueMap) -> {
            finalResultMap.computeIfAbsent(date, k -> new HashMap<>()).putAll(revenueMap);
        });

        List<CountDetail> countDetails = finalResultMap.entrySet().stream()
                .map(entry -> {
                    CountDetail detail = new CountDetail();
                    detail.setRange(entry.getKey());
                    detail.setCount(entry.getValue());
                    return detail;
                })
                .toList();

        // Step 6: 直接宣告類別 ItemType: revenue和cost
        Set<String> set = Set.of("revenue", "cost");

        reportData.setItemType(set);
        reportData.setRangeType(dataRangeType);
        reportData.setCountDtl(countDetails);

        return reportData;
    }

    private String getValueByField(OrderItems item, String fieldName) {
        try {
            Field field = OrderItems.class.getDeclaredField(fieldName);
            field.setAccessible(true);
            return (String) field.get(item);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    private Map<String, Map<String, Integer>> groupAndAggregate(List<OrderDetail> orderDetails, String dataRangeType) {
        return orderDetails.stream()
                .collect(Collectors.groupingBy((OrderDetail detail) -> getDateFromOrderId(detail.getOrderId(),dataRangeType),
                        Collector.of(HashMap<String, Integer>::new,
                                this::aggregateOrderDetailsItems,
                                this::combineMaps)));
    }

    private String getDateFromOrderId(String orderId, String dataRangeType) {
        return switch (dataRangeType) {
            case "week" -> "week";
            case "month" -> orderId.substring(1, 5);
            case "year" -> orderId.substring(1, 3);
            default -> throw new IllegalArgumentException("Invalid dataRangeType");
        };
    }

    // 將當前訂單的商品數量加入到結果Map中
    private void aggregateOrderDetailsItems(Map<String, Integer> resultMap, OrderDetail detail) {
        detail.getOrderItem().forEach((key, value) -> resultMap.merge(key, value, Integer::sum));
    }

    private void aggregateOrderDetailsValue(Map<String, Integer> resultMap, OrderDetail detail) {
        resultMap.merge("revenue", detail.getTotalAmount(), Integer::sum);
    }

    // 合併兩個Map的數量
    private Map<String, Integer> combineMaps(Map<String, Integer> map1, Map<String, Integer> map2) {
        map2.forEach((key, value) -> map1.merge(key, value, Integer::sum));
        return map1;
    }

    private OrderItems addItemId(QueryDocumentSnapshot document) {
        OrderItems orderItems = document.toObject(OrderItems.class);
        orderItems.setItemId(document.getId());
        return orderItems;
    }

}
