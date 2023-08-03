package com.duckdeng.orderstat.lim.controller;

import com.duckdeng.orderstat.lim.model.OrderId;
import com.duckdeng.orderstat.lim.model.OrderItem;
import com.duckdeng.orderstat.lim.repository.OrderIdWithAmountReader;
import com.duckdeng.orderstat.lim.repository.OrderIdWithDateReader;
import com.duckdeng.orderstat.lim.repository.OrderItemDataReader;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderRESTfulController {

    //讀取菜單資料並輸出到網頁
    @GetMapping("/orderMenu")
    public List<OrderItem> readOrderItems(Model model) throws IOException {
        OrderItemDataReader reader = new OrderItemDataReader();
        List<OrderItem> orderItems = reader.readOrderItems();
        return orderItems;
    }

    //讀取訂單
    @GetMapping("/orderIdWithAmount")
    public List<OrderItem> readOrderIdWithAmount(Model model) throws IOException {
        OrderIdWithAmountReader reader = new OrderIdWithAmountReader();
        List<OrderItem> orderItems = reader.readOrderItems();
        return orderItems;
    }

    //讀取訂單品項
    @GetMapping("/orderIdWithDate")
    public List<OrderId> readOrderIdWithDate(Model model) throws IOException {
        OrderIdWithDateReader reader = new OrderIdWithDateReader();
        List<OrderId> orderIdWithDateList = reader.readOrderItems();
        return orderIdWithDateList;
    }
}