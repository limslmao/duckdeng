/*  current API used: GET,PUT,DELETE /api/orderDetails ; GET /api/orderItems           */
/*  main function: query update delete  orderDetails                                   */
/*  version record:                                                                    */
/*  --date--   --name--    --event--                                   --version--     */
/*  2023/08/29   Arte      codeReview                                     V00          */
/*  2023/08/29   Arte      updateList dynamic create, dynamic convert     V01          */
/*  2023/09/05   Arte      date pick fix                                  V02          */

let queryResponseJson = {
  "orderDtl": [
    {
      "orderId": "20230808001",
      "orderItem": {
        "001": 1,
        "002": 1,
        "003": 2,
        
      },
      "totalAmount": 670,
      "discount":50,
      "remark":"測試"
    },
    {
      "orderId": "20230808002",
      "orderItem": {
        "001": 1,
        "002": 1,
        "003": 2,
      },
      "totalAmount": 670,
      "discount":50,
      "remark":"測試"
    }
  ]
}; //GET /api/orderDetails
let queryResponseJson_OI = {
 "menuDtl": [
     {
       "itemId": "001",
       "itemType": "main",
       "itemUnit": "full",
       "itemIngred": "duck",
       "itemSpicy": "N",
       "itemCookMethod": "two",
       "price": 600,
       "note": "全鴨二吃"
     }]
} // GET /api/orderItems
let updateRequestJson = {
  "orderItem": {
    "001": 2,
    "013": 1

  },
     "discount":50,
      "remark":"測試",
  "totalAmount": 840
}
let orderId = '';
let totalAmount = 0;
let itemId_add = []; /* V01 */
let itemId_main = []; /* V01 */
$(document).ready(function() {
    getOrderItemsData() /* V01 */
    $('#search').on('click', function(event) {
        $('#loading').removeAttr('hidden');
        event.preventDefault(); // Prevent the default link navigation
        getOrderDtkData(); // Call your function
    });
    $('.date-btn').on('click', function(event) {
        event.preventDefault(); // Prevent the default link navigation
        let clickedButtonId = $(this).attr('id');
        datePickBtn(clickedButtonId)
    });
    $('#dataContext').on('click', '.deleteData', function() {
        orderId = $(this).closest('tr').find('#orderId').text();
        deleteOrderDtlData(orderId)
    });
    $('#dataContext').on('click', '.updateData', function() {
        orderId = $(this).closest('tr').find('#orderId').text();
        orderItemsParser(queryResponseJson_OI) /* V01 */
    });
    $('.modal-footer').on('click', '#updateSubmit', function() {
        updateOrderDtlData(orderId);
    });
});
function getOrderItemsData() {
    $.ajax({
      type: 'GET',
      url: '/api/orderItems ',
      success: function(response) {
        $('#loading').attr('hidden', true);
        queryResponseJson_OI = response;
        $('#addItem').prop('disabled', false);
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
} /* V01 */
function orderItemsParser(response) { //add,main目前hardCode
            //add
           const filteredItems = response.menuDtl.filter(item => item.itemType === "add");//過濾出itemType為add的物件
           let itemNameList_add = []
           let itemPrice_add = []
           for (let i = 0; i < filteredItems.length; i++) {
               itemNameList_add.push(filteredItems[i].note);
               itemPrice_add.push(filteredItems[i].price);
               itemId_add.push(filteredItems[i].itemId);
           }
           itemHtmlCreate_add(itemNameList_add,itemPrice_add,itemId_add)
           // main
           const filteredItems_main = response.menuDtl.filter(item => item.itemType === "main");
           let itemNameList_main = []
           let itemPrice_main = []
           let labIngred_main = []

           for (let i = 0; i < filteredItems_main.length; i++) {
               itemNameList_main.push(filteredItems_main[i].note);
               itemPrice_main.push(filteredItems_main[i].price);
               itemId_main.push(filteredItems_main[i].itemId);
               labIngred_main.push(filteredItems_main[i].itemIngred);//目前hardCode設定html只有雞,鴨
           }
           itemHtmlCreate_main(itemNameList_main,itemPrice_main,itemId_main,labIngred_main)
           console.log(itemId_add)
           $('#orderDtlCountTittle').text('訂單:'+orderId+' 修改')
           $('#myModal').modal('show'); // 显示 Modal
} /* V01 */
function itemHtmlCreate_add(itemNameList,itemPrice,itemId_add) {
    let $menuList_add = $('#menuList_add')
    $menuList_add.empty()
    itemHtml_add = ''
    for (i=0;i<itemNameList.length;i++) {
        itemHtml_add += '<div class="col-10"> <label>'+itemNameList[i]+':</label><input type="number" class="form-control" placeholder="請輸入加購份數 1份/'+itemPrice[i]+'" id = "'+itemId_add[i]+'"> </div>'
    }
    $menuList_add.append(itemHtml_add)
} /* V01 */
function itemHtmlCreate_main(itemNameList_main,itemPrice_main,itemId_main,labIngred_main){ // 雞,鴨目前hardCode
    $itemHtml_chicken = $('#main_chicken')
    $itemHtml_duck = $('#main_duck')
    $itemHtml_chicken.empty()
    $itemHtml_duck.empty()
    for (i=0;i<itemNameList_main.length;i++) {
        mainItemHtml = '<div class="col-10"> <label>'+itemNameList_main[i]+':</label><input type="number" class="form-control" placeholder="請輸入主餐份數 1份/'+itemPrice_main[i]+'" id = "'+itemId_main[i]+'"> </div>'
        if (labIngred_main[i] == 'chicken') {
            $itemHtml_chicken.append(mainItemHtml)
        }
        if (labIngred_main[i] == 'duck') {
            $itemHtml_duck.append(mainItemHtml)
        }
   }
} /* V01 */
function updateOrderDtlData(orderId) {
    let result = calculatePrice();
    updateRequestJson.totalAmount = totalAmount;
    if (result != false) {
        const orderJsonString = JSON.stringify(updateRequestJson);
             $.ajax({
                  type: 'PUT',
                  url: '/api/orderDetails/'+orderId+'',
                  data: orderJsonString, // 將 JSON 字串傳送至伺服器
                  contentType: 'application/json', // 設定 content type 為 JSON
                  success: function(response) {
                    $('#loading').attr('hidden', true);
                    $('#myModal').modal('hide');
                    console.log('Response:', JSON.stringify(response, null, 2));
                    alert('訂單'+orderId+'已更新成功')
                    getOrderDtkData()
                  },
                  error: function(xhr, status, error) {
                    console.log('Error:', error);
                  }
                });
    }

}
function calculatePrice() {
    sum = 0;
    for (let i = 1; i <= queryResponseJson_OI.menuDtl.length; i++) {
        if (i<10) {
            count = $('#00' + i).val()||0;
            updateRequestJson.orderItem['00' + i] = parseInt(count)
            sum += priceConvert(count,'00' + i); /* V01 */
        } else {
            count = $('#0' + i).val()||0;
            updateRequestJson.orderItem['0' + i] = parseInt(count)
            sum += priceConvert(count,'0' + i); /* V01 */
        }
    }
    if (sum == 0) {
        alert("請選擇品項")
        return false
    }
    discount = $('#discount').val();
    updateRequestJson.discount = discount
    updateRequestJson.remark = $('#remark').val();
    totalAmount = sum - discount
//    labelHtml = '<label>金額:'+sum+'</label>'
//    console.log(labelHtml)
//    menuList.append(labelHtml)
}
function priceConvert(count,targetItemId) { //利用queryResponseJson.menuDtl 取得菜單品項對應的金額
    let targetPrice = 0;
    for (const item of queryResponseJson_OI.menuDtl) {
        if (item.itemId === targetItemId) {
            targetPrice = item.price;
            break;
        }
    }
    return targetPrice * count
}/* V01 */
function deleteOrderDtlData(orderId) {
    $.ajax({
      type: 'DELETE',
      url: '/api/orderDetails/'+orderId+'',
      success: function(response) {
        $('#loading').attr('hidden', true);
        console.log('Response:', JSON.stringify(response, null, 2));
        alert('訂單'+orderId+'已成功刪除')
        getOrderDtkData()
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
}
function datePickBtn(clickedButtonId) {
   const today = new Date();
   let year = today.getFullYear();
   let month = today.getMonth() + 1 /* V02 */
   let day = today.getDate();
   switch (clickedButtonId) {
       case 'today':
           day = String(day).padStart(2, '0');
           break;
       case 'yesterday':
           if (month+day == 2 ){ //   1/1自動跳去年 /* V02 */
            year = year - 1
           }
           day = String(day - 1).padStart(2, '0'); /* V02 */
           if (day == 0) { /* V02 */
            const lastDayOfLastMonth = new Date(year, month - 1, 0);
            month =  String(lastDayOfLastMonth.getMonth() + 1 ).padStart(2, '0');
            day = String(lastDayOfLastMonth.getDate()).padStart(2, '0');
           }
           break;
       case 'thisWeek': // 一到日
            const todayOfWeek = new Date(today);
            const dayOfWeek = today.getDay();
            todayOfWeek.setDate(day - dayOfWeek + 1);
            const formattedStartDate = `${year}${String(month).padStart(2, '0')}${String(todayOfWeek.getDate()).padStart(2, '0')}`; /* V02 */
            const endOfWeek = new Date(todayOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            const formattedEndDate = `${endOfWeek.getFullYear()}${String(endOfWeek.getMonth() + 1).padStart(2, '0')}${String(endOfWeek.getDate()).padStart(2, '0')}`;
            $('#startDate').val(formattedStartDate);
            $('#endDate').val(formattedEndDate);
            return;
       default:
           break;
   }
   const formattedDate = `${year}${String(month).padStart(2, '0')}${day}`; /* V02 */
   $('#startDate').val(formattedDate);
   $('#endDate').val(formattedDate);
}
function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = (today.getDate()).toString().padStart(2, '0');
  return `${year}${month}${day}`;
}
function getOrderDtkData() {
console.log("inin")
let startDate = $('#startDate').val()||"20230810"
let endDate = $('#endDate').val()|| getFormattedDate()
$.ajax({
  type: 'GET',
  url: '/api/orderDetails?startDate='+startDate+'&endDate='+endDate+' ',
  success: function(response) {
    $('#loading').attr('hidden', true);
//    console.log('Response:', JSON.stringify(response, null, 2));
    queryResponseJson = response
    filterQueryResponseJson();
    searchContentHtmlCreate();
  },
  error: function(xhr, status, error) {
    console.log('Error:', error);
  }
});

}
function filterQueryResponseJson() {
  queryResponseJson.orderDtl = queryResponseJson.orderDtl.map(order => ({
    ...order,
    orderItem: Object.fromEntries(Object.entries(order.orderItem).filter(([key, value]) => value !== 0))
  }));
}
function searchContentHtmlCreate() {
  $('#dataContext').empty(); // 清空数据，避免重复添加
  let count = 0;
  for (const order of queryResponseJson.orderDtl) {
    const newRow = $('<tr>');
    newRow.append('<td id ="orderId">' + order.orderId + '</td>');
    newRow.append('<td>' + orderDtlHtmlCreate(count) + '</td>');
    newRow.append('<td>' + order.totalAmount + (order.discount && order.discount !== 0 ? ' <br> (已折扣:' + order.discount + ')' : '') + '</td>');
    newRow.append('<td>' + (order.remark == null ? '無' : order.remark) + '</td>');
   newRow.append('<td><button class="btn btn-danger deleteData">刪除</button><br><br><button class="btn btn-primary updateData">修改</button></td>');
    $('#dataContext').append(newRow);
    count++;
  }
}
function orderDtlHtmlCreate(count) {
    let tdHtml = '';
    const orderItem = queryResponseJson.orderDtl[count].orderItem;
    for (const key in orderItem) {
            tdHtml += '<tr><td>' +orderConvert(key) + '</td><td>' + orderItem[key] + '</td></tr>'; /* V01 */
    }
    const tableHtml = '<table class="table table-striped">' +
        '<thead><tr><th>餐點</th><th>數量</th></tr></thead>' +
        '<tbody>' + tdHtml + '</tbody>' +
        '</table>';
    return tableHtml;
}
function orderConvert(targetItemId) { //利用queryResponseJson.menuDtl 取得菜單品項對應的金額
    let targetName = '';
    for (const item of queryResponseJson_OI.menuDtl) {
        if (item.itemId === targetItemId) {
            targetName = item.note;
            break;
        }
    }
    return targetName;
}/* V01 */




