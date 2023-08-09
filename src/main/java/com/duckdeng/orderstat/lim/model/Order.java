package com.duckdeng.orderstat.lim.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Order {
    private String orderId;
    private OrderDetail orderDetail;
}
