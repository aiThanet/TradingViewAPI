
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
    console.log(req.body)
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

            try{
                Object.keys(config.setting).forEach((key) => {
                    console.log('Key : ' + key + ', Value : ' + config.setting[key])
                    indic.setOption(key, config.setting[key])
                });
                
                const trend = new chart.Study(indic);
                trend.onUpdate(() => {
                    const study = trend.periods.map(obj => {
                        if (String(obj['$time']).includes(':')){
                            obj['time'] = moment(obj['$time']).unix();
                        } else {
                            obj['time'] = obj['$time'];
                            obj['$time'] = moment.unix(obj['time']).format('YYYY-MM-DD HH:mm:ss');
                        }
                        return obj
                    })
                    const periods = chart.periods.map(obj => {
                        obj['$time'] = moment.unix(obj['time']).format('YYYY-MM-DD HH:mm:ss');
                        return obj
                    })
                    client.end();
                    return resolve({
                        'prices' : periods,
                        'study' : study
                    }); 
                });
            } catch(err) {
                console.log('[ERR]', err)
                return reject(err.message);
            }
        })
    });


    promise.then((val)=>{
        res.status(200).json(val)
    }).catch((err) => {
        res.status(404).send(err)
      });
});

app.listen(9000, () => {
  console.log('Start server at port 9000.')
})