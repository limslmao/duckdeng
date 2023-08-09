const jsonEx = {
                 "orderItems": [
                   {
                     "menuId": "001",
                     "price":600,
                     "itemType":"main",
                     "itemIngred":"duck",
                     "itemUnit":"full",
                     "itemSpicy":"N",
                     "itemCookMethod":"two"
                   },
                    {
                     "menuId": "002",
                     "price":650,
                     "itemType":"main",
                     "itemIngred":"duck",
                     "itemUnit":"full",
                     "itemSpicy":"Y",
                     "itemCookMethod":"two"
                   }
                 ]
               }
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
var addItemClickCount = 0
var menuArr =  ["全鴨兩吃","600","主食","650"]
$(function(){
    queryItem()
    $('#addItem').on('click', addMenuItem);
});
function queryItem() {
    for (const item of jsonEx.orderItems) {
        var newRow = $('<tr>');
        newRow.append('<td>' + orderConvert[item.menuId] + '</td>');
        newRow.append('<td>' + item.price + '</td>');
        newRow.append('<td>' + item.itemType + '</td>');
        newRow.append('<td>' + item.itemIngred + '</td>');
        newRow.append('<td>' + item.itemUnit + '</td>');
        newRow.append('<td>' + item.itemCookMethod + '</td>');
        newRow.append('<td>' + item.itemSpicy + '</td>');
        newRow.append('<td></td>');
        $('#tableBody').append(newRow);
    }
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