
$(function(){
  $('.spicy-checkbox').on('click', spicyCheckBox);
    $('#orderMenu').on('click', countAllSpend);
    insertDate();
});


//document.addEventListener('DOMContentLoaded', function() {
//    $('.spicy-checkbox').on('click', spicyCheckBox);
//    $('#orderMenu').on('click', countAllSpend);
//});
//window.onload = function() {
//    insertDate();
//};
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
function countAllSpend(){
    var half_two = $('#duckTwoCount').val()
    var half_two_sp = $('#duckTwoSpCount').val()
    var half_saute = $('#duckSauteCount').val()
    var half_saute_sp = $('#duckSauteSpCount').val()
    var half_cut = $('#duckCutCount').val()
    var full_two = $('#duckTwoCount-full').val()
    var full_two_sp = $('#duckTwoSpCount-full').val()
    var full_saute = $('#duckSauteCount-full').val()
    var full_saute_sp = $('#duckSauteSpCount-full').val()
    var full_cut = $('#duckCutCount-full').val()
    var duckSpend = 0
    var chickenSpend = 0
    var addSpend = 0
    half_two = half_two- half_two_sp
    half_saute = half_saute - half_saute_sp
    full_two = full_two - full_two_sp
    full_saute = full_saute - full_saute_sp
    duckSpend = half_two+half_two_sp+half_saute+half_saute_sp+half_cut+full_two+full_two_sp+full_saute+full_saute_sp+full_cut
    $('#totalCount').text(duckSpend)

}