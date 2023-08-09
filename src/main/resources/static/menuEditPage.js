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
const formData = {
    itemName: '',
    itemPrice: '',
    itemType: 'main',
    itemIngred: 'chicken',
    itemUnit: 'half',
    itemCookMethod: '',
    itemSpCheck: false
};
const menuAdd = {};
$(function(){
    queryItem()
    $('#addItem').on('click', addMenuItem);
    $(document).on('click', '.cancel-button', cancelAdd);
    $(document).on('click', '.submit-button', submitAdd);

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
    $('#addItem').prop('disabled', true);
    var newRow = $('<tr>');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入品項名稱" id="itemName"></td>');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入品項金額" id="itemPrice"></td>');
    newRow.append('<td><select class="form-control" id="itemType"><option value="main">主菜</option><option value="add">加購</option></select></td>'); // Dropdown select for item type
    newRow.append('<td><select class="form-control" id="itemIngred"><option value="chicken">鴨</option><option value="duck">雞</option></select></td>'); // Dropdown select for item type
    newRow.append('<td><select class="form-control" id="itemUnit"><option value="half">半</option><option value="full">全</option></select></td>'); // Dropdown select for item type
    newRow.append('<td><span id="itemCookMethod"> new </span></td>');
    newRow.append('<td><input class="custom-checkbox" type="checkbox" id="itemSpCheck "></td>');
    newRow.append('<td><div class="row"><div class="col3"><button class="btn btn-primary cancel-button">取消</button></div><div class="col"><button class="btn btn-primary submit-button">確定</button></div></div></td>');
    $('#tableBody').append(newRow);
}
function cancelAdd() {
    $('#addItem').prop('disabled', false);
    $(this).closest('tr').remove();
}
function submitAdd() {
    $('#addItem').prop('disabled', false);
    formData.itemName = $('#itemName').val();
    formData.itemPrice = $('#itemPrice').val();
    formData.itemType = $('#itemType').val();
    formData.itemIngred = $('#itemIngred').val();
    formData.itemUnit = $('#itemUnit').val();
    formData.itemCookMethod = $('#itemCookMethod').text();
    formData.itemSpCheck = $('#itemSpCheck').prop('checked') ? 'Y' : 'N';
    const orderJsonString = JSON.stringify(formData);
    console.log(orderJsonString);
    location.reload()
}
