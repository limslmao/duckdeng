/*  current API used: POST/api/orderDetails , GET /api/orderItems                                         */
/*  main function: orderDtl Insert , create Html from menuItem                                            */
/*  version record:                                                                                       */
/*  --date--   --name--    --event--                                                        --version--   */
/*  2023/08/28   Arte      codeReview,insertRequestJson add orderDate key,totalAmount fix       V00       */
/*  2023/08/29   Arte      change for length , variable $discountInput change to global         V01       */
/*  2023/08/30   Arte      count_add calculate                                                  V02       */
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
let queryResponseJson = {
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
let insertRequestJson = {
 "orderItem": {
     "001": 2,
     "013": 1
   },
   "totalAmount": 840,
   "discount":50,
   "remark":"測試",
   "orderDate":"20230827"
} //POST/api/orderDetails
let itemId_add = [];
let itemId_main = [];
let orderItemsJson = [];
let totalAmount = ''; //總額
let $discountInput = 0 /* V01 */
$(function(){
    $('#orderMenu').on('click', function(event) {
        event.preventDefault(); // Prevent the default link navigation
        calculatePrice();
    });
    $('#orderFinish').on('click', orderFinish);
    $('#discountBtn').on('click', discount);
    getOrderItemsData()
    insertDate();
});
function getOrderItemsData() {
    $.ajax({
      type: 'GET',
      url: '/api/orderItems ',
      success: function(response) {
        $('#loading').attr('hidden', true);
        queryResponseJson = response;
        orderItemsParser(response)
        $('#addItem').prop('disabled', false);
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
}
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
//           labIngred_main = new Set(labIngred_main);
//           itemTittleCreate_main(labIngred_main)
}
function itemHtmlCreate_add(itemNameList,itemPrice,itemId_add) {
    itemHtml_add = $("#addItem")
    itemLab_add = ''
    for (i=0;i<itemNameList.length;i++) {
        itemLab_add += '<div class="col-3"> <label>'+itemNameList[i]+':</label><input type="number" class="form-control" placeholder="請輸入加購份數 1份/'+itemPrice[i]+'" id = "'+itemId_add[i]+'"> </div>'
    }
    itemHtml_add.append(itemLab_add)
}
function itemTittleCreate_main(labIngred_main) {} //暫時不做
function itemHtmlCreate_main(itemNameList_main,itemPrice_main,itemId_main,labIngred_main){ // 雞,鴨目前hardCode
    itemHtml_chicken = $('#chickenItem')
    itemHtml_duck = $('#duckItem')
    for (i=0;i<itemNameList_main.length;i++) {
        mainItemLab = '<div class="col-3"> <label>'+itemNameList_main[i]+':</label><input type="number" class="form-control" placeholder="請輸入加購份數 1份/'+itemPrice_main[i]+'" id = "'+itemId_main[i]+'"> </div>'
        if (labIngred_main[i] == 'chicken') {
            itemHtml_chicken.append(mainItemLab)
        }
        if (labIngred_main[i] == 'duck') {
            itemHtml_duck.append(mainItemLab)
        }
   } // id還沒設
}
function discount() {
    $discountInput += parseInt($('#discountInput').val() || 0) /* V01 */
    totalAmount = totalAmount - $discountInput;
    $('#totalCount').text(totalAmount+"(已折價:"+$discountInput+")");
}
function insertDate() {
    const today = new Date();
    const  year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    $('#date').val(year+month+day);
    insertRequestJson.orderDate =  `${year}${month}${day}`;
}
function calculatePrice() {
    const result = checkDate()
    if (result != true) {
        $('#orderFinish, .discount, #remark').prop('disabled',true);
        return
    }
    sum = 0;
    sum_add = 0;
    console.log(itemId_add)
    for (let i = 1; i <= queryResponseJson.menuDtl.length ; i++) {  /* V01 */
        if (i<10) {
            count = $('#00' + i).val()||0;
            insertRequestJson.orderItem['00' + i] = parseInt(count)
            sum += priceConvert(count,'00' + i);
        } else {
            count = $('#0' + i).val()||0;
            insertRequestJson.orderItem['0' + i] = parseInt(count)
            sum += priceConvert(count,'0' + i);
            if (itemId_add.includes('0' + i) && count != 0) {  //計算加購項目總金額 /* V02 */
                sum_add += priceConvert(count,'0' + i);;
            }
        }
        totalAmount = sum
    }
    $('#totalCount').text(sum);
    $('#orderFinish, .discount, #remark').prop('disabled', sum != 0 ? false : true);
    $('#count_add').text('(目前加購總金額:'+sum_add+')'); /* V02 */
    $('#count_add').attr('hidden', false);  /* V02 */
}
function checkDate() {
    const inputDate = $('#date').val();
    const pattern = /^\d{8}$/;
    if (pattern.test(inputDate)) {
        insertRequestJson.orderDate = inputDate
        return true
    } else {
        alert('日期格式錯誤請輸入"YYYYMMDD"')
        return false
    }
}
function priceConvert(count,targetItemId) { //利用queryResponseJson.menuDtl 取得菜單品項對應的金額
    let targetPrice = 0;
    for (const item of queryResponseJson.menuDtl) {
        if (item.itemId === targetItemId) {
            targetPrice = item.price;
            break;
        }
    }
    return targetPrice * count
}
function orderFinish() {
  insertRequestJson.discount = $('#discountInput').val();
  insertRequestJson.remark = $('#remark').val();
  insertRequestJson.totalAmount = totalAmount;
  const orderJsonString = JSON.stringify(insertRequestJson);
  postOrderDetailsData(orderJsonString)
}
function postOrderDetailsData(orderJsonString) {
  $('#loading').attr('hidden', false);
  $('#orderFinish').attr('disabled', true);
  $.ajax({
    type: 'POST',
    url: '/api/orderDetails', // 移除多餘的空格
    data: orderJsonString, // 將 JSON 字串傳送至伺服器
    contentType: 'application/json', // 設定 content type 為 JSON
    success: function(response) {
      $('#loading').attr('hidden', true);
//      console.log('Response:', JSON.stringify(response, null, 2));
      alert('訂單 '+response.orderId+' 新增成功')
      location.reload();
    },
    error: function(xhr, status, error) {
      console.log('Error:', error);
    }
  });
}