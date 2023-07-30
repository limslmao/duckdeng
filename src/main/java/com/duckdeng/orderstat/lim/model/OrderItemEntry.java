package com.duckdeng.orderstat.lim.model;

import java.io.IOException;
import java.util.List;

import static com.duckdeng.orderstat.lim.ThymeleafApplication.testOrderItemDataReader;

//品項與數量(點餐用)
public class OrderItemEntry {

    private List<OrderItem> orderItem;
    private int quantity;


    public OrderItemEntry() {

    }

    public OrderItemEntry(List<OrderItem> orderItem, int quantity) {
        this.orderItem = orderItem;
        this.quantity = quantity;
    }


    public List<OrderItem> getOrderItem() {
        return orderItem;
    }

    public void setOrderItem(List<OrderItem> orderItem) {
        this.orderItem = orderItem;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getQuantity() {
        return quantity;
    }
}