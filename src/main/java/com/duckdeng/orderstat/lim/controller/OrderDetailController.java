package com.duckdeng.orderstat.lim.controller;

import com.duckdeng.orderstat.lim.model.Order;
import com.duckdeng.orderstat.lim.model.OrderDetail;
import com.duckdeng.orderstat.lim.model.OrderItems;
import com.duckdeng.orderstat.lim.service.OrderDetailService;
import com.duckdeng.orderstat.lim.service.OrderItemsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/orderDetails")
public class OrderDetailController {

    public OrderDetailService orderDetailService;

    public OrderDetailController(OrderDetailService orderDetailService) {
        this.orderDetailService = orderDetailService;
    }

    @PostMapping("/")
    public Order createOrderDetail(@RequestBody OrderDetail orderDetail) throws ExecutionException, InterruptedException {
        return orderDetailService.createOrderDetail(orderDetail);
    }

    @GetMapping("/{orderDetailId}")
    public OrderDetail getOrderDetail(@PathVariable String orderDetailId) throws ExecutionException, InterruptedException {
        return orderDetailService.getOrderDetail(orderDetailId);
    }

    @GetMapping
    public List<OrderDetail> getMultiOrderDetailByDate(@RequestParam String startDate, @RequestParam String endDate) throws ExecutionException, InterruptedException {
        return orderDetailService.getMultiOrderDetailByDate(startDate, endDate);
    }

    @PutMapping("/{orderDetailId}")
    public String updateOrderDetail(@PathVariable String orderDetailId, @RequestBody OrderDetail orderDetail) throws ExecutionException, InterruptedException {
        return orderDetailService.updateOrderDetail(orderDetailId, orderDetail);
    }

    @DeleteMapping("/{orderDetailId}")
    public String deleteOrderDetail(@PathVariable String orderDetailId) {
        return orderDetailService.deleteOrderDetail(orderDetailId);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testGetEndPoint() {
        return ResponseEntity.ok("Test OrderDetailController ok");
    }

}
