
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

var getIndicData = (indic, setting, chart) => {
    return new Promise((resolve, reject) => {
        console.log(`Loading '${indic.description}' study with setting ${JSON.stringify(setting)}...`);

        try{
            Object.keys(setting).forEach((key) => {
                indic.setOption(key, setting[key])
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
                return resolve({
                    'prices' : periods,
                    'study' : study
                }); 
            });
        } catch(err) {
            console.log('[ERR]', err)
            return reject(err.message);
        }
    });



  }


app.post('/indicator', (req, res) => {

    const config = req.body
    switch(config.indicator) {
        case 'MCDX':
            indicator_id = 'PUB;3lEKXjKWycY5fFZRYYujEy8fxzRRUyF3'
            break;
        case 'ActionZone':
            indicator_id = 'PUB;gmVg1VdQ4wqAo3w7RbMvDHRrMFP5YQR9'
            break;
        default:
            indicator_id = config.indicator
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

    const indicator_promise = TradingView.getIndicator(indicator_id)
    
    indicator_promise.then((indicator)=>{
        const promise =  getIndicData(indicator, config.setting, chart)
        promise.then((val)=> {
            res.status(200).json(val)
            client.end();
        });
    }).catch((err) => {
        res.status(404).send(err)
        client.end();
    })
});

app.post('/indicators', async (req, res) => {
    const config = req.body

    indicators = []
    for (const indic_config of config.indicators) {
        const indic = await TradingView.getIndicator(indic_config.indicator)
        indicators.push([indic, indic_config.setting, indic_config.indicator])
    }

    const client = new TradingView.Client();
    const chart = new client.Session.Chart();
        chart.setTimezone('Asia/Bangkok');
        chart.setMarket(config.market, {
            timeframe: config.timeframe,
            type: config.type,
            range: config.range
        });


    const ret = await Promise.all(indicators.map(x=>{
        indic = x[0]
        setting = x[1]
        return getIndicData(indic, setting, chart)
    }))

    const result = ret.map((x, xi)=>{
        return {
            "indicator": indicators[xi][2],
            "setting": indicators[xi][1],
            "result": x
        }
    })

    res.status(200).json(result)
});

app.listen(9000, () => {
  console.log('Start server at port 9000.')
})