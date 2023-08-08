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
function countAllSpend() {
    var half_two = $('#duckTwoCount').val();
    var half_two_sp = $('#duckTwoSpCount').val();
    var half_saute = $('#duckSauteCount').val();
    var half_saute_sp = $('#duckSauteSpCount').val();
    var half_cut = $('#duckCutCount').val();
    var full_two = $('#duckTwoCount-full').val();
    var full_two_sp = $('#duckTwoSpCount-full').val();
    var full_saute = $('#duckSauteCount-full').val();
    var full_saute_sp = $('#duckSauteSpCount-full').val();
    var full_cut = $('#duckCutCount-full').val();
    var full_chicken = $('#chicken-full').val();
    var half_chicken = $('#chicken-half').val();
    var cookie = $('#cookie').val();
    var sauce = $('#sauce').val();
    var half_chicken
    // Check if spicy counts are valid
    if (half_two_sp > half_two || half_saute_sp > half_saute ||
        full_two_sp > full_two || full_saute_sp > full_saute) {
        alert("香鍋麻辣數量必須小於份數");
        return;
    }
    var duckSpend = calculateSpend(half_two, half_two_sp, 320, 30) +
                    calculateSpend(half_saute, half_saute_sp, 300, 20) +
                    calculateSpend(half_cut, 0, 290, 0) +
                    calculateSpend(full_two, full_two_sp, 600, 20) +
                    calculateSpend(full_saute, full_saute_sp, 590, 40) +
                    calculateSpend(full_chicken, 0, 450, 0)+
                    calculateSpend(half_chicken, 0, 230, 0)+
                    calculateSpend(cookie, 0, 30, 0)+
                    calculateSpend(sauce, 0, 20, 0);
    $('#totalCount').text(duckSpend);
}
function calculateSpend(count, spCount, basePrice, spPrice) {
    return (count * basePrice + spCount * spPrice) * 1;
}
function newItemInputCreate() {//有要用到再做
}
function orderFinish() {

}