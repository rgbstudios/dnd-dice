//todo: sometime bars dont have width
function makeChart() {
//google charts
  google.charts.load('current', {'packages':['corechart','bar']});
  google.charts.setOnLoadCallback(drawChart);

  function drawChart() {
    //bar
    let chartdata = [['','', { role: 'style' } ]];
    for(let i=0; i<odds.length; i++) {
      chartdata.push([i+3, odds[i], '#19194d']);
    }

    for(let i=0; i<6; i++) {
      //hardcoded 20 to display larger as if 20 occurences of stat
      //todo: doesnt work for repeats of same stat
      chartdata.push([characters[characters.length-1].stats[i].value, 20, '#d9d9f2']);
   }




    data = google.visualization.arrayToDataTable(chartdata);

    options = {
      title: 'Odds by number of successes', 
      titleTextStyle:{color: night ? '#66c' : '#19194d'},
      legend: 'none',
      chartArea: {width: '75%', legend:{position: 'none'} },
      hAxis: {
        title: 'Stat Value',
        viewWindow: {
          min: 3
        },
        gridlines: {
          count: 16,
          color: night ? '#66c' : '#19194d'
        },
        textStyle:{color: night ? '#66c' : '#19194d'},
        titleTextStyle:{color: night ? '#66c' : '#19194d'}
      },
      vAxis: {
        title: 'Occurences',
        gridlines: {
          count: 8,
          color: night ? '#66c' : '#19194d'
        },
        textStyle:{color: night ? '#66c' : '#19194d'},
        titleTextStyle:{color: night ? '#66c' : '#19194d'}
      },
      backgroundColor: { fill:'transparent' }
    };
  
    chart = new google.visualization.ColumnChart(document.getElementById('barchart') );
    chart.draw(data, options);
  } //end drawChart


}