//todo: bug: sometime bars dont have width
function makeChart() {
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {

  let graphColor = isNight ? '#999' : '#333';

  //bar
  let chartdata = [['','', { role: 'style' } ]];
  for(let i=0; i<odds.length; i++) {
    chartdata.push([i+3, odds[i], graphColor]);
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
        color: graphColor
      },
      textStyle:{color: graphColor},
      titleTextStyle:{color: graphColor}
    },
    vAxis: {
      title: 'Odds of each stat (of 1296)',
      gridlines: {
        count: 8,
        color: graphColor
      },
      textStyle:{color: graphColor},
      titleTextStyle:{color: graphColor}
    },
    backgroundColor: { fill:'transparent' }
  };

  chart = new google.visualization.ColumnChart(document.getElementById('barchart') );
  chart.draw(data, options);
}