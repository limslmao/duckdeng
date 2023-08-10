let initJson = {
  "orderDtl": [
    {
      "orderId": "20230808001",
      "orderItem": {
        "001": 1,
        "002": 1,
        "003": 2
      },
      "totalAmount": 670
    },
    {
      "orderId": "20230808002",
      "orderItem": {
        "001": 1,
        "002": 1,
        "003": 2
      },
      "totalAmount": 670
    }
  ]
};
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
  '014': '甜麵醬一份'
};

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
});


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
function getOrderData() {
var startDate = $('#startDate').val()||"20230810"
var endDate = $('#endDate').val()||""
$.ajax({
  type: 'GET',
  url: '/orderDetails?startDate='+startDate+'&endDate='+endDate+' ',
  success: function(response) {
    $('#loading').attr('hidden', true);
    console.log('Response:', JSON.stringify(response, null, 2));
    initJson = response
    contentHtmlInner();
  },
  error: function(xhr, status, error) {
    console.log('Error:', error);
  }
});

}

function contentHtmlInner() {
  $('#dataContext').empty(); // 清空数据，避免重复添加
  let count = 0;
  for (const order of initJson.orderDtl) {
    const newRow = $('<tr>');
    newRow.append('<td>' + order.orderId + '</td>');
    newRow.append('<td>' + orderContentCreate(count) + '</td>');
    newRow.append('<td>' + order.totalAmount + '</td>');
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





