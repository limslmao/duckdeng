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
const insertDataForm = {}
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
        newRow.append('<td>' + item.note + '</td>');
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
    var newRow = $('<tr id="createItem">');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入品項名稱" id="itemName"></td>');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入品項金額" id="itemPrice"></td>');
    var itemTypeSelect = $('<select class="form-select" id="itemType"><option value="main">主菜</option><option value="add">加購</option></select>');
    var itemIngredSelect = $('<select class="form-select" id="itemIngred"><option value="duck">鴨</option><option value="chicken">雞</option></select>');
    var itemUnitSelect = $('<select class="form-select" id="itemUnit"><option value="half">半隻</option><option value="full">全隻</option></select>');
    var itemCookMethodSelect = $('<select class="form-select" id="itemCookMethod"><option value="two">兩吃</option><option value="saute">剁炒</option><option value="cut">切盤</option><option value="else">其他</option></select>');
    var itemSpCheckInput = $('<input class="custom-checkbox" type="checkbox" id="itemSpCheck">');

    // Disable fields when 加購 option is selected
    itemTypeSelect.on('change', function() {
        var isAddOptionSelected = $(this).val() === 'add';
        itemIngredSelect.prop('disabled', isAddOptionSelected);
        itemUnitSelect.prop('disabled', isAddOptionSelected);
        itemCookMethodSelect.prop('disabled', isAddOptionSelected);
        itemSpCheckInput.prop('disabled', isAddOptionSelected);
        if (isAddOptionSelected) {
                itemIngredSelect.val('');
                itemUnitSelect.val('');
                itemCookMethodSelect.val('');
                itemSpCheckInput.prop('checked', false);
        }
    });
    newRow.append($('<td>').html(itemTypeSelect));
    newRow.append($('<td>').html(itemIngredSelect));
    newRow.append($('<td>').html(itemUnitSelect));
    newRow.append($('<td>').html(itemCookMethodSelect));
    newRow.append($('<td>').html(itemSpCheckInput));
    newRow.append('<td><button class="btn btn-primary cancel-button">取消</button></td>');
    newRow.append('<td><button class="btn btn-primary confirm-button">確定</button></td>');
    $('#tableBody').append(newRow);
}
function cancelItemAdd() {
    $('#addItem').prop('disabled', false);
    $('#createItem').remove();
}
function confirmItemAdd() {
    insertDataForm.itemPrice = $('#itemPrice').val();
    insertDataForm.itemType = $('#itemType').val();
    insertDataForm.itemIngred =$('#itemIngred').val();
    insertDataForm.itemUnit = $('#itemUnit').val();
    insertDataForm.itemCookMethod = $('#itemCookMethod').val();
    insertDataForm.itemSpCheck = $('#itemSpCheck').prop('checked') ? 'Y' : 'N';
    if (insertDataForm.itemType == "add") {
        insertDataForm.itemSpCheck = null
    }
    insertDataForm.note = $('#itemName').val();
    const orderJsonString = JSON.stringify(insertDataForm);
    console.log(orderJsonString);
}
function postData() {
//    $.ajax({
//      type: 'GET',
//      url: '/orderItems ',
//      success: function(response) {
//        $('#loading').attr('hidden', true);
//        console.log('Response:', JSON.stringify(response, null, 2));
//        initJson = response
//        queryItem()
//      },
//      error: function(xhr, status, error) {
//        console.log('Error:', error);
//      }
//    });
}