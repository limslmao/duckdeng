package com.duckdeng.orderstat.lim.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class OrderDetail {
    private Map<String, Integer> orderItem;
    private int totalAmount;
}
