
$(function(){
//    chart()
  $('#createSheet').on('click', function(event) {

    event.preventDefault(); // Prevent the default link navigation
    getData()
//    chart(); // Call your function
  });
  $('#dateRange').on('change', function(event) {
      event.preventDefault(); // Prevent the default link navigation
      updateDateRangeText(); // Call your function
    });

});

const dataForCondition = {//給他的
     startDate: "20230211",
     endDate: "20230811",
     rangeType: "week",//week,month,year
     type: "itemIngred"//itemIngred itemUnit itemCookMethod itemSpicy
}
const dataForResponse = {
   dataType:["duck","chicken"],
   rangeType:"week",
   countDtl: [
     {
       range:"Jan-1",
       count: {
         duck: 100,
         chicken: 100
       }
     },
     {
       range:"Jan-2",
       count: {
         duck: 120,
         chicken: 80
       }
     },
     {
       range:"Jan-3",
       count: {
         duck: 90,
         chicken: 80
       }
     },
     {
       range:"Jan-4",
       count: {
         duck: 14,
         chicken: 80
       }
     },
     {
       range:"Feb-1",
       count: {
         duck: 13,
         chicken: 80
       }
     },
     {
       range:"Feb-2",
       count: {
         duck: 10,
         chicken: 80
       }
     },
     {
       range:"Feb-3",
       count: {
         duck: 11,
         chicken: 80
       }
     }
   ],
   totalCount: {
     duck: 220,
     chicken: 180
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
    var dataKey = dataForResponse.dataType;
    var dataX = [];
    var dataCounts = [];
    for (var i = 0; i < countDtl.length; i++) {
        dataX.push(countDtl[i].range);
        var countData = [];
        for (var j = 0; j < dataKey.length; j++) {
            countData.push(countDtl[i].count[dataKey[j]]);
        }
        dataCounts.push(countData);
    }
    var nullBarChartCount = searchNullCanvas()
    console.log("nullBarChartCount:"+nullBarChartCount)
    if (nullBarChartCount) {
        chart(dataX, dataCounts, dataKey,nullBarChartCount);
    }

}



function searchNullCanvas() {
    return false;
    for (var i = 1; i <= 3; i++) {
        var styleAttribute = $('#barChart-' + i).attr('style'); ///要找出如何判斷是否有插入圖表的QUERY
        if (styleAttribute && styleAttribute.includes('box-sizing')) {
        } else {
        return i;
        }
    }
    alert("請刪除一個項目")
    return null
}
function chart(dataX, dataCounts, dataKey, nullBarChartCount) {
    var barChartCanvas = $('#barChart-' + nullBarChartCount).get(0).getContext('2d');
    var axisX = dataX;
    var datasets = [];

    for (var i = 0; i < dataKey.length; i++) {
        var color = `rgba(${(i * 47) % 255}, ${(i * 71) % 255}, ${(i * 113) % 255}, 0.9)`;

        datasets.push({
            label: dataKey[i],
            backgroundColor: color,
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bba',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: dataCounts.map(countData => countData[i])
        });
    }

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
        }
    };

    var barChart = new Chart(barChartCanvas, {
        data: data,
        type: 'bar',
        options: options
    });
}