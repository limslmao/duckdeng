package com.duckdeng.orderstat.lim.service.strategy;

import com.duckdeng.orderstat.lim.model.OrderPlatformDetail;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class UberEatsOrderImporter implements OrderImporter {
    @Override
    public void processOrder(List<OrderPlatformDetail> orderDetails) {
        // Implement UberEats specific logic
    }
}
