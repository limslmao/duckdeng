const jsonEx = {
  "orderDtl": [
    {
      "orderId": "20230808001",
      "orderItem": {
        "001": 1,
        "002": 1,
        "003": 2
      },
      "totalPrice": 670
    },
    {
      "orderId": "20230808002",
      "orderItem": {
        "001": 1,
        "002": 1,
        "003": 2
      },
      "totalPrice": 670
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

$(function() {
  getOrderData();
});

function getOrderData() {
  console.log(jsonEx);
  contentHtmlInner();
}

function contentHtmlInner() {
  $('#dataContext').empty(); // 清空数据，避免重复添加
  let count = 0;
  for (const order of jsonEx.orderDtl) {
    const newRow = $('<tr>');
    newRow.append('<td>' + order.orderId + '</td>');
    newRow.append('<td>' + orderContentCreate(count) + '</td>');
    newRow.append('<td>' + order.totalPrice + '</td>');
    $('#dataContext').append(newRow);
    count++;
  }
}
function orderContentCreate(count) {
    let tdHtml = '';
    const orderItem = jsonEx.orderDtl[count].orderItem; // 获取当前订单的订单项
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





