let initJson = {
  "orderDtl": [
    {
      "orderId": "20230808001",
      "orderItem": {
        "001": 1,
        "002": 1,
        "003": 2,
        "discount":50,
        "remark":"測試"
      },
      "totalAmount": 670
    },
    {
      "orderId": "20230808002",
      "orderItem": {
        "001": 1,
        "002": 1,
        "003": 2,
        "discount":50,
        "remark":"測試"
      },
      "totalAmount": 670,
    }
  ]
};
let updateJson = {
  "orderItem": {
    "001": 2,
    "013": 1

  },
     "discount":50,
      "remark":"測試",
  "totalAmount": 840
}
const orderConvert = {
  '001': '全鴨二吃',
  '002': '全鴨二吃香鍋麻辣',
  '003': '半鴨二吃',
  '004': '半鴨二吃香鍋麻辣',
  '005': '全鴨剁炒',
  '006': '全鴨剁炒香鍋麻辣',
  '007': '半鴨剁炒',
  '008': '半鴨剁炒香鍋麻辣',
  '009': '全鴨剁盤',
  '010': '半鴨剁盤',
  '011': '手扒雞一隻',
  '012': '手扒雞半隻',
  '013': '荷葉餅一份',
  '014': '甜麵醬一份',
  'discount':'折扣',
  'remark':'備註'
};
const priceConvert = {
"001":600,
"002":650,
"003":320,
"004":350,
"005":590,
"006":630,
"007":300,
"008":320,
"009":570,
"010":290,
"011":450,
"012":230,
"013":30,
"014":20
}
let orderId = ''
$(document).ready(function() {
    $('#search').on('click', function(event) {
        $('#loading').removeAttr('hidden');
        event.preventDefault(); // Prevent the default link navigation
        getOrderData(); // Call your function
    });
    $('.date-btn').on('click', function(event) {
        event.preventDefault(); // Prevent the default link navigation
        var clickedButtonId = $(this).attr('id');
        getDate(clickedButtonId)
    });
    $('#dataContext').on('click', '.deleteData', function() {
        orderId = $(this).closest('tr').find('#orderId').text();
        console.log(orderId)
        deleteData(orderId)
    });
    $('#dataContext').on('click', '.updateData', function() {
        orderId = $(this).closest('tr').find('#orderId').text();
        createUpdateListHtml(orderId)
    });
    $('.modal-footer').on('click', '#updateSubmit', function() {
            updateData(orderId);
    });
});
function updateData(orderId) {
    let result = calculatePrice();
    if (result != false) {
        const orderJsonString = JSON.stringify(updateJson);
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
                    getOrderData()
                  },
                  error: function(xhr, status, error) {
                    console.log('Error:', error);
                  }
                });
    }

}
function createUpdateListHtml(orderId){
    $('#orderDtlCountTittle').text('訂單:'+orderId+' 修改')
    var menuList = $('#orderDtlCount')
    menuList.empty()
    for (const key in orderConvert) {
                if (orderConvert.hasOwnProperty(key)) {
                    const value = orderConvert[key];
                    // 创建 label 元素
                    const label = document.createElement('label');
                    label.textContent = value;
                    // 创建 input 元素
                    const input = document.createElement('input');
                    if(key != 'remark') {
                        input.type = 'number';
                    }
                    input.placeholder = '請輸入數量';
                    input.id = key;
                    // 创建 li 元素，将 label 和 input 添加到 li 中
                    const listItem = document.createElement('li');
                    listItem.appendChild(label);
                    listItem.appendChild(input);
                    // 将 li 添加到 ul 中
                    menuList.append(listItem);
                }
    }
    $('#myModal').modal('show'); // 显示 Modal
}
function calculatePrice() {
    sum = 0;
    for (var i = 1; i <= 14; i++) {
        if (i<10) {
            count = $('#00' + i).val()||0;
            updateJson.orderItem['00' + i] = parseInt(count)
            sum += count * priceConvert['00' + i];
        } else {
            count = $('#0' + i).val()||0;
            updateJson.orderItem['0' + i] = parseInt(count)
            sum += count * priceConvert['0' + i];
        }
    }
    if (sum == 0) {
        alert("請選擇品項")
        return false
    }
    discount = $('#discount').val();
    updateJson.discount = discount
    updateJson.remark = $('#remark').val();
    updateJson.totalAmount = sum - discount

//    labelHtml = '<label>金額:'+sum+'</label>'
//    console.log(labelHtml)
//    menuList.append(labelHtml)
}
function deleteData(orderId) {
    $.ajax({
      type: 'DELETE',
      url: '/api/orderDetails/'+orderId+'',
      success: function(response) {
        $('#loading').attr('hidden', true);
        console.log('Response:', JSON.stringify(response, null, 2));
        alert('訂單'+orderId+'已成功刪除')
        getOrderData()
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
}
function getDate(clickedButtonId) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    let day = today.getDate();
    switch (clickedButtonId) {
        case 'today':
            day = String(day).padStart(2, '0');
            break;
        case 'yesterday':
            day = String(day - 1).padStart(2, '0');
            break;
        case 'thisWeek':
            const todayOfWeek = new Date(today);
            const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
            todayOfWeek.setDate(day - dayOfWeek + 1); // Adjust for the beginning of the week
            const formattedStartDate = `${year}${month}${String(todayOfWeek.getDate()).padStart(2, '0')}`;
            todayOfWeek.setDate(day + (7 - dayOfWeek)); // Adjust for the end of the week
            const formattedEndDate = `${year}${month}${String(todayOfWeek.getDate()).padStart(2, '0')}`;
            $('#startDate').val(formattedStartDate);
            $('#endDate').val(formattedEndDate);
            return; // 不再输出 formattedDate
        default:
            break;
    }
    const formattedDate = `${year}${month}${day}`;
    $('#startDate').val(formattedDate);
    $('#endDate').val(formattedDate);
}
function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}
function getOrderData() {
var startDate = $('#startDate').val()||"20230810"
var endDate = $('#endDate').val()|| getFormattedDate()
$.ajax({
  type: 'GET',
  url: '/api/orderDetails?startDate='+startDate+'&endDate='+endDate+' ',
  success: function(response) {
    $('#loading').attr('hidden', true);
    console.log('Response:', JSON.stringify(response, null, 2));
    initJson = response
    filterInitJson();
    contentHtmlInner();
  },
  error: function(xhr, status, error) {
    console.log('Error:', error);
  }
});

}

function filterInitJson() {
  initJson.orderDtl = initJson.orderDtl.map(order => ({
    ...order,
    orderItem: Object.fromEntries(Object.entries(order.orderItem).filter(([key, value]) => value !== 0))
  }));
}

function contentHtmlInner() {
  $('#dataContext').empty(); // 清空数据，避免重复添加
  let count = 0;
  for (const order of initJson.orderDtl) {
    const newRow = $('<tr>');
    newRow.append('<td id ="orderId">' + order.orderId + '</td>');
    newRow.append('<td>' + orderContentCreate(count) + '</td>');
    newRow.append('<td>' + order.totalAmount + (order.discount && order.discount !== 0 ? ' <br> (已折扣:' + order.discount + ')' : '') + '</td>');
    newRow.append('<td>' + (order.remark == null ? '無' : order.remark) + '</td>');
   newRow.append('<td><button class="btn btn-primary deleteData">刪除</button><br><br><button class="btn btn-primary updateData">修改</button></td>');
    $('#dataContext').append(newRow);
    count++;
  }
}
function orderContentCreate(count) {
    let tdHtml = '';
    const orderItem = initJson.orderDtl[count].orderItem;
    for (const key in orderItem) {
        if (orderConvert.hasOwnProperty(key)) {
            tdHtml += '<tr><td>' + orderConvert[key] + '</td><td>' + orderItem[key] + '</td></tr>';
        }
    }
    const tableHtml = '<table class="table table-striped">' +
        '<thead><tr><th>餐點</th><th>數量</th></tr></thead>' +
        '<tbody>' + tdHtml + '</tbody>' +
        '</table>';
    return tableHtml;
}





