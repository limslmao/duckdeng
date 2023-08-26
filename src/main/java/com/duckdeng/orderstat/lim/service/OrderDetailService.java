package com.duckdeng.orderstat.lim.service;

import com.duckdeng.orderstat.lim.model.OrderDetail;
import com.google.api.core.ApiFuture;
import com.google.api.gax.rpc.NotFoundException;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class OrderDetailService {
    public OrderDetail createOrderDetail(OrderDetail orderDetail) throws Exception {
        if (orderDetail == null) {
            throw new IllegalArgumentException("Order detail cannot be null.");
        }

        Firestore dbFirestore = FirestoreClient.getFirestore();

        Date today = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
        String datePart = dateFormat.format(today).substring(1);

        try {
            ApiFuture<QuerySnapshot> future = dbFirestore.collection("orderDetail")
                    .whereGreaterThanOrEqualTo(FieldPath.documentId(), datePart + "001")
                    .whereLessThanOrEqualTo(FieldPath.documentId(), datePart + "999").get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            String highestOrderID = documents.stream()
                    .map(QueryDocumentSnapshot::getId)
                    .max(String::compareTo)
                    .orElse(datePart + "000");

            int newNumberOfDocuments = Integer.parseInt(highestOrderID.substring(7)) + 1;
            String orderItemKey = datePart + String.format("%03d", newNumberOfDocuments);

            orderDetail.setOrderId(orderItemKey);
            dbFirestore.collection("orderDetail").document(orderItemKey).set(orderDetail);

            return orderDetail;
        } catch (InterruptedException | ExecutionException e) {
            throw new Exception("Error creating order detail.", e);
        }
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

    public Map<String, List<OrderDetail>> getMultiOrderDetailByDate(String startDate, String endDate) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        String startId = startDate.substring(1) + "001";
        String endId;
        if (endDate != null && !endDate.trim().isEmpty()) {
            endId = endDate.substring(1) + "999";
        } else {
            endId = startDate.substring(1) + "999";
        }

        ApiFuture<QuerySnapshot> future = dbFirestore.collection("orderDetail")
                .whereGreaterThanOrEqualTo(FieldPath.documentId(), startId)
                .whereLessThanOrEqualTo(FieldPath.documentId(), endId)
                .get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        String orderDetail = "orderDtl";
        List<OrderDetail> orderDetailList = documents.stream().map(this::addOrderId).toList();

        return Collections.singletonMap(orderDetail, orderDetailList);
    }

    public boolean updateOrderDetail(String orderDetailId, OrderDetail orderDetail) throws Exception {
        if (orderDetailId == null || orderDetailId.isEmpty()) {
            throw new IllegalArgumentException("Order detail ID cannot be null or empty.");
        }
        if (orderDetail == null) {
            throw new IllegalArgumentException("Order detail cannot be null.");
        }
        try {
            Firestore dbFirestore = FirestoreClient.getFirestore();
            DocumentReference documentReference = dbFirestore.collection("orderDetail").document(orderDetailId);
            ApiFuture<DocumentSnapshot> future = documentReference.get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                orderDetail.setOrderId(orderDetailId);
                ApiFuture<WriteResult> collectionApiFuture = documentReference.set(orderDetail);
                WriteResult result = collectionApiFuture.get();
                return result != null;
            } else {
                throw new NoSuchElementException("Order detail with ID " + orderDetailId + " not found.");
            }
        } catch (InterruptedException | ExecutionException e) {
            throw new Exception("Error updating order detail.", e);
        }
    }


    public boolean deleteOrderDetail(String orderDetailId) throws Exception {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> future = dbFirestore.collection("orderDetail").document(orderDetailId).delete();

        try {
            WriteResult result = future.get();
            if (result != null) {
                return true;
            } else {
                return false;
            }
        } catch (ExecutionException e) {
            if (e.getCause() instanceof NotFoundException) {
                return false;
            }
            throw new Exception("An error occurred while deleting the order detail.", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new Exception("The delete operation was interrupted.", e);
        }
    }

    private OrderDetail addOrderId(QueryDocumentSnapshot document) {
        OrderDetail detail = document.toObject(OrderDetail.class);
        detail.setOrderId(document.getId());
        return detail;
    }
}
