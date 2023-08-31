/*  current API used: GET/api/orderReports    */
/*  main function: report by menu type        */
/*  version record:                           */
/*  --date--   --name--    --event--          */
/*  2023/08/25   Arte      codeReview         */
/*                                            */

let cardCreateCount = 0 // 建立了幾張圖表
const orderConvert = {
  'duck': '鴨',
  'chicken': '雞',
  'full': '全隻',
  'half': '半隻',
  'N': '無香鍋',
  'Y': '有香鍋麻辣',
  'two': '兩吃',
  'saute': '剁炒',
  'cut': '剁盤',
  'hand': '手扒',
  'cost':'成本',
  'revenue':'收益'
};//所有type value 的翻譯
const queryRequestJson = {
     startDate: "20230211",
     endDate: "20230811",
     rangeType: "week",//week,month,year
     type: "itemIngred"//itemIngred itemUnit itemCookMethod itemSpicy
} //request body
let queryResponseJson = {
                         "itemType": [
                              "revenue",
                              "cost"
                          ],
                         "rangeType": "week",
                         "countDtl": [
                           {
                             "range": "Jan-1",
                             "count": {
                               "cost": 10000,
                               "revenue": 8000
                             }
                           },
                           {
                             "range": "Jan-2",
                             "count": {
                               "cost": 12000,
                               "revenue": 8600
                             }
                           },
                           {
                             "range": "Jan-3",
                             "count": {
                               "cost": 15000,
                               "revenue": 9000
                             }
                           },
                           {
                             "range": "Jan-4",
                             "count": {
                               "cost": 18000,
                               "revenue": 10000
                             }
                           },
                           {
                             "range": "Feb-1",
                             "count": {
                               "cost": 19000,
                               "revenue": 12000
                             }
                           },
                           {
                             "range": "Feb-2",
                             "count": {
                               "cost": 20000,
                               "revenue": 12000
                             }
                           },
                           {
                             "range": "Feb-3",
                             "count": {
                               "cost": 10000,
                               "revenue": 8000
                             }
                           }
                         ]
                      } // response body
$(function(){
  $('#createSheet').on('click', function(event) {
    event.preventDefault();
    reportCardCreate()
    getReportData();
  });
  $('#dateRange').on('change', function(event) {
      event.preventDefault(); // Prevent the default link navigation
      updateDateRangeText(); // Call your function
    });
});
function updateDateRangeText() {
    let text = '';
    switch ($('#dateRange').val()) {
        case 'week':
            text = '(範圍:這半年每周)';
            break;
        case 'month':
            text = '(範圍:今年每月)';
            break;
        case 'year':
            text = '(範圍:這五年每年)';
            break;
        default:
            text = '未知選項';
            break;
    }
    $('#range').text(text)
}
function getStartDateAndEndDate(dateRange) {
  let today = new Date();
  let startDate, endDate;
  if (dateRange === 'week') {
    let halfYearAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
    startDate = halfYearAgo;
    endDate = today;
  } else if (dateRange === 'month') {
    let startOfYear = new Date(today.getFullYear(), 0, 1);
    let endOfYear = new Date(today.getFullYear(), 11, 31);
    startDate = startOfYear;
    endDate = endOfYear;
  } else if (dateRange === 'year') {
    let fiveYearsAgo = new Date(today.getFullYear() - 4, 0, 1);
    let endOfYear = new Date(today.getFullYear(), 11, 31);
    startDate = fiveYearsAgo;
    endDate = endOfYear;
  }
  let formattedStartDate = formatDateToYYYYMMDD(startDate);
  let formattedEndDate = formatDateToYYYYMMDD(endDate);
  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate
  };
}
function formatDateToYYYYMMDD(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return year  + month  + day;
}
function getReportData() {
    htmlControl('getData');
    let dateRange = $('#dateRange').val();
    let dateType = $('#dateType').val();
    let weekDateRange = getStartDateAndEndDate(dateRange);
    queryRequestJson.startDate =  weekDateRange.startDate;
    queryRequestJson.endDate =  weekDateRange.endDate;
    queryRequestJson.rangeType =  dateRange;
    queryRequestJson.type = dateType;
    $.ajax({
             type: 'GET',
             url: '/api/orderReports?startDate='+queryRequestJson.startDate+'&endDate='+queryRequestJson.endDate+'&dataRangeType='+queryRequestJson.rangeType+'&itemType='+queryRequestJson.type+'',
             contentType: 'application/json', // 設定 content type 為 JSON
             success: function(response) {
               console.log('Response:', JSON.stringify(response, null, 2));
               queryResponseJson = response
               dataResponse()
             },
             error: function(xhr, status, error) {
               console.log('Error:', error);
             }
           });
}
function htmlControl(action) {
    switch (action) {  // 注意这里的 switch 关键字
        case 'getData':
            $('#createSheet').prop('disabled', true);
            $('#loading').attr('hidden', false);
            break;
        case 'chartCreateDone':
            $('#loading').attr('hidden', true);
            $('#createSheet').prop('disabled', false);
            break;
        default:
            break;
    }
}
function dataResponse() {
    let countDtl = queryResponseJson.countDtl;
    let dataKeyList =  queryResponseJson.itemType; //取得種類
    let dataXaxisList = [];
    let reportCountList = [];//[[]]
    let reportCountPersonList = [];//[[]]
    let reportCostList = [];//暫時沒用到
    for (let i = 0; i < countDtl.length; i++) {
        dataXaxisList.push(countDtl[i].range);
        let countDataList = [];
//        let costData = [];
        for (let j = 0; j < dataKeyList.length; j++) {
            dataValue = countDtl[i].count[dataKeyList[j]] || 0
            countDataList.push(dataValue);
//            dataValue = countDtl[i].cost[dataKeyList[j]] || 0
//            costData.push(dataValue/100);
        }
        reportCountList.push(countDataList);
//        reportCostList.push(costData);
    }
    reportCountPersonList = calculatePerson(reportCountList)
    chart(dataXaxisList, reportCountList, dataKeyList, reportCountPersonList);
//    chart(dataXaxisList, reportCountList, dataKeyList, reportCountPersonList,reportCostList);
}
function calculatePerson(reportCountList) {
      let reportCountPersonList = [];
      let countPersonList = [];
      for(let i = 0; i < reportCountList.length; i++) {
        personDataList = [];
        let rangeReportSum = 0;
        let reportPersonValue = 0; 
        for(let j = 0; j < reportCountList[i].length; j++) {
          rangeReportSum += reportCountList[i][j]
        }
        for(let z = 0; z < reportCountList[i].length; z++) {
            reportPersonValue =  Math.round((reportCountList[i][z]/rangeReportSum) *100) 
            personDataList.push(reportPersonValue)
        }
        reportCountPersonList.push(personDataList)
      }
      return reportCountPersonList
}
function chart(dataXaxisList, reportCountList, dataKeyList, reportCountPersonList,reportCostList) {
    let barChartCanvas = $('#barChart-' + cardCreateCount).get(0).getContext('2d');
    let axisX = dataXaxisList;
    let datasets = [];
    let cardTittle = ""
    for (let i = 0; i < dataKeyList.length; i++) {
        cardTittle += orderConvert[dataKeyList[i]] + (i === dataKeyList.length - 1 ? "" : ",");
        let color = `rgba(${(i * 47) % 255}, ${(i * 71) % 255}, ${(i * 113) % 255}, 0.9)`;
        datasets.push({
            label: orderConvert[dataKeyList[i]],
            backgroundColor: color,
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bba',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: reportCountList.map(countDataList => countDataList[i]),
        });
    }
    $('#title-' + cardCreateCount).text(cardTittle)
    let data = {
        labels: axisX,
        datasets: datasets
    };
    let options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: true
                }
            }

        }, plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                             let label = context.dataset.label || '';
                             let dataIndex = context.dataIndex;
                             let person = reportCountPersonList[dataIndex][context.datasetIndex] + '%';
                             let count = reportCountList[dataIndex][context.datasetIndex]
                             return label + ': ' + count + '隻(佔'+person+')' ;
                        }
                    }
                },
             }
        }
    let barChart = new Chart(barChartCanvas, {
        data: data,
        type: 'bar',
        options: options

    });
//    let dataXaxisList_2 = [];
//    for (let i = 0; i < dataXaxisList.length; i++) {
//        for (let j = 0; j < dataKeyList.length; j++)
//        dataXaxisList_2.push(dataKeyList[j]);
//    }
//    // 更新折线图的数据集
//    let dataLine = {
//        labels: dataXaxisList_2,
//        datasets: [20, 10, 20, 40, 45, 50, 90, 80, 48, 44, 45, 45, 48, 12, 14, 54, 80]  // 将折线图数据集对象放入数组中
//    };
//      let lineDataset = {
//          label: 'cost',
//          borderColor: 'rgba(255, 99, 132, 1)',
//          fill: false,
//          data: dataLine , // 使用对应数据键的数据
//          type: 'line'
//      };
//
//    // 将折线图数据集添加到 barChart 中
//    barChart.data.datasets.push(lineDataset);
//
//    // 更新 barChart
//    barChart.update();
    htmlControl('chartCreateDone')
}


function reportCardCreate() {
    cardCreateCount ++
    let cardHtml = $('<div class="card card-success">'); // 创建一个包含 card 样式的 div 元素
    // 创建 card-header 部分
    let cardHeader = $('<div class="card-header">');
    let cardTitle = $('<h3 class="card-title" id="title-'+cardCreateCount+'">等待搜尋中...</h3>');
    let cardTools = $('<div class="card-tools">');
    let collapseButton = $('<button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>');
    let cleanButton = $('<button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i></button>');
    cardTools.append(collapseButton);
    cardTools.append(cleanButton);
    cardHeader.append(cardTitle);
    cardHeader.append(cardTools);
    // 创建 card-body 部分
    let cardBody = $('<div class="card-body">');
    let chartContainer = $('<div class="chart"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div></div></div><div class="chartjs-size-monitor-shrink"><div></div></div></div>');
    let canvas = $('<canvas id="barChart-'+cardCreateCount+'" style="min-height: 250px; height: 250px; max-height: 250px; max-width: 100%; display: block; width: 708px;" width="1062" height="375" class="chartjs-render-monitor"></canvas>');
    chartContainer.append(canvas);
    cardBody.append(chartContainer);
    // 将所有部分添加到 cardHtml 中
    cardHtml.append(cardHeader);
    cardHtml.append(cardBody);
    // 将 cardHtml 添加到页面中，例如一个容器元素
    $('#cardAutoCreate').append(cardHtml);
}