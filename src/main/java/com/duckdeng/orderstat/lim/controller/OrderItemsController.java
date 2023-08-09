package com.duckdeng.orderstat.lim.controller;

import com.duckdeng.orderstat.lim.model.OrderItems;
import com.duckdeng.orderstat.lim.service.OrderItemsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/orderItems")
public class OrderItemsController {

    public OrderItemsService orderItemsService;

    public OrderItemsController(OrderItemsService orderItemsService) {
        this.orderItemsService = orderItemsService;
    }

    @PostMapping("/")
    public String createOrderItems(@RequestBody OrderItems orderItems) throws ExecutionException, InterruptedException {
        return orderItemsService.createOrderItems(orderItems);
    }

    @GetMapping("/{orderItemKey}")
    public OrderItems getOrderItems(@PathVariable String orderItemKey) throws ExecutionException, InterruptedException {
        return orderItemsService.getOrderItems(orderItemKey);
    }

    @PutMapping("/{orderItemKey}")
    public String updateOrderItems(@PathVariable String orderItemKey, @RequestBody OrderItems orderItems) throws ExecutionException, InterruptedException {
        return orderItemsService.updateOrderItems(orderItemKey, orderItems);
    }

    @DeleteMapping("/{orderItemKey}")
    public String deleteOrderItems(@PathVariable String orderItemKey) {
        return orderItemsService.deleteOrderItems(orderItemKey);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testGetEndPoint() {
        return ResponseEntity.ok("Test OrderItemsController ok");
    }
}
