package com.duckdeng.orderstat.lim.repository;

import com.duckdeng.orderstat.lim.model.OrderItem;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class OrderIdWithAmountReader {
    private static final String FILE_PATH = "orderrecord.xlsx";
    private static final String SHEET_NAME = "orderIdwithAmount";
    private static final int COLUMN_ID = 0;
    private static final int COLUMN_AMOUNT = 1;

    public List<OrderItem> readOrderItems() throws IOException {
        List<OrderItem> orderIds = new ArrayList<>();

        FileInputStream file = new FileInputStream(FILE_PATH);
        Workbook workbook = new XSSFWorkbook(file);
        Sheet sheet = workbook.getSheet(SHEET_NAME);

        Iterator<Row> rowIterator = sheet.iterator();
        if (rowIterator.hasNext()) {
            rowIterator.next(); // 跳過第一行
        }


        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Cell idCell = row.getCell(COLUMN_ID);
            Cell amountCell = row.getCell(COLUMN_AMOUNT);

            String id = idCell.getStringCellValue();
            int amount = (int)amountCell.getNumericCellValue();

            OrderItem orderItem = new OrderItem(id, amount);
            orderIds.add(orderItem);
        }

        workbook.close();
        file.close();

        return orderIds;
    }
}
