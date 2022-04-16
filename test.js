const TradingView = require('@mathieuc/tradingview');


/*
  This example tests an indicator that sends
  graphic data such as 'lines', 'labels',
  'boxes', 'tables', 'polygons', etc...
*/

const client = new TradingView.Client();

const chart = new client.Session.Chart();
chart.setTimezone('Asia/Bangkok');
chart.setMarket('BINANCE:LUNAUSDT', {
  timeframe: '1D',
  type: 'HeikinAshi',
  range: 365,
});

// TradingView.getIndicator('USER;01efac32df544348810bc843a7515f36').then((indic) => {
// TradingView.getIndicator('PUB;5xi4DbWeuIQrU0Fx6ZKiI2odDvIW9q2j').then((indic) => {
// TradingView.getIndicator('PUB;3lEKXjKWycY5fFZRYYujEy8fxzRRUyF3').then((indic) => {
//   const STD = new chart.Study(indic);

//   STD.onError((...err) => {
//     console.log('Study error:', ...err);
//   });

//   STD.onReady(() => {
//     console.log(`STD '${STD.instance.description}' Loaded !`);
//   });

//   STD.onUpdate(() => {
//     console.log('Graphic data:', STD.graphic);
//     // console.log('Tables:', changes, STD.graphic.tables);
//     // console.log('Cells', STD.graphic.tables[0].cells());
//     client.end();
//   });
// });

// TradingView.searchIndicator('ActionZone').then((rs) => {
//     console.log('Found Indicators:', rs);
//   });

//MCDX
// TradingView.getIndicator('PUB;3lEKXjKWycY5fFZRYYujEy8fxzRRUyF3').then(async (indic) => {
//     console.log(`Loading '${indic.description}' study...`);
//     const SUPERTREND = new chart.Study(indic);

  
//     SUPERTREND.onUpdate(() => {
//       var arr = SUPERTREND.periods
//               var new_arr = arr.map(obj => {
//                   obj['time'] = new Date(obj['$time']*1000).toLocaleDateString()
//                   return obj
//               })
//       console.log('Prices periods:', chart.periods);
//       console.log('Study periods:', new_arr);
//       client.end();
//     });
//   });

//CDC ActionZone
// TradingView.getIndicator('PUB;gmVg1VdQ4wqAo3w7RbMvDHRrMFP5YQR9').then(async (indic) => {
//     console.log(`Loading '${indic.description}' study...`);
//     const SUPERTREND = new chart.Study(indic);

    

    
  
//     SUPERTREND.onUpdate(() => {
//         var arr = SUPERTREND.periods
//         var new_arr = arr.map(obj => {
//             obj['time'] = new Date(obj['$time']*1000).toLocaleDateString()
//             return obj
//         })
//     //   console.log('Prices periods:', chart.periods);
//       console.log('Study periods:', new_arr);
//       client.end();
//     });
//   });

//   TradingView.searchMarket('BINANCE:FTMUSDTPERP').then((rs) => {
//     console.log('Found Markets:', rs);
//   });