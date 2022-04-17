# TradingView API
[baseCode](https://github.com/Mathieu2301/TradingView-API)


## How to run
1. clone this repo
2. install nodejs
3. `npm install`
4. `node ./server.js`


## API
`POST /indicator`
```json
{
    "market":"BINANCE:LUNAUSDT",
    "timeframe": "1D",
    "type": "HeikinAshi",
    "range": 5,
    "indicator" : "STD;EMA",
    "setting": {
        "Length":30
    }
}
`POST /indicators`
```json
{
  "market": "BINANCE:LUNAUSDT",
  "timeframe": "1D",
  "type": "HeikinAshi",
  "range": 2,
  "indicators": [
    {
      "indicator": "STD;EMA",
      "setting": {
        "Length": 26
      }
    },
    {
      "indicator": "STD;EMA",
      "setting": {
        "Length": 18
      }
    },
    {
      "indicator": "STD;EMA",
      "setting": {
        "Length": 30
      }
    },
    {
      "indicator": "STD;EMA",
      "setting": {
        "Length": 50
      }
    }
  ]
}
```
`POST /search/indicator`
```json
{
    "key":"EMA"
}
```

`POST /search/market`
```json
{
    "key":"BINANCE:",
    "filter": "crypto"
}
```
