package com.duckdeng.orderstat.lim.model;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;
@Getter
@Setter
public class CountDetail {
    private String range;
    private Map<String, Integer> count;
}
