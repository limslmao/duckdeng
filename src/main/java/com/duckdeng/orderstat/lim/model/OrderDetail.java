package com.duckdeng.orderstat.lim.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class OrderDetail {
    private String orderId;
    private Map<String, Integer> orderItem;
    private int totalAmount;
    private int discount;
    private String remark;
    private String orderPlatformId;
}
