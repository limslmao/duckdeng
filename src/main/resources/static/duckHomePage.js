$(function(){
//    chart()
  $('#createSheet').on('click', function(event) {
    event.preventDefault(); // Prevent the default link navigation
    chart(); // Call your function
    calculateDateRange();
  });
  $('#dateRange').on('change', function(event) {
      event.preventDefault(); // Prevent the default link navigation
      dateRange(); // Call your function
    });

});

const data = {//給他的
    startDate:"",
    endDate:"",
    rangeDate:"",//week,month,year
    type:"" //itemIngred itemUnit itemCookMethod itemSpicy
}
const data_ = {
    {$rangeDate}:[
        range_1:{
            {$type1}:"count"
            {$type2}:"count"
        },
        range_2:{
            {$type1}:"count"
            {$type2}:"count"
        }
    ],
    totalCount:{
        {$type1}:"totalCount"
        {$type2}:"totalCount"
    }
}
function dateRange() {
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
function calculateDateRange() {
    var today = new Date();
    var halfYearAgo = new Date();

    // 設定半年前的日期
    halfYearAgo.setMonth(today.getMonth() - 6);

    // 將日期格式化為 "YYYY-MM-DD" 格式
    var todayFormatted = formatDate(today);
    var halfYearAgoFormatted = formatDate(halfYearAgo);

    var dateRange = halfYearAgoFormatted + ' 到 ' + todayFormatted;
    console.log(dateRange);
}
function formatDate(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    return year + month+ day;
}






function chart() {
    var barChartCanvas = $('#barChart').get(0).getContext('2d');
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var data_count_chicken = [20,10,20,20,20,30,20,15,30,20,20,20]
    var data_count_duck = [10,20,20,20,30,20,15,30,20,20,20,20,]
    // 数据
    var data = {
        labels: months,
        datasets: [{
            label: 'Duck',
            backgroundColor: 'rgba(255, 99, 132, 0.9)', // 柱状图颜色
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bba',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: data_count_chicken // Y 轴数据
        },{
            label: 'Chicken',
            backgroundColor: 'rgba(60,141,188,0.9)', // 柱状图颜色
            borderColor: 'rgba(60,141,188,0.8)',
            pointRadius: false,
            pointColor: '#3b8bba',
            pointStrokeColor: 'rgba(60,141,188,1)',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(60,141,188,1)',
            data: data_count_duck // Y 轴数据
        }]
    };
    // 配置选项
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
    // 创建柱状图
    var barChart = new Chart(barChartCanvas, {
        data: data,
        type: 'bar',
        options: options
    });
}