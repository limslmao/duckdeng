package com.duckdeng.orderstat.lim.dto;

import com.duckdeng.orderstat.lim.model.OrderPlatformDetail;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ImportOrderRequestDTO {
    private List<OrderPlatformDetail> foodPandaDtl;
    private List<OrderPlatformDetail> uberEatDtl;
}
