package com.duckdeng.orderstat.lim.service.strategy;

import com.duckdeng.orderstat.lim.model.OrderPlatformDetail;

import java.util.List;
import java.util.concurrent.ExecutionException;

public interface OrderImporter {
    void processOrder(List<OrderPlatformDetail> orderDetails) throws ExecutionException, InterruptedException;

}

