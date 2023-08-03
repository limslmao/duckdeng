package com.duckdeng.orderstat.lim.controller;

import com.duckdeng.orderstat.lim.model.OrderId;
import com.duckdeng.orderstat.lim.model.OrderItem;
import com.duckdeng.orderstat.lim.repository.OrderIdWithAmountReader;
import com.duckdeng.orderstat.lim.repository.OrderIdWithDateReader;
import com.duckdeng.orderstat.lim.repository.OrderItemDataReader;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.util.List;

@Controller
public class OrderController {

    @GetMapping("/")
    public String redirectToHome(Model model) throws IOException {
        return "ex";
    }
    //讀取菜單資料並輸出到網頁
    @GetMapping("/orderMenu")
    public String readOrderItems(Model model) throws IOException {
        OrderItemDataReader reader = new OrderItemDataReader();
        List<OrderItem> orderItems = reader.readOrderItems();
        model.addAttribute("orderItems", orderItems);
        return "orderMenu";
    }

    //讀取訂單
    @GetMapping("/orderIdWithAmount")
    public String readOrderIdWithAmount(Model model) throws IOException {
        OrderIdWithAmountReader reader = new OrderIdWithAmountReader();
        List<OrderItem> orderItems = reader.readOrderItems();
        model.addAttribute("orderItems", orderItems);
        return "orderIdWithAmount";
    }

    //讀取訂單品項
    @GetMapping("/orderIdWithDate")
    public String readOrderIdWithDate(Model model) throws IOException {
        OrderIdWithDateReader reader = new OrderIdWithDateReader();
        List<OrderId> orderIdWithDateList = reader.readOrderItems();
        model.addAttribute("orderItems", orderIdWithDateList);
        return "orderIdWithDate";
    }
}