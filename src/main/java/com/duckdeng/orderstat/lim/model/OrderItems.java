package com.duckdeng.orderstat.lim.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItems {
    private String itemId;
    private int price;
    private String itemType;
    private String itemIngred;
    private String itemUnit;
    private String itemSpicy;
    private String itemCookMethod;
    private String note;
    private String noteFoodPanda;
    private String noteUberEats;
    private int itemCost;
}
