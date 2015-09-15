(function($) {
  $(document).ready(function() {
    var startYear = 1997;
    var startQuarter = 4;
    var thisYear = 2015;
    var thisQuarter = 3;
    var chartData = {
      'categories': [],
      'series': [{
          'name': 'Lang',
          'data': [],
        },{
          'name': 'Kort gennemsnit',
          'data': [],
        }, {
          'name': 'Kort',
          'data': [],
        }
      ]
    };

    var $table = $('#interestdata');
    $('span.year').html(thisYear);
    $('span.quarter').html(thisQuarter);
    var data;
    $.getJSON('data.json', function(jsondata, status, request) {
      data = jsondata;
      var quarters = 0;
      var longSum = 0;
      var shortSum = 0;
      
      for (var y = startYear; data[y] !== undefined; y++) {
        for (var q = (y !== startYear) ? 1 : startQuarter; data[y][(q - 1) * 13 + 1] !== undefined && q < 5; q++) {
          var w = (q - 1) * 13 + 1;

          data[y][w].shortavg = calcFlex(y, q);

          quarters++;
          longSum += data[y][w].long;
          shortSum += data[y][w].short;
          $row = $('<tr></tr>');
          $row.append('<td class="year">' + y + '</td>');
          $row.append('<td class="quarter">Q' + q + '</td>');
          $row.append('<td>' + w + '</td>');
          $row.append('<td>' + data[y][w].short.toPrecision(3) + '%</td>');
          $row.append('<td>' + data[y][w].shortavg.toPrecision(3) + '%</td>');
          $row.append('<td>' + data[y][w].long.toPrecision(3) + '%</td>');
          $row.append('<td class="difference">' + (data[y][w].long - data[y][w].shortavg).toPrecision(3) + '</td>');
          $row.append('<td class="difference-relative">' + ((data[y][w].shortavg/data[y][w].long) * 100).toPrecision(2) + '%</td>');
          $table.append($row);
          chartData.categories.push(y + ' Q' + q);
          chartData.series[0].data.push(data[y][w].long);
          chartData.series[1].data.push(data[y][w].shortavg);
          chartData.series[2].data.push(data[y][w].short);
          
        }
      }
      
      $row = $('<tr class="average"></tr>');
      $row.append('<td>Gennemsnit</td>');
      $row.append('<td></td>');
      $row.append('<td></td>');
      $row.append('<td>' + (shortSum/quarters).toPrecision(3) + '%</td>');
      $row.append('<td></td>');
      $row.append('<td>' + (longSum/quarters).toPrecision(3) + '%</td>');
      $row.append('<td class="difference">' + ((longSum/quarters) - (shortSum/quarters)).toPrecision(3) + '</td>');
      $row.append('<td class="difference-relative">' + (((shortSum/quarters)/(longSum/quarters)) * 100).toPrecision(2) + '%</td>');
      $table.append($row);

      $('#container').highcharts({
              title: {
                  text: 'Renteudgift ved realkreditlån frem til i dag.',
                  x: -20 //center
              },
              subtitle: {
                  text: 'Kilde: realkreditraadet.dk',
                  x: -20
              },
              xAxis: {
                  categories: chartData.categories
              },
              yAxis: {
                  title: {
                      text: 'Rente %'
                  },
                  plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                  }]
              },
              tooltip: {
                  valueSuffix: '%'
              },
              legend: {
                  layout: 'vertical',
                  align: 'right',
                  verticalAlign: 'middle',
                  borderWidth: 0
              },
              series: chartData.series
          });
    });

    function calcFlex(year, quarter) {
      var rates = [];
      var total = 0.0;
      var w = (quarter - 1) * 13 + 1;
      for (var y = year; y <= thisYear && data[y][w] !== undefined; y++) {
        rates.push(data[y][w].short);
        total += data[y][w].short;
      }

      //console.log(year, quarter,rates.length, total,  total/rates.length, rates );
      return rates.length ? total/rates.length : 0;
    }
  });
})(jQuery);
