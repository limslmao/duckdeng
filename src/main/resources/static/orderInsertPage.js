const valueToDbConvert = {
  'full_d_two'     :'001',
  'full_d_two_sp'  :'002',
  'half_d_two'     :'003',
  'half_d_two_sp'  :'004',
  'full_d_saute'   :'005',
  'full_d_saute_sp':'006',
  'half_d_saute'   :'007',
  'half_d_saute_sp':'008',
  'full_d_cut'     :'009',
  'half_d_cut'     :'010',
  'full_chicken'   :'011',
  'half_chicken'   :'012',
  'cookie'         :'013',
  'sauce'          :'014'
}
const orderItem = {};
var totalPrice = '';
$(function(){
  newItemInputCreate()
  $('.spicy-checkbox').on('click', spicyCheckBox);
  insertDate();
  $('#orderMenu').on('click', function(event) {
    event.preventDefault(); // Prevent the default link navigation
    countAllSpend(); // Call your function
  });
  $('#orderFinish').on('click', orderFinish);
});
function insertDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1; // 月份是從 0 開始的，所以要加 1
    var day = today.getDate();
    $('#date').val(year + "/" + month + "/" + day);
}
function spicyCheckBox() {
var targetId = $(this).data('target');
    var targetElement = $("#" + targetId);
    if ($(this).prop('checked')) {
        targetElement.removeAttr('hidden');
    } else {
        targetElement.attr('hidden', true);
    }
}
function calculateSpend(quantity, spicyQuantity, price, spicyPrice) {
    const normalCost = quantity * price;
    const spicyCost = spicyQuantity * spicyPrice;
    return normalCost + spicyCost;
}
function mapToOrderItem(key, value) {
   const enumValue = valueToDbConvert[key];
   orderItem[enumValue] = parseInt(value, 0);
   console.log(enumValue)
}
function countAllSpend() {
    var full_d_two = $('#duckTwoCount-full').val();
    var full_d_two_sp = $('#duckTwoSpCount-full').val();
    var half_d_two = $('#duckTwoCount').val();
    var half_d_two_sp = $('#duckTwoSpCount').val();
    var full_d_saute = $('#duckSauteCount-full').val();
    var full_d_saute_sp = $('#duckSauteSpCount-full').val();
    var half_d_saute = $('#duckSauteCount').val();
    var half_d_saute_sp = $('#duckSauteSpCount').val();
    var full_d_cut = $('#duckCutCount-full').val();
    var half_d_cut = $('#duckCutCount').val();
    var full_chicken = $('#chicken-full').val();
    var half_chicken = $('#chicken-half').val();
    var cookie = $('#cookie').val();
    var sauce = $('#sauce').val();
    if (half_d_two_sp > half_d_two || half_d_saute_sp > half_d_saute ||
        full_d_two_sp > full_d_two || full_d_saute_sp > full_d_saute) {
        alert("香鍋麻辣數量必須小於份數");
        return false;
    }
    // 計算花費
    var duckSpend = calculateSpend(half_d_two, half_d_two_sp, 320, 30) +
                    calculateSpend(half_d_saute, half_d_saute_sp, 300, 20) +
                    calculateSpend(half_d_cut, 0, 290, 0) +
                    calculateSpend(full_d_two, full_d_two_sp, 600, 20) +
                    calculateSpend(full_d_saute, full_d_saute_sp, 590, 40) +
                    calculateSpend(full_chicken, 0, 450, 0) +
                    calculateSpend(half_chicken, 0, 230, 0) +
                    calculateSpend(cookie, 0, 30, 0) +
                    calculateSpend(sauce, 0, 20, 0);
    $('#totalCount').text(duckSpend);
    totalPrice = duckSpend;
   $('#orderFinish').prop('disabled', totalPrice != 0 ? false : true);
    // 將數據映射到 orderItem
    mapToOrderItem('full_d_two', full_d_two || 0);
    mapToOrderItem('full_d_two_sp', full_d_two_sp || 0);
    mapToOrderItem('half_d_two', half_d_two || 0);
    mapToOrderItem('half_d_two_sp', half_d_two_sp || 0);
    mapToOrderItem('full_d_saute', full_d_saute || 0);
    mapToOrderItem('full_d_saute_sp', full_d_saute_sp || 0);
    mapToOrderItem('half_d_saute', half_d_saute || 0);
    mapToOrderItem('half_d_saute_sp', half_d_saute_sp || 0);
    mapToOrderItem('full_d_cut', full_d_cut || 0);
    mapToOrderItem('half_d_cut', half_d_cut || 0);
    mapToOrderItem('full_chicken', full_chicken || 0);
    mapToOrderItem('half_chicken', half_chicken || 0);
    mapToOrderItem('cookie', cookie || 0);
    mapToOrderItem('sauce', sauce || 0);
}
function newItemInputCreate() {//有要用到再做
}
function orderFinish() {
  const orderJson = {
     orderItem,
     totalPrice
  }
  const orderJsonString = JSON.stringify(orderJson);
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