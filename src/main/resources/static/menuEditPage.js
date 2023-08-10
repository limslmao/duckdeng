let initJson = {
                 "menuDtl": [
                   {
                     "itemId": "001",
                     "price":600,
                     "itemType":"main",
                     "itemIngred":"duck",
                     "itemUnit":"full",
                     "itemSpicy":"N",
                     "itemCookMethod":"two",
                     "note": "全鴨二吃"
                   },
                    {
                     "itemId": "002",
                     "price":650,
                     "itemType":"main",
                     "itemIngred":"duck",
                     "itemUnit":"full",
                     "itemSpicy":"Y",
                     "itemCookMethod":"two",
                     "note": "全鴨二吃"
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
$(function(){
    getData()
    $('#addItem').on('click', addMenuItem);
    $('#tableBody').on('click', '.cancel-button', function() {
        cancelItemAdd()
    });
    $('#tableBody').on('click', '.confirm-button', function() {
        confirmItemAdd()
    });
});
function getData() {
    $.ajax({
      type: 'GET',
      url: '/orderItems ',
      success: function(response) {
        $('#loading').attr('hidden', true);
        console.log('Response:', JSON.stringify(response, null, 2));
        initJson = response
        queryItem()
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
}
function queryItem() {
    for (const item of initJson.menuDtl) {
        var newRow = $('<tr>');
        newRow.append('<td>' + orderConvert[item.itemId] + '</td>');
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
    $('#addItem').prop('disabled', true);
//    addItemClickCount++; // Increment the counter
    var newRow = $('<tr id = "createItem">');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入品項名稱" id="itemName"></td>');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入品項金額" id="itemPrice"></td>');
    newRow.append('<td><select class="form-select" id="itemType"><option value="main">主菜</option><option value="add">加購</option></select></td>');
    newRow.append('<td><select class="form-select" id="itemType"><option value="duck">鴨</option><option value="chicken">雞</option></select></td>');
    newRow.append('<td><select class="form-select" id="half"><option value="main">半隻</option><option value="full">全隻</option></select></td>');
    newRow.append('<td><select class="form-select" id="itemType"><option value="two">兩吃</option><option value="saute ">剁炒</option>><option value="cut">切盤</option><option value="else">其他</option></select></td>');
    newRow.append('<td><input class="custom-checkbox" type="checkbox" id="itemSpCheck"></td>');
    newRow.append('<td><button class="btn btn-primary cancel-button">取消</button></td>');
    newRow.append('<td><button class="btn btn-primary confirm-button">確定</button></td>');
    $('#tableBody').append(newRow);
}
function cancelItemAdd() {
    $('#addItem').prop('disabled', false);
    $('#createItem').remove();
}
function confirmItemAdd() {

}