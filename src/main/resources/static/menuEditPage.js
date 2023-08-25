/*  current API used: GET,POST,PUT,DELETE/api/orderItems    */
/*  main function: menu CRUD                  */
/*  version record:                           */
/*  --date--   --name--    --event--          */
/*  2023/08/25   Arte      codeReview         */
/*                                            */

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
  'null':'--',
};
const insertAndUpdateRequestJson = {};
const $updateRowDefault = {
     itemId:"",
     price:650,
     itemType:"main",
     itemIngred:"duck",
     itemUnit:"full",
     itemSpicy:"Y",
     itemCookMethod:"two",
     note:"蔥爆牛肉",
     itemCost:50
};
let queryResponseJson = {
                 "menuDtl": [
                   {
                     "itemId":"001",
                     "price":600,
                     "itemType":"main",
                     "itemIngred":"duck",
                     "itemUnit":"full",
                     "itemSpicy":"N",
                     "itemCookMethod":"two",
                     "note": "全鴨二吃",
                     "itemCost": 50
                   },
                    {
                     "itemId":"002",
                     "price":650,
                     "itemType":"main",
                     "itemIngred":"duck",
                     "itemUnit":"full",
                     "itemSpicy":"Y",
                     "itemCookMethod":"two",
                     "note": "全鴨二吃",
                     "itemCost": 50
                   }
                 ]
               }//orderItems
let buttonClick = ""
let updateHtml = ""
let clickItemId = ""
let createItemName = ""
$(function(){
    getMenuData()
    $('#addItem').on('click', function() {
        buttonClick = 'create';
        menuItemInputHtmlCreate();
    });
    $('#tableBody').on('click', '.cancel-button', function() {
        cancelItemAdd()
    });
    $('#tableBody').on('click', '.confirm-button', function() {
        if (buttonClick == 'create'){
            $updateRowDefault.note = $('#itemName').val();
        }
        modalHtmlCreate();
    });
    $('#tableBody').on('click', '.deleteData', function() {
        $updateRowDefault.itemId = $(this).closest('tr').find('#itemIdForTd').text();
        $updateRowDefault.note = $(this).closest('tr').find('#itemNameForTd').text();
        buttonClick = 'delete';
        modalHtmlCreate();
    });
    $('#tableBody').on('click', '.updateData', function() {
        buttonClick = 'update';
        $updateRowDefault.itemId = $(this).closest('tr').find('#itemIdForTd').text();
        $updateRowDefault.note = $(this).closest('tr').find('#itemNameForTd').text();
        $updateRowDefault.price = $(this).closest('tr').find('#itemPriceForTd').text();
        $updateRowDefault.itemType = $(this).closest('tr').find('#itemTypeForTd').text();
        $updateRowDefault.itemUnit= $(this).closest('tr').find('#itemUnitForTd').text();
        $updateRowDefault.itemIngred= $(this).closest('tr').find('#itemIngredForTd').text();
        $updateRowDefault.itemCookMethod= $(this).closest('tr').find('#itemCookMethodForTd').text();
        $updateRowDefault.itemSpicy = $(this).closest('tr').find('#itemSpCheckForTd').text();
        $updateRowDefault.itemCost = $(this).closest('tr').find('#itemCostForTd').text();
        updateHtml =  $(this).closest('tr')
        updateHtml.remove()
        updateMenu()
    });
    $('.modal-footer').on('click', '#itemActionBtn', function() {
        switch (buttonClick) {
            case 'delete':
                deleteMenuData($updateRowDefault.itemId);
                break;
           case 'update':
           case 'create':  // 分别列出两个条件
             confirmItemAdd();
             break;
         }
    });
});
function modalHtmlCreate() {
    let action ='';
    switch (buttonClick) {
        case 'delete':
            action = '刪除';
            break;
        case 'update':
            action = '修改';
            break;
        case 'create':
            action = '新建';
            break;
    }
    $('#itemActionContent').text('是否確定要'+action+$updateRowDefault.note+'');
    $('#itemActionTittle').text('提示訊息');
    $('#myModal').modal('show');
}
function updateMenu(itemId) {
    $('.updateData, .deleteData').prop('disabled', true);
    buttonClick = "update" ;
    menuItemInputHtmlCreate();
}
function menuItemHtmlCreate() {
    for (const item of queryResponseJson.menuDtl) {
        let newRow = $('<tr>');
        newRow.append('<td id = "itemIdForTd">' + item.itemId + '</td>');
        newRow.append('<td id = "itemNameForTd">' + item.note + '</td>');
        newRow.append('<td id = "itemPriceForTd">' + item.price + '</td>');
        newRow.append('<td id = "itemTypeForTd">' + orderConvert[item.itemType] + '</td>');
        newRow.append('<td id = "itemIngredForTd">' + orderConvert[item.itemIngred] + '</td>');
        newRow.append('<td id = "itemUnitForTd">' + orderConvert[item.itemUnit] + '</td>');
        newRow.append('<td id = "itemCookMethodForTd">' + orderConvert[item.itemCookMethod] + '</td>');
        newRow.append('<td id = "itemSpCheckForTd">' + orderConvert[item.itemSpicy] + '</td>');
        newRow.append('<td id = "itemCostForTd">' +item.itemCost + '</td>');
        newRow.append('<td><button class="btn btn-primary updateData">修改</button> <button class="btn btn-danger deleteData">刪除</button></td>');
        $('#tableBody').append(newRow);
    }
}
function menuItemInputHtmlCreate() {
    $('#addItem').prop('disabled', true);
    let newRow = $('<tr id="createItem">');
    newRow.append('<td id = "tdItemId" >新增後產生</td>');
    newRow.append('<td><input type="text" class="form-control" placeholder="請輸入品項名稱" id="itemName"></td>');
    newRow.append('<td><input type="number" class="form-control" placeholder="請輸入品項金額" id="itemPrice"></td>');
    let itemTypeSelect = $('<select class="form-select" id="itemType"><option value="main">主菜</option><option value="add">加購</option></select>');
    let itemIngredSelect = $('<select class="form-select" id="itemIngred"><option value="duck">鴨</option><option value="chicken">雞</option></select>');
    let itemUnitSelect = $('<select class="form-select" id="itemUnit"><option value="half">半隻</option><option value="full">全隻</option></select>');
    let itemCookMethodSelect = $('<select class="form-select" id="itemCookMethod"><option value="two">兩吃</option><option value="saute">剁炒</option><option value="cut">剁盤</option><option value="hand">手扒</option><option value="else">其他</option></select>');
    let itemSpCheckInput = $('<input class="custom-checkbox" type="checkbox" id="itemSpCheck" >');
    // Disable fields when 加購 option is selected
    itemTypeSelect.on('change', function() {
        let isAddOptionSelected = $(this).val() === 'add';
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
    newRow.append('<td><input class="form-control" type="number" id="itemCost" placeholder="請輸入成本金額"></td>');
    newRow.append('<td><button class="btn btn-primary cancel-button">取消</button> <button class="btn btn-primary confirm-button">確定</button></td>');
    $('#tableBody').append(newRow);
    if (buttonClick == 'update') {
        $('#tdItemId').text($updateRowDefault.itemId );
        $('#itemName').val($updateRowDefault.note );
        $('#itemPrice').val($updateRowDefault.price );
        $('#itemType').val(findKeyByValue(orderConvert, $updateRowDefault.itemType) );
        $('#itemIngred').val(findKeyByValue(orderConvert, $updateRowDefault.itemIngred)  );
        $('#itemUnit').val(findKeyByValue(orderConvert, $updateRowDefault.itemUnit) );
        $('#itemCookMethod').val(findKeyByValue(orderConvert, $updateRowDefault.itemCookMethod ) );
        $('#itemSpCheck').prop('checked', findKeyByValue(orderConvert,$updateRowDefault.itemSpicy) === 'Y' ? true : false);
        $('#itemCost').val($updateRowDefault.itemCost);
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
    $('.updateData, .deleteData,  #addItem').prop('disabled', false);
    $('#createItem').remove();
    $('#tableBody').append(updateHtml);
}
function confirmItemAdd() {
    insertAndUpdateRequestJson.price = parseFloat($('#itemPrice').val());
    insertAndUpdateRequestJson.itemType = $('#itemType').val();
    insertAndUpdateRequestJson.itemIngred =$('#itemIngred').val();
    insertAndUpdateRequestJson.itemUnit = $('#itemUnit').val();
    insertAndUpdateRequestJson.itemCookMethod = $('#itemCookMethod').val();
    insertAndUpdateRequestJson.itemSpicy = $('#itemSpCheck').prop('checked') ? 'Y' : 'N';
    insertAndUpdateRequestJson.itemCost =  $('#itemCost').val();
    if (insertAndUpdateRequestJson.itemType == "add") {
        insertAndUpdateRequestJson.itemSpicy = null
    }
    insertAndUpdateRequestJson.note = $('#itemName').val();
    if (buttonClick == "update") {
        insertAndUpdateRequestJson.itemId = $updateRowDefault.itemId
        const orderJsonString = JSON.stringify(insertAndUpdateRequestJson);
        putMenuData(orderJsonString)
    } else {
        const orderJsonString = JSON.stringify(insertAndUpdateRequestJson);
        postMenuData(orderJsonString)
    }
}//insert update 共用
function getMenuData() {
    $.ajax({
      type: 'GET',
      url: '/api/orderItems ',
      success: function(response) {
        $('#loading').attr('hidden', true);
//        console.log('Response:', JSON.stringify(response, null, 2));
        queryResponseJson = response
        menuItemHtmlCreate()
        $('#addItem').prop('disabled', false);
      },
      error: function(xhr, status, error) {
        console.log('Error:', error);
      }
    });
}
function postMenuData(orderJsonString) {
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
function putMenuData(orderJsonString) {
     $.ajax({
           type: 'PUT',
           url: '/api/orderItems/'+$updateRowDefault.itemId+'',
           data: orderJsonString,
           contentType: 'application/json',
           success: function(response) {
             $('#loading').attr('hidden', true);
             console.log('Response:', JSON.stringify(response, null, 2));
             location.reload();
             alert('項目'+$updateRowDefault.itemId+'已成功修改')
           },
           error: function(xhr, status, error) {
             console.log('Error:', error);
           }
     });
}
function deleteMenuData(itemId) {
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
}
