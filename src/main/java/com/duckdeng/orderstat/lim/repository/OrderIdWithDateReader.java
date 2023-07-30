package com.duckdeng.orderstat.lim.repository;

import com.duckdeng.orderstat.lim.model.OrderId;
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

public class OrderIdWithDateReader {
    private static final String FILE_PATH = "orderrecord.xlsx";
    private static final String SHEET_NAME = "orderIdwithDate";
    private static final int id = 0;
    private static final int QUAN_YA_TWO_EAT = 1;
    private static final int QUAN_JIA_TWO_EAT_SPICY = 2;
    private static final int BAN_YA_TWO_EAT = 3;
    private static final int BAN_YA_TWO_EAT_SPICY = 4;
    private static final int QUAN_YA_CHOP_FRY = 5;
    private static final int QUAN_YA_CHOP_FRY_SPICY = 6;
    private static final int BAN_YA_CHOP_FRY = 7;
    private static final int BAN_YA_CHOP_FRY_SPICY = 8;
    private static final int QUAN_YA_CHOP_PLATE = 9;
    private static final int BAN_YA_CHOP_PLATE = 10;
    private static final int QUAN_JI_SHOU_PA_JI = 11;
    private static final int BAN_JI_SHOU_PA_JI = 12;
    private static final int HE_YE_BING = 13;
    private static final int TIAN_MIAN_JIANG = 14;
    public List<OrderId> readOrderItems() throws IOException {

        List<OrderId> orderItems = new ArrayList<>();

        FileInputStream file = new FileInputStream(FILE_PATH);
        Workbook workbook = new XSSFWorkbook(file);
        Sheet sheet = workbook.getSheet(SHEET_NAME);

        Iterator<Row> rowIterator = sheet.iterator();
        if (rowIterator.hasNext()) {
            rowIterator.next(); // 跳過第一行
        }


        while (rowIterator.hasNext()) {
            Row row = rowIterator.next();
            Cell idCell = row.getCell(id);
            Cell quanYaTwoEatCell = row.getCell(QUAN_YA_TWO_EAT);
            Cell quanJiaTwoEatSpicyCell = row.getCell(QUAN_JIA_TWO_EAT_SPICY);
            Cell banYaTwoEatCell = row.getCell(BAN_YA_TWO_EAT);
            Cell banYaTwoEatSpicyCell = row.getCell(BAN_YA_TWO_EAT_SPICY);
            Cell quanYaChopFryCell = row.getCell(QUAN_YA_CHOP_FRY);
            Cell quanYaChopFrySpicyCell = row.getCell(QUAN_YA_CHOP_FRY_SPICY);
            Cell banYaChopFryCell = row.getCell(BAN_YA_CHOP_FRY);
            Cell banYaChopFrySpicyCell = row.getCell(BAN_YA_CHOP_FRY_SPICY);
            Cell quanYaChopPlateCell = row.getCell(QUAN_YA_CHOP_PLATE);
            Cell banYaChopPlateCell = row.getCell(BAN_YA_CHOP_PLATE);
            Cell quanJiShouPaJiCell = row.getCell(QUAN_JI_SHOU_PA_JI);
            Cell banJiShouPaJiCell = row.getCell(BAN_JI_SHOU_PA_JI);
            Cell heYeBingCell = row.getCell(HE_YE_BING);
            Cell tianMianJiangCell = row.getCell(TIAN_MIAN_JIANG);

            String id = idCell.getStringCellValue();
            int quanYaTwoEat = (int)quanYaTwoEatCell.getNumericCellValue();
            int banYaTwoEat = (int)banYaTwoEatCell.getNumericCellValue();
            int quanJiaTwoEatSpicy = (int) quanJiaTwoEatSpicyCell.getNumericCellValue();
            int banYaTwoEatSpicy = (int) banYaTwoEatSpicyCell.getNumericCellValue();
            int quanYaChopFry = (int) quanYaChopFryCell.getNumericCellValue();
            int quanYaChopFrySpicy = (int) quanYaChopFrySpicyCell.getNumericCellValue();
            int banYaChopFry = (int) banYaChopFryCell.getNumericCellValue();
            int banYaChopFrySpicy = (int) banYaChopFrySpicyCell.getNumericCellValue();
            int quanYaChopPlate = (int) quanYaChopPlateCell.getNumericCellValue();
            int banYaChopPlate = (int) banYaChopPlateCell.getNumericCellValue();
            int quanJiShouPaJi = (int) quanJiShouPaJiCell.getNumericCellValue();
            int banJiShouPaJi = (int) banJiShouPaJiCell.getNumericCellValue();
            int heYeBing = (int) heYeBingCell.getNumericCellValue();
            int tianMianJiang = (int) tianMianJiangCell.getNumericCellValue();

            OrderId orderIdItem = new OrderId(id, quanYaTwoEat, quanJiaTwoEatSpicy,
                    banYaTwoEat, banYaTwoEatSpicy,
                    quanYaChopFry, quanYaChopFrySpicy,
                    banYaChopFry, banYaChopFrySpicy,
                    quanYaChopPlate, banYaChopPlate,
                    quanJiShouPaJi, banJiShouPaJi,
                    heYeBing, tianMianJiang);

            orderItems.add(orderIdItem);
            System.out.println(orderIdItem);
        }

        workbook.close();
        file.close();

        return orderItems;
    }
}
