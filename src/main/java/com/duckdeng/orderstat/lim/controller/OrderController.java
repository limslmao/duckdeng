package com.duckdeng.orderstat.lim.controller;

import com.duckdeng.orderstat.lim.model.OrderItem;
import com.duckdeng.orderstat.lim.repository.OrderItemDataReader;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import java.util.List;

@Controller
public class OrderController {

    @GetMapping("/orders")
    public String showOrderList(Model model) throws IOException {
        OrderItemDataReader reader = new OrderItemDataReader();
        List<OrderItem> orderItems = reader.readOrderItems();

        model.addAttribute("orderItems", orderItems);

        return "order-list";
    }
}