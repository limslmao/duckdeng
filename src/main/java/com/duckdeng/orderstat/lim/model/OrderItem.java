package com.duckdeng.orderstat.lim.model;

//品項與價格(菜單的價格基準)
public class OrderItem {
    private String itemName;
    private int unitPrice;


    public OrderItem(String menuItem, int unitPrice) {
        this.itemName = menuItem;
        this.unitPrice = unitPrice;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(int unitPrice) {
        this.unitPrice = unitPrice;
    }

    @Override
    public String toString() {
        return "OrderItem{" +
                "itemName='" + itemName + '\'' +
                ", unitPrice=" + unitPrice +
                '}';
    }
}