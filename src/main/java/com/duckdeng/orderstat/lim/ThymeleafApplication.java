package com.duckdeng.orderstat.lim;

import com.duckdeng.orderstat.lim.model.OrderId;
import com.duckdeng.orderstat.lim.model.OrderItem;
import com.duckdeng.orderstat.lim.model.OrderItemEntry;
import com.duckdeng.orderstat.lim.repository.OrderIdWithAmountReader;
import com.duckdeng.orderstat.lim.repository.OrderIdWithDateReader;
import com.duckdeng.orderstat.lim.repository.OrderItemDataReader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.util.List;

@SpringBootApplication
public class ThymeleafApplication {

    public static void main(String[] args) {

        SpringApplication.run(ThymeleafApplication.class, args);

//		try {
//			List<OrderItem> orderItems = testOrderIdDataReader();
//			List<OrderId> orderIds = testOrderIdWithDateReader();
//
//			// 處理從 OrderItemDataReader 中讀取的 orderItems
//			for (OrderItem orderItem : orderItems) {
//				System.out.println(orderItem.getItemName() + " - " + orderItem.getUnitPrice());
//			}
//
//			for (OrderId orderId : orderIds) {
//				System.out.println(orderId);
//			}
//
//
//		} catch (IOException e) {
//			e.printStackTrace();
//		}


//		OrderItemEntry orderItemEntry = new OrderItemEntry();
//		OrderItem order1 = new OrderItem("quanYaChopFry",590);
//		OrderItem order2 = new OrderItem("banYaChopFry",300);
//		OrderItem order3 = new OrderItem("banYaChopPlate",290);
//		System.out.println(order1.getItemName());
//		order1.getUnitPrice();

    }

	//測試orderitem可以取excel內所有資料
    public static List<OrderItem> testOrderItemDataReader() throws IOException {
        OrderItemDataReader reader = new OrderItemDataReader();
        return reader.readOrderItems();
    }

    public static List<OrderItem> testOrderIdDataReader() throws IOException {
        OrderIdWithAmountReader reader = new OrderIdWithAmountReader();
        return reader.readOrderItems();
    }

	public static List<OrderId> testOrderIdWithDateReader() throws IOException {
		OrderIdWithDateReader reader = new OrderIdWithDateReader();
		return reader.readOrderItems();
	}
}

// 模擬取得所有 OrderItem 的方法

