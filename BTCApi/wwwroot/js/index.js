const https = require('https')
const moment = require('moment');
const PRICE_TAG = "_price";
const reloadInterval = 6 * 1000;
const options = {
    hostname: 'api.btcturk.com',
    port: 443,
    path: '/api/v2/ticker?pairSymbol=BTC_TRY',
    method: 'GET'
}
var timeArr = ["x"];
var coinTypes = {
    BTC: { Code: 'BTC', Value: "Bitcoin", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    ETH: { Code: 'ETH', Value: "Etherium", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    DASH: { Code: 'DASH', Value: "DASH", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    EOS: { Code: 'EOS', Value: "EOS", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    LINK: { Code: 'LINK', Value: "LINK", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    LTC: { Code: 'LTC', Value: "LTC", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    NEO: { Code: 'NEO', Value: "NEO", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    USDT: { Code: 'USDT', Value: "Dolar", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    XLM: { Code: 'XLM', Value: "Stealler", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    XRP: { Code: 'XRP', Value: "Ripple", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    ATOM: { Code: 'ATOM', Value: "Cosmos", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } },
    XTZ: { Code: 'XTZ', Value: "Tezos", LastPrice: '0', ValueOfPoint: { Time: [], Value: [] } }
};

function getLastPrices() {
    var objectKeys = Object.keys(coinTypes);
    objectKeys.forEach(coinKey => {
        var coin = coinTypes[coinKey];
        options.path = '/api/v2/ticker?pairSymbol=' + coin.Code + '_TRY';
        httpRequest(options).then((coin_data) => {
            var coinPriceP = document.getElementById(coin.Code + PRICE_TAG);
            var lastValue = coin_data.data[0].last;

            if (lastValue > coinTypes[coin.Code].LastPrice) {
                coinPriceP.parentElement.classList.add('increase');
                coinPriceP.parentElement.classList.remove('decrease');
            } else {
                coinPriceP.parentElement.classList.remove('increase');
                coinPriceP.parentElement.classList.add('decrease');
            }

            coinPriceP.innerText = lastValue + ' TRY';
            coinTypes[coin.Code].LastValue = lastValue;
            coinTypes[coin.Code].ValueOfPoint.Time.push(Date.now());
            coinTypes[coin.Code].ValueOfPoint.Value.push(lastValue);
        });
    });
    timeArr.push(Date.now());
}

setInterval(getLastPrices, reloadInterval);

document.addEventListener('DOMContentLoaded', onload);

var onload = function() {
    createSinglePriceTable();
    setTimeout(function() {
        window.cryptoChart = c3.generate({
            bindTo: 'chart',
            data: _data,
            point: {
                show: false
            },
            size: {
                height: 900,
                width: 1200
            },
            axis: {
                x: {
                    type: 'category',
                    tick: {
                        count: 10,
                        format: function(x) {
                            if (x == 0 || x === undefined)
                                x = Date.now();
                            return moment(timeArr[x]).format('HH:mm:ss')
                        },
                        rotate: 50,
                        height: 130
                    }
                }
            }
        });
    }, 1000);

    reloadChart();
}

function createSinglePriceTable() {
    var objectKeys = Object.keys(coinTypes);
    var coinTable = document.getElementById('coins');
    objectKeys.forEach(coinKey => {
        var coin = coinTypes[coinKey];
        var rootDiv = document.createElement('div');
        rootDiv.className = 'single-price-table d-flex align-items-center justify-content-between';
        var pContent = document.createElement('div');
        pContent.className = 'p-content d-flex align-items-center';
        var index = document.createElement('span');
        index.innerText = objectKeys.indexOf(coinKey) + 1;
        var img = document.createElement('img');
        img.src = 'img/bg-img/' + coin.Code + '.png';
        var description = document.createElement('p');
        description.innerHTML = coin.Value + '<span>' + coin.Code + '</span>';
        pContent.appendChild(index);
        pContent.appendChild(img);
        pContent.appendChild(description);
        var priceDiv = document.createElement('div');
        var priceP = document.createElement('p');
        priceP.id = coin.Code + PRICE_TAG;
        priceDiv.className = "price";
        priceDiv.appendChild(priceP);
        rootDiv.appendChild(pContent)
        rootDiv.appendChild(priceDiv);

        coinTable.appendChild(rootDiv);
    });
    getLastPrices();
}

function httpRequest(params, postData) {
    return new Promise(function(resolve, reject) {
        var req = https.get(params, function(res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            // resolve on end
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch (e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        // reject on request error
        req.on('error', function(err) {
            // This is not a 'Second reject', just a different sort of failure
            reject(err);
        });
        if (postData) {
            req.write(postData);
        }
        // IMPORTANT
        req.end();
    });
}