//todo: bug: sometime bars dont have width
function makeChart() {
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {

  let graphColor = isNight ? '#ccc' : '#333';

  //bar
  let chartdata = [['','', { role: 'style' } ]];
  for(let i=0; i<odds.length; i++) {
    chartdata.push([i+3, odds[i], '#369']);
  }

 //  for(let i=0; i<6; i++) {
 //    //hardcoded 20 to display larger as if 20 occurences of stat
 //    //todo: doesnt work for repeats of same stat
 //    chartdata.push([characters[characters.length-1].stats[i].value, 20, '#fff']);
 // }

  data = google.visualization.arrayToDataTable(chartdata);

  options = {
    title: '',
    bar: {groupWidth: '60%'},
    titleTextStyle:{color: graphColor},
    legend: 'none',
    chartArea: {width: '60%', legend:{position: 'none'} },
    hAxis: {
      title: 'Stat',
      viewWindow: {
        min: 3
      },
      gridlines: {
        count: 16,
        color: '#ccc'
      },
      textStyle:{color: graphColor},
      titleTextStyle:{color: graphColor}
    },
    vAxis: {
      title: 'Odds of each stat (of 1296)',
      gridlines: {
        count: 8,
        color: '#ccc'
      },
      textStyle:{color: graphColor},
      titleTextStyle:{color: graphColor}
    },
    backgroundColor: { fill:'transparent' }
  };

  //not mobile
  if(!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ) {
    options.width = 800;
    options.height = 500;
  }

  chart = new google.visualization.ColumnChart(document.getElementById('barchart') );
  chart.draw(data, options);





    //my rolls barchart

    options.vAxis.title = 'Frequency';

    chartdata = [['','', { role: 'style' } ]];

    let values = [];
    for(let i=0; i<6; i++)
      values.push(characters[characters.length-1].stats[i].value);
    console.log(values);

   let occurences = new Array(16).fill(0);
   for(let i=0; i<6; i++)
      occurences[ values[i]-3 ]++;

    console.log(occurences);

   for(let i=0; i<16; i++) {
      chartdata.push([i+3, occurences[i], '#369']);
      // chartdata.push([characters[characters.length-1].stats[i].value, 1, graphColor]);
   }

    data = google.visualization.arrayToDataTable(chartdata);



  chart = new google.visualization.ColumnChart(document.getElementById('my-rolls-barchart') );
  chart.draw(data, options);




}