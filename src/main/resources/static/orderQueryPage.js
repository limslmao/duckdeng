$(function(){
});

function contentHtmlInner() {
       var newRow = $('<tr>');
       newRow.append('<td>' + menuArr[0] + '</td>');
       newRow.append('<td>' + menuArr[1] + '</td>');
       newRow.append('<td><input class="custom-checkbox" type="checkbox"  ' + menuArr[2] + '></td>');
       newRow.append('<td>' + menuArr[3] + '</td>');
       $('#tableBody').append(newRow);
}