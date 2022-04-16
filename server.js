
const express = require('express')
const moment = require('moment')
const bodyParser = require('body-parser')
const TradingView = require('@mathieuc/tradingview');

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.post('/search/indicator', (req, res) => {
    const promise = new Promise((resolve, reject) => {
        TradingView.searchIndicator(req.body.key).then((rs) => {
            resolve(rs);
        });
    });

    promise.then((val)=>{
        res.status(200).json(val)
    })
})

app.post('/search/market', (req, res) => {
    const promise = new Promise((resolve, reject) => {
        TradingView.searchMarket(req.body.key, req.body.filter).then((rs) => {
            resolve(rs);
        });
    });

    promise.then((val)=>{
        res.status(200).json(val)
    })
})



app.post('/indicator', (req, res) => {

    const config = req.body
    switch(config.indicator) {
        case 'MCDX':
            indicator = 'PUB;3lEKXjKWycY5fFZRYYujEy8fxzRRUyF3'
            break;
        case 'ActionZone':
            indicator = 'PUB;gmVg1VdQ4wqAo3w7RbMvDHRrMFP5YQR9'
            break;
        default:
            indicator = config.indicator
            break;
    }

    const client = new TradingView.Client();
    const chart = new client.Session.Chart();
    chart.setTimezone('Asia/Bangkok');
    chart.setMarket(config.market, {
        timeframe: config.timeframe,
        type: config.type,
        range: config.range
    });

    const promise = new Promise((resolve, reject) => {
        TradingView.getIndicator(indicator).then(async (indic) => {
            console.log(`Loading '${indic.description}' study with setting ${JSON.stringify(config.setting)}...`);
            // indic.setOption('length', 18)

            Object.keys(config.setting).forEach((key) => {
                console.log('Key : ' + key + ', Value : ' + config.setting[key])
                indic.setOption(key, config.setting[key])
                // indic.setOption('Length', 18)

            })

            const trend = new chart.Study(indic);
            trend.onUpdate(() => {
                const res = trend.periods.map(obj => {
                    obj['time'] = moment.unix(obj['$time']).format('YYYY-MM-DD HH:mm:ss');
                    return obj
                })
                // console.log('Prices periods:', chart.periods);
                // console.log('Study periods:', res);
                client.end();
                resolve({
                    'prices' : chart.periods,
                    'study' : res
                }); 
            });
        });
    });
    promise.then((val)=>{
        res.status(200).json(val)
    })
});

app.listen(9000, () => {
  console.log('Start server at port 9000.')
})