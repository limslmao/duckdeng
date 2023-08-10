package com.duckdeng.orderstat.lim.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItems {
    private String itemId;
    private String itemType;
    private String itemUnit;
    private String note;
    private int price;
}
