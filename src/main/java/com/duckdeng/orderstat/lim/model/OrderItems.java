package com.duckdeng.orderstat.lim.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItems {
    private String itemId;
    private String itemType;
    private String itemUnit;
    private String itemIngred;
    private String itemSpicy;
    private String itemCookMethod;
    private int price;
    private String note;
}
