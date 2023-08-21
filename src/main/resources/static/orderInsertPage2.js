const orderConvert = {
  'duck': '鴨',
  'chicken': '雞',
  'full': '全隻',
  'half': '半隻',
  'N': '無香鍋',
  'Y': '有香鍋麻辣',
  'two': '兩吃',
  'saute': '剁炒',
  'cut': '剁盤',
  'hand': '手扒'
};
let queryJson = {
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
}
let insertJson = {
 "orderItem": {
     "001": 2,
     "013": 1
   },
   "totalAmount": 840,
   "discount":50,
   "remark":"測試"
}
let labItemId = [];
let labItemId_Main = [];
let orderItemsJson = [];
let totalAmount = '';
$(function(){
  $('#orderMenu').on('click', function(event) {
    event.preventDefault(); // Prevent the default link navigation
    calculatePrice();
  });
  $('#orderFinish').on('click', orderFinish);
   $('#discountBtn').on('click', discount);
   getData()
   insertDate();
});
function getData() {
    $.ajax({
      type: 'GET',
      url: '/api/orderItems ',
      success: function(response) {
        $('#loading').attr('hidden', true);
//        console.log('Response:', JSON.stringify(response, null, 2));
        queryJson = response;
        orderItemsParser(response)
        $('#addItem').prop('disabled', false);
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
}
function orderItemsParser(response) {
            //add
           const filteredItems = response.menuDtl.filter(item => item.itemType === "add");
           let labelList = []
           let labPrice = []
           for (let i = 0; i < filteredItems.length; i++) {
               labelList.push(filteredItems[i].note);
               labPrice.push(filteredItems[i].price);
               labItemId.push(filteredItems[i].itemId);
           }
//           console.log(labelList,labPrice,labItemId);
           addItemCreate(labelList,labPrice,labItemId)
           // main
           const filteredItems_Main = response.menuDtl.filter(item => item.itemType === "main");
           let labelList_Main = []
           let labPrice_Main = []
           let labIngred_Main = []

           for (let i = 0; i < filteredItems_Main.length; i++) {
               labelList_Main.push(filteredItems_Main[i].note);
               labPrice_Main.push(filteredItems_Main[i].price);
               labItemId_Main.push(filteredItems_Main[i].itemId);
               labIngred_Main.push(filteredItems_Main[i].itemIngred);
           }

           mainItemCreate(labelList_Main,labPrice_Main,labItemId_Main,labIngred_Main)
           labIngred_Main = new Set(labIngred_Main);
           mainItemTittleCreate(labIngred_Main)
//           console.log(labelList_Main,labPrice_Main,labItemId_Main,labIngred_Main);
}
function addItemCreate(labelList,labPrice,labItemId) {
addItemHtml = $("#addItem")
addItemLab = ''
for (i=0;i<labelList.length;i++) {
    addItemLab += '<div class="col-3"> <label>'+labelList[i]+':</label><input type="number" class="form-control" placeholder="請輸入加購份數 1份/'+labPrice[i]+'" id = "'+labItemId[i]+'"> </div>'
} // id還沒設
addItemHtml.append(addItemLab)
}
function mainItemTittleCreate(labIngred_Main) {} //暫時不做
function mainItemCreate(labelList_Main,labPrice_Main,labItemId_Main,labIngred_Main){
    chickenItemHtml = $('#chickenItem')
    duckItemHtml = $('#duckItem')
    for (i=0;i<labelList_Main.length;i++) {
        mainItemLab = '<div class="col-3"> <label>'+labelList_Main[i]+':</label><input type="number" class="form-control" placeholder="請輸入加購份數 1份/'+labPrice_Main[i]+'" id = "'+labItemId_Main[i]+'"> </div>'
        if (labIngred_Main[i] == 'chicken') {
            chickenItemHtml.append(mainItemLab)
        }
        if (labIngred_Main[i] == 'duck') {
            duckItemHtml.append(mainItemLab)
        }
   } // id還沒設
}
function discount() {
    let discountInput = 0
    discountInput = $('#discountInput').val() || 0
    let discountedTotal = insertJson.totalAmount - parseInt(discountInput);
    totalAmount = discountedTotal
    $('#totalCount').text(discountedTotal+"(已折價:"+parseInt(discountInput)+")");
}
function insertDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1; // 月份是從 0 開始的，所以要加 1
    var day = today.getDate();
    $('#date').val(year + "/" + month + "/" + day);
}
function calculatePrice() {
    sum = 0;
    for (var i = 1; i <= 14; i++) {
        if (i<10) {
            count = $('#00' + i).val()||0;
            insertJson.orderItem['00' + i] = parseInt(count)
            sum += priceConvert(count,'00' + i);
        } else {
            count = $('#0' + i).val()||0;
            insertJson.orderItem['0' + i] = parseInt(count)
            sum += priceConvert(count,'0' + i);
        }
        insertJson.totalAmount = sum
    }
    $('#totalCount').text(sum);
    $('#orderFinish, .discount, #remark').prop('disabled', sum != 0 ? false : true);
}
function priceConvert(count,targetItemId) {
    let targetPrice = 0;
    for (const item of queryJson.menuDtl) {
        if (item.itemId === targetItemId) {
            targetPrice = item.price;
            break;
        }
    }
//    console.log(targetPrice * count);
    return targetPrice * count
}
function orderFinish() {
  insertJson.discount = $('#discountInput').val();
  insertJson.remark = $('#remark').val();
  insertJson.totalAmount = totalAmount;
  const orderJsonString = JSON.stringify(insertJson);
  console.log(orderJsonString);
  postData(orderJsonString)
}
function postData(orderJsonString) {
  $('#loading').attr('hidden', false);
  $('#orderFinish').attr('disabled', true);
  $.ajax({
    type: 'POST',
    url: '/api/orderDetails', // 移除多餘的空格
    data: orderJsonString, // 將 JSON 字串傳送至伺服器
    contentType: 'application/json', // 設定 content type 為 JSON
    success: function(response) {
      $('#loading').attr('hidden', true);
      console.log('Response:', JSON.stringify(response, null, 2));
      alert('訂單 '+response.orderId+' 新增成功')
      location.reload();
    },
    error: function(xhr, status, error) {
      console.log('Error:', error);
    }
  });
}