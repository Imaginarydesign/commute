console.log('\'Allo \'Allo!');

$(function(){

  // Selects
  $('select').select2({
    // dropdownCssClass: 'dropdown-inverse',
  });

  // Inputs form
  $('#form-inputs').submit(function( event ) {
    var fromInput = $('#input-from').val();
    var toInput = $('#input-to').val();
    var timesInput = $('#input-times').val();
    calcRoute(fromInput, toInput, timesInput);
    event.preventDefault();
  });

  // Google calc
  var directionDisplay;
  var directionsService = new google.maps.DirectionsService();
  var map;

  directionsDisplay = new google.maps.DirectionsRenderer();

  function calcRoute(fromInput, toInput, timesInput) {
    var request = {
      origin: fromInput,
      destination: toInput,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        $('.results').show();
        directionsDisplay.setDirections(response);
        var distance = response.routes[0].legs[0].distance.value;
        // convert distance to miles and double it (there and back)
        var distanceMiles = (distance * 0.00062137) * 2;
        var totalMiles = Math.round(distanceMiles * timesInput);
        var durationMinutes = (response.routes[0].legs[0].duration.value / 60) * 2;
        var durationHours = durationMinutes / 60;
        var totalDuration = Math.round(durationHours * timesInput);
        $('.distance').text(totalMiles + ' miles');
        $('.time').text(totalDuration + ' hours');
        calcCost(distanceMiles, timesInput, totalDuration, totalMiles);
      }
    });
  }

  function calcCost (distanceMiles, timesInput, totalDuration, totalMiles) {
    var GALLON_LITRES_RATE = 4.54;
    var mpg = 35;
    var fuelPrice = 110;
    var gallons = distanceMiles / mpg;
    var litres = gallons * GALLON_LITRES_RATE;
    var penceTotal = litres * fuelPrice;
    var poundTotal = penceTotal / 100;

    $('.cost').text('£' + (poundTotal * timesInput).toFixed(2));

    if ($('#input-period').val() == 'Weekly') {
        $('.cost').text('£' + (poundTotal * timesInput).toFixed(2));
        $('.time').text(totalDuration + ' hours');
        $('.distance').text(totalMiles + ' miles');
      } else if ($('#input-period').val() == 'Monthly') {
        $('.cost').text('£' + ((poundTotal * timesInput) * 4).toFixed(2));
        $('.time').text((totalDuration * 4) + ' hours');
        $('.distance').text((totalMiles * 4) + ' miles');
      } else if ($('#input-period').val() == 'Annualy') {
        $('.cost').text('£' + ((poundTotal * timesInput) * 52).toFixed(2));
        $('.time').text((totalDuration * 52) + ' hours');
        $('.distance').text((totalMiles * 52) + ' miles');
      }

    $('#input-period').on('change', function() {
      if ($(this).val() == 'Weekly') {
        $('.cost').text('£' + (poundTotal * timesInput).toFixed(2));
        $('.time').text(totalDuration + ' hours');
        $('.distance').text(totalMiles + ' miles');
        $('.period').text('Weekly');
      } else if ($(this).val() == 'Monthly') {
        $('.cost').text('£' + ((poundTotal * timesInput) * 4).toFixed(2));
        $('.time').text((totalDuration * 4) + ' hours');
        $('.distance').text((totalMiles * 4) + ' miles');
        $('.period').text('Monthly');
      } else if ($(this).val() == 'Annualy') {
        $('.cost').text('£' + ((poundTotal * timesInput) * 52).toFixed(2));
        $('.time').text((totalDuration * 52) + ' hours');
        $('.distance').text((totalMiles * 52) + ' miles');
        $('.period').text('Annualy');
      }
    });

  }
  

  // Average mpg in UK is 37 - http://www.fuel-economy.co.uk/stats.html
  // Average fuel cost is £1.10

  // var GALLON_LITRES_RATE = 4.54;

  // gallons = distance / mpg
  // litres = gallons * GALLON_LITRES_RATE
  // pence total = litres * 110
  // pound total = pence total / 100

  // Example

  // Distance = 71 miles
  // gallons required = 2.02 (71 / 35) 
  // litres required = 9.17 (2.02 * 4.54)
  // pence total = 1008 (9.17 * 110)
  // pound total = 10.08 (1008 / 100)

  // cost of driving = distance / mpg x (4.54 x 1.10)


});

