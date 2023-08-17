let initJson = {
                 "menuDtl": [
                   {
                     "price":600,
                     "itemType":"main",
                     "itemIngred":"duck",
                     "itemUnit":"full",
                     "itemSpicy":"N",
                     "itemCookMethod":"two",
                     "note": "全鴨二吃"
                   },
                    {
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
  'duck': '鴨',
  'chicken': '雞',
  'full': '全支',
  'half': '半支',
  'N': '無香鍋',
  'Y': '有香鍋麻辣',
  'two': '兩吃',
  'saute': '剁炒',
  'cut': '剁盤',
  'hand': '手扒',
  'main':'主菜',
  'add':'加購',
  'null':'--'
};
const insertDataForm = {};
const updateDataFrom = {
     itemId:"",
     price:650,
     itemType:"main",
     itemIngred:"duck",
     itemUnit:"full",
     itemSpicy:"Y",
     itemCookMethod:"two",
     note:"蔥爆牛肉"
};
let buttonClick = ""
let updateHtml = ""
$(function(){
    getData()
    $('#addItem').on('click', addMenuItem);
    $('#tableBody').on('click', '.cancel-button', function() {
        cancelItemAdd()
    });
    $('#tableBody').on('click', '.confirm-button', function() {
        confirmItemAdd()
    });
    $('#tableBody').on('click', '.deleteData', function() {
        const itemId = $(this).closest('tr').find('#itemIdForTd').text();
        deleteData(itemId)
    });
    $('#tableBody').on('click', '.updateData', function() {
    updateDataFrom.itemId = $(this).closest('tr').find('#itemIdForTd').text();
    updateDataFrom.note = $(this).closest('tr').find('#itemNameForTd').text();
    updateDataFrom.price = $(this).closest('tr').find('#itemPriceForTd').text();
    updateDataFrom.itemType = $(this).closest('tr').find('#itemTypeForTd').text();
    updateDataFrom.itemUnit= $(this).closest('tr').find('#itemUnitForTd').text();
    updateDataFrom.itemIngred= $(this).closest('tr').find('#itemIngredForTd').text();
    updateDataFrom.itemCookMethod= $(this).closest('tr').find('#itemCookMethodForTd').text();
    updateDataFrom.itemSpicy = $(this).closest('tr').find('#itemSpCheckForTd').text();
//    const fieldNames = ['itemId','note', 'price', 'itemType', 'itemUnit', 'itemIngred', 'itemCookMethod', 'itemSpCheck'];
//    fieldNames.forEach(fieldName => {
//        updateDataFrom[fieldName] = $(this).closest('tr').find(`#${fieldName}ForTd`).text();
//    });
    updateHtml =  $(this).closest('tr')
    updateHtml.remove()
    updateData()
    });
});
function deleteData(itemId) {
 $.ajax({
      type: 'DELETE',
      url: '/api/orderItems/'+itemId+'',
      success: function(response) {
        $('#loading').attr('hidden', true);
        console.log('Response:', JSON.stringify(response, null, 2));
        location.reload();
        alert('項目'+itemId+'已成功刪除')
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
 console.log('delete'+itemId)
}
function updateData(itemId) {
    $('.updateData, .deleteData').prop('disabled', true);
    buttonClick = "update" ;
    addMenuItem();
}
function getData() {
    $.ajax({
      type: 'GET',
      url: '/api/orderItems ',
      success: function(response) {
        $('#loading').attr('hidden', true);
//        console.log('Response:', JSON.stringify(response, null, 2));
        initJson = response
        queryItem()
        $('#addItem').prop('disabled', false);
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
}
function queryItem() {
    for (const item of initJson.menuDtl) {
        var newRow = $('<tr>');
        newRow.append('<td id = "itemIdForTd">' + item.itemId + '</td>');
        newRow.append('<td id = "itemNameForTd">' + item.note + '</td>');
        newRow.append('<td id = "itemPriceForTd">' + item.price + '</td>');
        newRow.append('<td id = "itemTypeForTd">' + orderConvert[item.itemType] + '</td>');
        newRow.append('<td id = "itemIngredForTd">' + orderConvert[item.itemIngred] + '</td>');
        newRow.append('<td id = "itemUnitForTd">' + orderConvert[item.itemUnit] + '</td>');
        newRow.append('<td id = "itemCookMethodForTd">' + orderConvert[item.itemCookMethod] + '</td>');
        newRow.append('<td id = "itemSpCheckForTd">' + orderConvert[item.itemSpicy] + '</td>');
        newRow.append('<td><button class="btn btn-primary updateData">修改</button> <button class="btn btn-danger deleteData">刪除</button></td>');

        $('#tableBody').append(newRow);
    }
}
function addMenuItem() {
    $('#addItem').prop('disabled', true);
    var newRow = $('<tr id="createItem">');
    newRow.append('<td id = "tdItemId" >新增後產生</td>');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入品項名稱" id="itemName"></td>');
    newRow.append('<td><input type="number" class="form-control" placeholder="請輸入品項金額" id="itemPrice"></td>');
    var itemTypeSelect = $('<select class="form-select" id="itemType"><option value="main">主菜</option><option value="add">加購</option></select>');
    var itemIngredSelect = $('<select class="form-select" id="itemIngred"><option value="duck">鴨</option><option value="chicken">雞</option></select>');
    var itemUnitSelect = $('<select class="form-select" id="itemUnit"><option value="half">半隻</option><option value="full">全隻</option></select>');
    var itemCookMethodSelect = $('<select class="form-select" id="itemCookMethod"><option value="two">兩吃</option><option value="saute">剁炒</option><option value="cut">剁盤</option><option value="hand">手扒</option><option value="else">其他</option></select>');
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
    newRow.append('<td><button class="btn btn-primary cancel-button">取消</button> <button class="btn btn-primary confirm-button">確定</button></td>');
    $('#tableBody').append(newRow);
    if (buttonClick == 'update') {
        $('#tdItemId').text(updateDataFrom.itemId );
        $('#itemName').val(updateDataFrom.note );
        $('#itemPrice').val(updateDataFrom.price );
        $('#itemType').val(findKeyByValue(orderConvert, updateDataFrom.itemType) );//轉回英文
        $('#itemIngred').val(findKeyByValue(orderConvert, updateDataFrom.itemIngred)  );
        $('#itemUnit').val(findKeyByValue(orderConvert, updateDataFrom.itemUnit) );
        $('#itemCookMethod').val(findKeyByValue(orderConvert, updateDataFrom.itemCookMethod ) );
        $('#itemSpCheck').prop('checked', findKeyByValue(orderConvert,updateDataFrom.itemSpicy) === 'Y' ? true : false);
    }
}
function findKeyByValue(obj, value) {
  for (const key in obj) {
    if (obj[key] === value) {
      return key;
    }
  }
  return null; // 如果找不到對應的鍵，則返回 null 或其他適當的值
}

function cancelItemAdd() {
    $('.updateData, .deleteData').prop('disabled', false);
    $('#createItem').remove();
    $('#tableBody').append(updateHtml);
}
function confirmItemAdd() {
    insertDataForm.price = parseFloat($('#itemPrice').val());
    insertDataForm.itemType = $('#itemType').val();
    insertDataForm.itemIngred =$('#itemIngred').val();
    insertDataForm.itemUnit = $('#itemUnit').val();
    insertDataForm.itemCookMethod = $('#itemCookMethod').val();
    insertDataForm.itemSpicy = $('#itemSpCheck').prop('checked') ? 'Y' : 'N';
    if (insertDataForm.itemType == "add") {
        insertDataForm.itemSpicy = null
    }
    insertDataForm.note = $('#itemName').val();
    if (buttonClick == "update") {
        insertDataForm.itemId = updateDataFrom.itemId
        const orderJsonString = JSON.stringify(insertDataForm);
        putData(orderJsonString)
    } else {
        const orderJsonString = JSON.stringify(insertDataForm);
        postData(orderJsonString)
    }
}
function postData(orderJsonString) {
    $('#loading').attr('hidden', false);
    $.ajax({
      type: 'POST',
      url: '/api/orderItems', // 移除多餘的空格
      data: orderJsonString, // 將 JSON 字串傳送至伺服器
      contentType: 'application/json', // 設定 content type 為 JSON
      success: function(response) {
        $('#loading').attr('hidden', true);
        console.log('Response:', JSON.stringify(response, null, 2));
        $('#createItem').remove();
        alert('菜單新增成功')
        location.reload();
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
}
function putData(orderJsonString) {
console.log(orderJsonString)
     $.ajax({
           type: 'PUT',
           url: '/api/orderItems/'+updateDataFrom.itemId+'',
           data: orderJsonString,
           contentType: 'application/json',
           success: function(response) {
             $('#loading').attr('hidden', true);
             console.log('Response:', JSON.stringify(response, null, 2));
             location.reload();
             alert('項目'+updateDataFrom.itemId+'已成功修改')
           },
           error: function(xhr, status, error) {
             console.log('Error:', error);
           }
     });
}