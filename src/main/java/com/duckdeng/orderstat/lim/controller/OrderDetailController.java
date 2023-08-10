package com.duckdeng.orderstat.lim.controller;

import com.duckdeng.orderstat.lim.model.OrderDetail;
import com.duckdeng.orderstat.lim.service.OrderDetailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/orderDetails")
public class OrderDetailController {

    public OrderDetailService orderDetailService;

    public OrderDetailController(OrderDetailService orderDetailService) {
        this.orderDetailService = orderDetailService;
    }

    @PostMapping
    public ResponseEntity<?> createOrderDetail(@RequestBody OrderDetail orderDetail) {
        try {
            OrderDetail newOrderDetail = orderDetailService.createOrderDetail(orderDetail);
            return ResponseEntity.status(HttpStatus.CREATED).body(newOrderDetail);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating order detail.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input data.");
        }
    }

    @GetMapping("/{orderDetailId}")
    public OrderDetail getOrderDetail(@PathVariable String orderDetailId) throws ExecutionException, InterruptedException {
        return orderDetailService.getOrderDetail(orderDetailId);
    }

    @GetMapping
    public Map<String, List<OrderDetail>> getMultiOrderDetailByDate(@RequestParam String startDate, @RequestParam(required = false) String endDate) throws ExecutionException, InterruptedException {
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
