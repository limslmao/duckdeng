package com.duckdeng.orderstat.lim.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class OrderDetailDTO {
    private String orderDate;
    private Map<String, Integer> orderItem;
    private int totalAmount;
    private int discount;
    private String remark;
}