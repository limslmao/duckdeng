cardCreateCount = 0
$(function(){
  $('#createSheet').on('click', function(event) {
    event.preventDefault();
    cardCreate()
    getData();
  });
  $('#dateRange').on('change', function(event) {
      event.preventDefault(); // Prevent the default link navigation
      updateDateRangeText(); // Call your function
    });
});
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
  'hand': '手扒'
};
const dataForCondition = {//給他的
     startDate: "20230211",
     endDate: "20230811",
     rangeType: "week",//week,month,year
     type: "itemIngred"//itemIngred itemUnit itemCookMethod itemSpicy
}
const dataForResponse = {
   rangeType:"week",
   countDtl: [
     {
       range:"Jan-1",
       count: {
         two: 100,
         saute : 100,
         cut:80,
         hand:50
       }
     },
     {
       range:"Jan-2",
       count: {
         two: 100,
         saute : 180,
         cut:90,
         hand:50
       }
     },
     {
       range:"Jan-3",
       count: {
         two: 100,
         saute : 100,
         cut:89,
         hand:80
       }
     },
     {
       range:"Jan-4",
       count: {
         two: 90,
         saute : 100,
         cut:50,
         hand:50
       }
     },
     {
       range:"Feb-1",
       count: {
        two: 100,
        saute : 100,
        cut:80,
        hand:50
       }
     },
     {
       range:"Feb-2",
       count: {
         two: 100,
         saute : 100,
         cut:80,
         hand:50
       }
     },
     {
       range:"Feb-3",
       count: {
         two: 100,
         saute : 100,
         cut:80,
         hand:50
       }
     }
   ],
   totalCount: {
     two: 1000,
     saute : 1000,
     cut:800,
     hand:500
   }
}
function updateDateRangeText() {
    var text = '';
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
  var today = new Date();
  var startDate, endDate;

  if (dateRange === 'week') {
    var halfYearAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
    startDate = halfYearAgo;
    endDate = today;
  } else if (dateRange === 'month') {
    var startOfYear = new Date(today.getFullYear(), 0, 1);
    var endOfYear = new Date(today.getFullYear(), 11, 31);
    startDate = startOfYear;
    endDate = endOfYear;
  } else if (dateRange === 'year') {
    var fiveYearsAgo = new Date(today.getFullYear() - 4, 0, 1);
    var endOfYear = new Date(today.getFullYear(), 11, 31);
    startDate = fiveYearsAgo;
    endDate = endOfYear;
  }

  var formattedStartDate = formatDateToYYYYMMDD(startDate);
  var formattedEndDate = formatDateToYYYYMMDD(endDate);

  return {
    startDate: formattedStartDate,
    endDate: formattedEndDate
  };
}
function formatDateToYYYYMMDD(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return year  + month  + day;
}
function getData() {
    dateRange = $('#dateRange').val();
    dateType = $('#dateType').val();
    var weekDateRange = getStartDateAndEndDate(dateRange);
    dataForCondition.startDate =  weekDateRange.startDate;
    dataForCondition.endDate =  weekDateRange.endDate;
    dataForCondition.rangeType =  dateRange;
    dataForCondition.type = dateType;
    console.log(dataForCondition);
//ajax input dataForCondition...
    var countDtl = dataForResponse.countDtl;
    var countObject = dataForResponse.countDtl[0].count; // 获取 count 对象
    var dataKey = Object.keys(countObject); // 获取 count 对象的所有键
    var dataX = [];
    var dataCounts = [];
    var dataPerson = [];
    for (var i = 0; i < countDtl.length; i++) {
        dataX.push(countDtl[i].range);
        var countData = [];
        for (var j = 0; j < dataKey.length; j++) {
            countData.push(countDtl[i].count[dataKey[j]]);
        }
        dataCounts.push(countData);
    }
    dataPerson = calculatePerson(dataCounts)
    chart(dataX, dataCounts, dataKey, dataPerson);
}
function calculatePerson(dataCounts) {
      var dataPerson = [];
      var personData = [];
      var sum = 0;
      var value = 0;
      for(var i = 0; i < dataCounts.length; i++) {
        personData = [];
        sum = 0
        value = 0;
        for(var j = 0; j < dataCounts[i].length; j++) {
          sum += dataCounts[i][j]
        }
        for(var z = 0; z < dataCounts[i].length; z++) {
            value =  Math.round((dataCounts[i][z]/sum) *100)
            personData.push(value)
        }
        dataPerson.push(personData)
      }
      return dataPerson
}
function chart(dataX, dataCounts, dataKey, dataPerson) {
    var barChartCanvas = $('#barChart-' + cardCreateCount).get(0).getContext('2d');
    var axisX = dataX;
    var datasets = [];
    var tittle = ""
    for (var i = 0; i < dataKey.length; i++) {
        tittle += orderConvert[dataKey[i]] + (i === dataKey.length - 1 ? "" : ",");
        var color = `rgba(${(i * 47) % 255}, ${(i * 71) % 255}, ${(i * 113) % 255}, 0.9)`;
        datasets.push({
            label: orderConvert[dataKey[i]],
            backgroundColor: color,
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bba',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: dataCounts.map(countData => countData[i]),
        });
    }
    $('#title-' + cardCreateCount).text(tittle)
    var data = {
        labels: axisX,
        datasets: datasets
    };
    var options = {
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
        },
         plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                 var label = context.dataset.label || '';
                                 var dataIndex = context.dataIndex;
                                 var value = dataPerson[dataIndex][context.datasetIndex] + '%';
                                 return label + ': ' + value;
                            }
                        }
                    },
                    datalabels: {
                                anchor: 'end',
                                align: 'end',
                                formatter: function(value, context) {
                                    var percentage = value + '%';
                                    var customText = '额外的信息';
                                    return percentage + ' ' + customText;
                                }
                    }
                   }
    }
    var barChart = new Chart(barChartCanvas, {
        data: data,
        type: 'bar',
        options: options
    });
}
function cardCreate() {
    cardCreateCount ++
    var cardHtml = $('<div class="card card-success">'); // 创建一个包含 card 样式的 div 元素
    // 创建 card-header 部分
    var cardHeader = $('<div class="card-header">');
    var cardTitle = $('<h3 class="card-title" id="title-'+cardCreateCount+'">等待搜尋中...</h3>');
    var cardTools = $('<div class="card-tools">');
    var collapseButton = $('<button type="button" class="btn btn-tool" data-card-widget="collapse"><i class="fas fa-minus"></i></button>');
    var cleanButton = $('<button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i></button>');
    cardTools.append(collapseButton);
    cardTools.append(cleanButton);
    cardHeader.append(cardTitle);
    cardHeader.append(cardTools);
    // 创建 card-body 部分
    var cardBody = $('<div class="card-body">');
    var chartContainer = $('<div class="chart"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div></div></div><div class="chartjs-size-monitor-shrink"><div></div></div></div>');
    var canvas = $('<canvas id="barChart-'+cardCreateCount+'" style="min-height: 250px; height: 250px; max-height: 250px; max-width: 100%; display: block; width: 708px;" width="1062" height="375" class="chartjs-render-monitor"></canvas>');
    chartContainer.append(canvas);
    cardBody.append(chartContainer);
    // 将所有部分添加到 cardHtml 中
    cardHtml.append(cardHeader);
    cardHtml.append(cardBody);
    // 将 cardHtml 添加到页面中，例如一个容器元素
    $('#cardAutoCreate').append(cardHtml);
}
