package com.duckdeng.orderstat.lim.model;

import java.util.List;

public class OrderId {

    private String id;
    private int quanYaTwoEatAmount;
    private int quanJiaTwoEatSpicyAmount;
    private int banYaTwoEatAmount;
    private int banYaTwoEatSpicyAmount;
    private int quanYaChopFryAmount;
    private int quanYaChopFrySpicyAmount;
    private int banYaChopFryAmount;
    private int banYaChopFrySpicyAmount;
    private int quanYaChopPlateAmount;
    private int banYaChopPlateAmount;
    private int quanJiShouPaJiAmount;
    private int banJiShouPaJiAmount;
    private int heYeBingAmount;
    private int tianMianJiangAmount;

    public OrderId(String id, int quanYaTwoEatAmount, int quanJiaTwoEatSpicyAmount,
                   int banYaTwoEatAmount, int banYaTwoEatSpicyAmount,
                   int quanYaChopFryAmount, int quanYaChopFrySpicyAmount,
                   int banYaChopFryAmount, int banYaChopFrySpicyAmount,
                   int quanYaChopPlateAmount, int banYaChopPlateAmount,
                   int quanJiShouPaJiAmount, int banJiShouPaJiAmount,
                   int heYeBingAmount, int tianMianJiangAmount) {
        this.id = id;
        this.quanYaTwoEatAmount = quanYaTwoEatAmount;
        this.quanJiaTwoEatSpicyAmount = quanJiaTwoEatSpicyAmount;
        this.banYaTwoEatAmount = banYaTwoEatAmount;
        this.banYaTwoEatSpicyAmount = banYaTwoEatSpicyAmount;
        this.quanYaChopFryAmount = quanYaChopFryAmount;
        this.quanYaChopFrySpicyAmount = quanYaChopFrySpicyAmount;
        this.banYaChopFryAmount = banYaChopFryAmount;
        this.banYaChopFrySpicyAmount = banYaChopFrySpicyAmount;
        this.quanYaChopPlateAmount = quanYaChopPlateAmount;
        this.banYaChopPlateAmount = banYaChopPlateAmount;
        this.quanJiShouPaJiAmount = quanJiShouPaJiAmount;
        this.banJiShouPaJiAmount = banJiShouPaJiAmount;
        this.heYeBingAmount = heYeBingAmount;
        this.tianMianJiangAmount = tianMianJiangAmount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getQuanYaTwoEatAmount() {
        return quanYaTwoEatAmount;
    }

    public void setQuanYaTwoEatAmount(int quanYaTwoEatAmount) {
        this.quanYaTwoEatAmount = quanYaTwoEatAmount;
    }

    public int getQuanJiaTwoEatSpicyAmount() {
        return quanJiaTwoEatSpicyAmount;
    }

    public void setQuanJiaTwoEatSpicyAmount(int quanJiaTwoEatSpicyAmount) {
        this.quanJiaTwoEatSpicyAmount = quanJiaTwoEatSpicyAmount;
    }

    public int getBanYaTwoEatAmount() {
        return banYaTwoEatAmount;
    }

    public void setBanYaTwoEatAmount(int banYaTwoEatAmount) {
        this.banYaTwoEatAmount = banYaTwoEatAmount;
    }

    public int getBanYaTwoEatSpicyAmount() {
        return banYaTwoEatSpicyAmount;
    }

    public void setBanYaTwoEatSpicyAmount(int banYaTwoEatSpicyAmount) {
        this.banYaTwoEatSpicyAmount = banYaTwoEatSpicyAmount;
    }

    public int getQuanYaChopFryAmount() {
        return quanYaChopFryAmount;
    }

    public void setQuanYaChopFryAmount(int quanYaChopFryAmount) {
        this.quanYaChopFryAmount = quanYaChopFryAmount;
    }

    public int getQuanYaChopFrySpicyAmount() {
        return quanYaChopFrySpicyAmount;
    }

    public void setQuanYaChopFrySpicyAmount(int quanYaChopFrySpicyAmount) {
        this.quanYaChopFrySpicyAmount = quanYaChopFrySpicyAmount;
    }

    public int getBanYaChopFryAmount() {
        return banYaChopFryAmount;
    }

    public void setBanYaChopFryAmount(int banYaChopFryAmount) {
        this.banYaChopFryAmount = banYaChopFryAmount;
    }

    public int getBanYaChopFrySpicyAmount() {
        return banYaChopFrySpicyAmount;
    }

    public void setBanYaChopFrySpicyAmount(int banYaChopFrySpicyAmount) {
        this.banYaChopFrySpicyAmount = banYaChopFrySpicyAmount;
    }

    public int getQuanYaChopPlateAmount() {
        return quanYaChopPlateAmount;
    }

    public void setQuanYaChopPlateAmount(int quanYaChopPlateAmount) {
        this.quanYaChopPlateAmount = quanYaChopPlateAmount;
    }

    public int getBanYaChopPlateAmount() {
        return banYaChopPlateAmount;
    }

    public void setBanYaChopPlateAmount(int banYaChopPlateAmount) {
        this.banYaChopPlateAmount = banYaChopPlateAmount;
    }

    public int getQuanJiShouPaJiAmount() {
        return quanJiShouPaJiAmount;
    }

    public void setQuanJiShouPaJiAmount(int quanJiShouPaJiAmount) {
        this.quanJiShouPaJiAmount = quanJiShouPaJiAmount;
    }

    public int getBanJiShouPaJiAmount() {
        return banJiShouPaJiAmount;
    }

    public void setBanJiShouPaJiAmount(int banJiShouPaJiAmount) {
        this.banJiShouPaJiAmount = banJiShouPaJiAmount;
    }

    public int getHeYeBingAmount() {
        return heYeBingAmount;
    }

    public void setHeYeBingAmount(int heYeBingAmount) {
        this.heYeBingAmount = heYeBingAmount;
    }

    public int getTianMianJiangAmount() {
        return tianMianJiangAmount;
    }

    public void setTianMianJiangAmount(int tianMianJiangAmount) {
        this.tianMianJiangAmount = tianMianJiangAmount;
    }

    @Override
    public String toString() {
        return "OrderId{" +
                "id='" + id + '\'' +
                ", quanYaTwoEatAmount=" + quanYaTwoEatAmount +
                ", quanJiaTwoEatSpicyAmount=" + quanJiaTwoEatSpicyAmount +
                ", banYaTwoEatAmount=" + banYaTwoEatAmount +
                ", banYaTwoEatSpicyAmount=" + banYaTwoEatSpicyAmount +
                ", quanYaChopFryAmount=" + quanYaChopFryAmount +
                ", quanYaChopFrySpicyAmount=" + quanYaChopFrySpicyAmount +
                ", banYaChopFryAmount=" + banYaChopFryAmount +
                ", banYaChopFrySpicyAmount=" + banYaChopFrySpicyAmount +
                ", quanYaChopPlateAmount=" + quanYaChopPlateAmount +
                ", banYaChopPlateAmount=" + banYaChopPlateAmount +
                ", quanJiShouPaJiAmount=" + quanJiShouPaJiAmount +
                ", banJiShouPaJiAmount=" + banJiShouPaJiAmount +
                ", heYeBingAmount=" + heYeBingAmount +
                ", tianMianJiangAmount=" + tianMianJiangAmount +
                '}';
    }
}
