$(function(){
    chart()
});
function chart() {
    // 获取 canvas 元素
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
        type: 'bar',
        data: data,
        options: options
    });

}