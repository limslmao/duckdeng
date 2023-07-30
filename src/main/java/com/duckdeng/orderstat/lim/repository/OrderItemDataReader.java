package com.duckdeng.orderstat.lim.repository;

import com.duckdeng.orderstat.lim.model.OrderItem;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class OrderItemDataReader {
    private static final String FILE_PATH = "orderrecord.xlsx";
    private static final String SHEET_NAME = "OrderItems";
    private static final int COLUMN_ITEM = 0;
    private static final int COLUMN_PRICE = 1;

    public List<OrderItem> readOrderItems() throws IOException {
        List<OrderItem> orderItems = new ArrayList<>();

        FileInputStream file = new FileInputStream(FILE_PATH);
        Workbook workbook = new XSSFWorkbook(file);
        Sheet sheet = workbook.getSheet(SHEET_NAME);

        Iterator<Row> rowIterator = sheet.iterator();
        if (rowIterator.hasNext()) {
            rowIterator.next(); // 跳過第一行
        }


        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Cell itemCell = row.getCell(COLUMN_ITEM);
            Cell priceCell = row.getCell(COLUMN_PRICE);

            String item = itemCell.getStringCellValue();
            int price = (int)priceCell.getNumericCellValue();

            OrderItem orderItem = new OrderItem(item, price);
            orderItems.add(orderItem);
        }

        workbook.close();
        file.close();

        return orderItems;
    }
}
