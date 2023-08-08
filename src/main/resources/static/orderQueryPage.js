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
$(function(){
});



function getOrderData () {

}


function contentHtmlInner() {
       var newRow = $('<tr>');
       newRow.append('<td>' + menuArr[0] + '</td>');
       newRow.append('<td>' + menuArr[1] + '</td>');
       newRow.append('<td><input class="custom-checkbox" type="checkbox"  ' + menuArr[2] + '></td>');
       newRow.append('<td>' + menuArr[3] + '</td>');
       $('#tableBody').append(newRow);
}