class OrderClass {
  constructor() {
    this.enumValues = {
      quanYaTwoEat: '001',
      quanJiaTwoEatSpicy: '002',
      banYaTwoEat: '003',
      banYaTwoEatSpicy: '004',
      quanYaChopFry: '005',
      quanYaChopFrySpicy: '006',
      banYaChopFry: '007',
      banYaChopFrySpicy: '008',
      quanYaChopPlate: '009',
      banYaChopPlate: '010',
      quanJiShouPaJi: '011',
      banJiShouPaJi: '012',
      heYeBing: '013',
      tianMianJiang: '014'
    };
  }
     getEnumKeyByValue(value) {
          for (const key in this.enumValues) {
            if (this.enumValues[key] === value) {
              return key;
            }
          }
          return null;
        }
        getEnumValueByKey(key) {
          return this.enumValues[key] || null;
        }
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
   const orderClass = new OrderClass();
   const enumValue = orderClass.getEnumValueByKey(key);
   orderItem[enumValue] = value;
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
    // 將數據映射到 orderItem
    mapToOrderItem('quanYaTwoEat', full_d_two);
    mapToOrderItem('quanJiaTwoEatSpicy', full_d_two_sp);
    mapToOrderItem('banYaTwoEat', half_d_two);
    mapToOrderItem('banYaTwoEatSpicy', half_d_two_sp);
    mapToOrderItem('quanYaChopFry', full_d_saute);
    mapToOrderItem('quanYaChopFrySpicy', full_d_saute_sp);
    mapToOrderItem('banYaChopFry', half_d_saute);
    mapToOrderItem('banYaChopFrySpicy', half_d_saute_sp);
    mapToOrderItem('quanYaChopPlate', full_d_cut);
    mapToOrderItem('banYaChopPlate', half_d_cut);
    mapToOrderItem('quanJiShouPaJi', full_chicken);
    mapToOrderItem('banJiShouPaJi', half_chicken);
    mapToOrderItem('heYeBing', cookie);
    mapToOrderItem('tianMianJiang', sauce);

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
}
