package com.duckdeng.orderstat.lim.controller;

import com.duckdeng.orderstat.lim.model.ReportData;
import com.duckdeng.orderstat.lim.service.OrderReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api/orderReports")
public class OrderReportController {
    public OrderReportService orderReportService;

    public OrderReportController(OrderReportService orderReportService) {
        this.orderReportService = orderReportService;
    }

    @GetMapping
    public ReportData getReportDataByDateAndType(@RequestParam String startDate,
                                                 @RequestParam String endDate,
                                                 @RequestParam String dataRangeType,
                                                 @RequestParam String itemType) throws ExecutionException, InterruptedException {
        return "itemCost".equals(itemType)
                ? orderReportService.getReportDataRevenueAndCost(startDate, endDate, dataRangeType)
                : orderReportService.getReportDataByDateAndType(startDate, endDate, dataRangeType, itemType);
    }
}
