package com.duckdeng.orderstat.lim.service;

import com.duckdeng.orderstat.lim.model.OrderItems;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class OrderItemsService {
    public String createOrderItems(OrderItems orderItems) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection("orderItems").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        int newNumberOfDocuments = documents.size()+1;
        String orderItemKey = String.format("%03d", newNumberOfDocuments);

        orderItems.setItemId(orderItemKey);
        ApiFuture<WriteResult> collectionApiFuture = dbFirestore.collection("orderItems")
                .document(orderItemKey).set(orderItems);
        return collectionApiFuture.get().getUpdateTime().toString();
    }

    public OrderItems getOrderItems(String orderItemKey) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("orderItems").document(orderItemKey);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();
        OrderItems orderItems;
        if (document.exists()) {
            orderItems = document.toObject(OrderItems.class);
            return orderItems;
        }
        return null;
    }

    public Map<String, List<OrderItems>> getAllOrderItems() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection("orderItems").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        String menuDetail = "menuDtl";
        List<OrderItems> orderItemsList =  documents.stream().map(this::addItemId).toList();

        return Collections.singletonMap(menuDetail, orderItemsList);
    }

    public String updateOrderItems(String orderItemKey, OrderItems orderItems) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection("orderItems").document(orderItemKey);
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            ApiFuture<WriteResult> collectionApiFuture = documentReference.set(orderItems);
            return collectionApiFuture.get().getUpdateTime().toString();
        } else {
            return null; // Order item not found
        }
    }


    public String deleteOrderItems(String orderItemKey) {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> writeResult = dbFirestore.collection("orderItems").document(orderItemKey).delete();
        return "Successfully deleted " + orderItemKey;
    }

    private OrderItems addItemId(QueryDocumentSnapshot document) {
        OrderItems orderItems = document.toObject(OrderItems.class);
        orderItems.setItemId(document.getId());
        return orderItems;
    }
}
