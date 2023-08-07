var addItemClickCount = 0
var menuArr =  ["全鴨兩吃","600","checked","650"]
$(function(){
    queryItem()
    $('#addItem').on('click', addMenuItem);
});
function queryItem() {
    var newRow = $('<tr>');
    newRow.append('<td>' + menuArr[0] + '</td>');
    newRow.append('<td>' + menuArr[1] + '</td>');
    newRow.append('<td><input class="custom-checkbox" type="checkbox"  ' + menuArr[2] + '></td>');
    newRow.append('<td>' + menuArr[3] + '</td>');
    $('#tableBody').append(newRow);
}
function addMenuItem() {
    addItemClickCount++; // Increment the counter
    var newRow = $('<tr>');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入品項名稱" id="itemName_' + addItemClickCount + '"></td>');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入品項金額" id="itemPrice_' + addItemClickCount + '"></td>');
    newRow.append('<td><input class="custom-checkbox" type="checkbox" id="itemSpCheck_' + addItemClickCount + '"></td>');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入香鍋麻辣加購價" id="itemSpPrice_' + addItemClickCount + '"></td>');
    $('#tableBody').append(newRow);
}