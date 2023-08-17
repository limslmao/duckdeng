package com.duckdeng.orderstat.lim.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Set;

@Getter
@Setter
public class ReportData {
    private Set<String> itemType;
    private String rangeType;
    private List<CountDetail> countDtl;
}
