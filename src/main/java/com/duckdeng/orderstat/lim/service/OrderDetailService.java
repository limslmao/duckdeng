package com.duckdeng.orderstat.lim.service;

import com.duckdeng.orderstat.lim.model.Order;
import com.duckdeng.orderstat.lim.model.OrderDetail;
import com.duckdeng.orderstat.lim.model.OrderItems;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class OrderDetailService {
    public Order createOrderDetail(OrderDetail orderDetail) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        Date today = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        String datePart = dateFormat.format(today).substring(1);

        ApiFuture<QuerySnapshot> future = dbFirestore.collection("orderDetail")
                .whereGreaterThanOrEqualTo(FieldPath.documentId(), datePart + "001")
                .whereLessThanOrEqualTo(FieldPath.documentId(),  datePart + "999").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        int newNumberOfDocuments = documents.size() + 1;

        String orderItemKey =  datePart + String.format("%03d", newNumberOfDocuments);
        dbFirestore.collection("orderDetail").document(orderItemKey).set(orderDetail);

        Order order = new Order();
        order.setOrderId(orderItemKey);
        order.setOrderDetail(orderDetail);

        return order;
    }

    public OrderDetail getOrderDetail(String orderDetailId) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("orderDetail").document(orderDetailId);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        OrderDetail orderDetail;
        if (document.exists()) {
            orderDetail = document.toObject(OrderDetail.class);
            return orderDetail;
        }
        return null;
    }

    public List<OrderDetail> getMultiOrderDetailByDate(String startDate, String endDate) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        String startId = startDate.substring(1) + "001";
        String endId = endDate.substring(1) + "999";

        ApiFuture<QuerySnapshot> future = dbFirestore.collection("orderDetail")
                .whereGreaterThanOrEqualTo(FieldPath.documentId(), startId)
                .whereLessThanOrEqualTo(FieldPath.documentId(), endId)
                .get();

        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        return documents.stream().map(doc -> doc.toObject(OrderDetail.class)).collect(Collectors.toList());
    }

    public String updateOrderDetail(String orderDetailId, OrderDetail orderDetail) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApiFuture = dbFirestore.collection("orderDetail").document(orderDetailId).set(orderDetail);
        return collectionApiFuture.get().getUpdateTime().toString();
    }

    public String deleteOrderDetail(String orderDetailId) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection("orderDetail").document(orderDetailId).delete();
        return "Successfully deleted " + orderDetailId;
    }
}
