package com.duckdeng.orderstat.lim.controller;

import com.duckdeng.orderstat.lim.model.OrderItems;
import com.duckdeng.orderstat.lim.service.OrderItemsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/orderItems")
public class OrderItemsController {

    public OrderItemsService orderItemsService;

    public OrderItemsController(OrderItemsService orderItemsService) {
        this.orderItemsService = orderItemsService;
    }

    @PostMapping
    public ResponseEntity<?> createOrderItems(@RequestBody OrderItems orderItems) {
        try {
            String updateTime = orderItemsService.createOrderItems(orderItems);
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Order item created successfully.");
            responseBody.put("updateTime", updateTime);
            return ResponseEntity.status(HttpStatus.CREATED).body(responseBody);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating order item.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input data.");
        }
    }

    @GetMapping("/{orderItemKey}")
    public OrderItems getOrderItems(@PathVariable String orderItemKey) throws ExecutionException, InterruptedException {
        return orderItemsService.getOrderItems(orderItemKey);
    }

    @GetMapping
    public Map<String, List<OrderItems>> getAllOrderItems() throws ExecutionException, InterruptedException {
        return orderItemsService.getAllOrderItems();
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
