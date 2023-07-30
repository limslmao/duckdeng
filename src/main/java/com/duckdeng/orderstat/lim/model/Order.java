package com.duckdeng.orderstat.lim.model;

import java.util.List;

//訂單
public class Order {
    private String id;
    private List<OrderItemEntry> orderItemEntrys;
    private OrderItem orderItem;

    public Order(String id, List<OrderItemEntry> orderItemEntrys) {
        this.id = id;
        this.orderItemEntrys = orderItemEntrys;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<OrderItemEntry> getOrderItems() {
        return orderItemEntrys;
    }

    public void setOrderItems(List<OrderItemEntry> orderItemEntrys) {
        this.orderItemEntrys = orderItemEntrys;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id='" + id + '\'' +
                ", orderItems=" + orderItemEntrys +
                '}';
    }

}