var createChartData = function() {
    var data = Object.keys(coinTypes)
    data.map((value, index, array) => {
        if (coinTypes[value].ValueOfPoint.Value.length > 100) {
            coinTypes[value].ValueOfPoint.Value.splice(0, 100)
            coinTypes[value].ValueOfPoint.Time.splice(0, 100);
            timeArr.splice(1, 100);
        }

        var arr = [];
        arr = arr.concat(coinTypes[value].ValueOfPoint.Value);
        data[index] = arr;
        data[index].unshift(value);
    });

    data.unshift(timeArr);
    return data;
}

var _data = {
    x: 'x',
    columns: createChartData()
}


var reloadChart = function() {
    setTimeout(function() {
        cryptoChart.flow({
            duration: 1500,
            columns: createChartData(),
            length: 5,
            done: reloadChart
        });
    }, reloadInterval);
}