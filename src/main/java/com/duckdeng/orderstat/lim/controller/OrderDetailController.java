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
            if (orderDetail == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Order detail cannot be null.");
            }
            OrderDetail newOrderDetail = orderDetailService.createOrderDetail(orderDetail);
            return ResponseEntity.status(HttpStatus.CREATED).body(newOrderDetail);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
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
    public ResponseEntity<?> getMultiOrderDetailByDate(@RequestParam String startDate, @RequestParam(required = false) String endDate) {
        try {
            Map<String, List<OrderDetail>> result = orderDetailService.getMultiOrderDetailByDate(startDate, endDate);
            if (result.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No order details found for the given date range.");
            }
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching order details.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid input data.");
        }
    }

    @PutMapping("/{orderDetailId}")
    public ResponseEntity<?> updateOrderDetail(@PathVariable String orderDetailId, @RequestBody OrderDetail orderDetail) {
        try {
            boolean isUpdated = orderDetailService.updateOrderDetail(orderDetailId, orderDetail);
            if (isUpdated) {
                return ResponseEntity.ok("Order detail updated successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order detail not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating order detail.");
        }
    }

    @DeleteMapping("/{orderDetailId}")
    public ResponseEntity<?> deleteOrderDetail(@PathVariable String orderDetailId) {
        try {
            boolean isDeleted = orderDetailService.deleteOrderDetail(orderDetailId);

            if (isDeleted) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order detail not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while deleting the order detail.");
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testGetEndPoint() {
        return ResponseEntity.ok("Test OrderDetailController ok");
    }

}
