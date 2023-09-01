package com.duckdeng.orderstat.lim.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderPlatformDetail {
    private String orderPlatformId;
    private String orderDtlStr;
    private int totalAmount;
    private String orderDate;
}
