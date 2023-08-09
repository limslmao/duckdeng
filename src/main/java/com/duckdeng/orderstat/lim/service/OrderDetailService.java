package com.duckdeng.orderstat.lim.service;

import com.duckdeng.orderstat.lim.model.OrderDetail;
import com.duckdeng.orderstat.lim.model.OrderItems;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class OrderDetailService {
    public String createOrderDetail(OrderDetail orderDetail) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = dbFirestore.collection("orderDetail").get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        //處理怎麼新增ID的字串
        int newNumberOfDocuments = documents.size()+1;
        String orderItemKey = String.format("%03d", newNumberOfDocuments);

        ApiFuture<WriteResult> collectionApiFuture = dbFirestore.collection("orderDetail")
                .document(orderItemKey).set(orderDetail);
        return collectionApiFuture.get().getUpdateTime().toString();
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
