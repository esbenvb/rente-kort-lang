var data;
(function($) {
  $(document).ready(function() {
    var startYear = 1997;
    var startQuarter = 4;
    var thisYear = 2013;
    var thisQuarter = 4;
    var $table = $('#interestdata');
    $('span.year').html(thisYear);
    $('span.quarter').html(thisQuarter);
    //var data;
    $.getJSON('data.json', function(jsondata, status, request) {
      data = jsondata;
      //console.log(data);

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
          
          //console.log([y, w]);
          //console.log(data[y][w].long);
          //console.log(calcFlex(y, q));
          $row = $('<tr></tr>');
          $row.append('<td class="year">' + y + '</td>');
          $row.append('<td class="quarter">Q' + q + '</td>');
          $row.append('<td>' + w + '</td>');
          $row.append('<td>' + data[y][w].short.toPrecision(3) + '%</td>');
          $row.append('<td>' + data[y][w].shortavg.toPrecision(3) + '%</td>');
          $row.append('<td>' + data[y][w].long.toPrecision(3) + '%</td>');
          $row.append('<td class="difference">' + (data[y][w].long - data[y][w].shortavg).toPrecision(3) + '</td>');
          $row.append('<td class="difference-relative">' + ((data[y][w].shortavg/data[y][w].long) * 100).toPrecision(2) + '%</td>');
          //console.log($table.length);
          $table.append($row);
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
      //console.log($table.length);
      $table.append($row);
      
      
      
    });

    function calcFlex(year, quarter) {
      var rates = [];
      var total = 0.0;
      var w = (quarter - 1) * 13 + 1;
      for (var y = year; y <= thisYear && data[y][w] !== undefined; y++) {
        rates.push(data[y][w].short);
        total += data[y][w].short;
      }

      return rates.length ? total/rates.length : 0;
    }
  });
})(jQuery);
