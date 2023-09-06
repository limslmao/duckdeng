let platform ='foodPanda';
postRequestJson = {};
$(function(){
    document.getElementById('fileInput').addEventListener('change', function(event) {
      decidePlatform();
    });
    $('#uploadBtn').on('click', function(event) {
      postData();
    });;
});
function parseDateTimeToFormat(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return year + month + day;
}
function decidePlatform() {
    const file = event.target.files[0];
        Papa.parse(file, {
             header: true,
             skipEmptyLines: true,
             complete: function(results) {
                 const jsonData = results.data;
                 const keys = Object.keys(jsonData[0]);
                 if (keys.length > 0) {
                   const firstKey = keys[0];
                   if (firstKey == '商家名稱'){
                    platform = 'foodPanda';
                    console.log(platform)
                    foodPandaDataParse(jsonData);
                   } else {
                        platform = 'uberEat';
                        console.log(platform);
                        uberEatDataParse(jsonData);
                   }
                   $('#platformName').text('目前選擇: '+platform+'')
                   $('#'+platform+'Btn').prop('checked', true);
                   $('#uploadBtn').prop('disabled', false);
                 }
             }
        });
}
function foodPandaDataParse(jsonData) {
             const formattedData = {
                 foodPandaDtl: jsonData.map(row => ({
                     orderPlatformId: row['訂單編號'],
                     orderDtlStr: row['訂單品項'],
                     totalAmount: parseInt(row['餐點總額']*0.72),
                     orderDate: parseDateTimeToFormat(row['商家接單時間'])
                 }))
             };
             postRequestJson = formattedData;
             tableHtmlCreate()
}
function uberEatDataParse(jsonData) {
                 postRequestJson = groupAndAggregateData(jsonData);
                 tableHtmlCreate();
}
function groupAndAggregateData(data) {
    const groupedData = {};
    for (const order of data) {
        const orderPlatformId = order['訂單 ID'];
        const workflowId = order['工作流程 ID'];
        const productName = order['商品名稱'];
        const orderAmountStr = order['總金額 '].trim(); // 去掉 ' ' 后面的空格
        const orderAmount = orderAmountStr === '' ? 0 : parseInt(orderAmountStr);
        const orderDate = order['訂單日期'].replace(/\//g, ''); // 使用正则表达式替换所有斜杠
        if (!groupedData[workflowId]) {
            groupedData[workflowId] = {
                orderDtlStr: [],         // 初始化商品名稱数组
                totalAmount: 0,  // 初始化總金額
                orderPlatformId: orderPlatformId,         // 初始化訂單 ID
                orderDate: orderDate   // 使用格式化的訂單日期
            };
        }
        // 将商品名稱添加到数组中
        if (productName) {
            groupedData[workflowId].orderDtlStr.push(productName);
        }
        // 累加總金額
        groupedData[workflowId].totalAmount += orderAmount;
        // 保存订单 ID
    }
    const formattedData = {
        uberEatDtl: Object.values(groupedData).map(group => ({
            orderPlatformId:  group.orderDtlStr.length > 0 ? group.orderPlatformId : '',
            orderDtlStr: group.orderDtlStr.join(', '),
            totalAmount: group.totalAmount,
            orderDate: group.orderDate
        }))
    };
    return formattedData;
}
function tableHtmlCreate() {
$('#tableBody').empty()
     for (const item of postRequestJson[''+platform+'Dtl']) {
            let newRow = $('<tr>');
            newRow.append('<td id = "orderIdForTd">' + item.orderPlatformId + '</td>');
            newRow.append('<td id = "orderDtlForTd">' + item.orderDtlStr + '</td>');
            newRow.append('<td id = "orderAmountForTd">' + item.totalAmount + '</td>');
            newRow.append('<td id = "orderDateForTd">' + item.orderDate + '</td>');
            $('#tableBody').append(newRow);
     }
}
function postData() {
    const orderJsonString = JSON.stringify(postRequestJson);
    console.log(orderJsonString)

}

