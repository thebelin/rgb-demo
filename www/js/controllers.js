angular.module('app.controllers', [])
  
.controller('controlColorCtrl', ['$scope', '$interval', '$timeout', 'particle', 'safeparse',
  function ($scope, $interval, $timeout, particle, safeparse) {

    $scope.i = {
      colorPicker: '#ff0000',
      current: 'color',
      selectedColor: "#ffffff",
      selectedColor2: "#ffffff"
    };
    var colorTimeout;

    // Send the current color to the particle.io gateway
    $scope.sendColor = function () {
      // Don't send piles of updates to the particle driver
      // Check if they are still dragging around the controller before sending the current setting
      if (colorTimeout) {
        $timeout.cancel(colorTimeout);
        colorTimeout = false;
      }
      // Set the timeout tracker so it can be cancelled if the value changes
      colorTimeout = $timeout(function () {
        particle.callFunction($scope.i.current || 'color', $scope.i.colorPicker.substring(1, 8));
      }, 200);
    };

    $scope.startup = function () {
      // Get the initial colors
      $scope.getColor = (function () {
        // Use particle to get the current color
        particle.variable('currentColor', function (currColor) {
          $scope.i.selectedColor = '#' + currColor;
        });
      }());

      $scope.getColor2 = (function () {
        // Use particle to get the current color
        particle.variable('otherColor', function (currColor) {
          $scope.i.selectedColor2 = '#' + currColor;
        });
      }());

      // subscribe to change events
      particle.event('change-color', function (newState) {
        var data = safeparse.parse(newState.data);
        console.log('change-color particle event: ', data.data);

        // set the selectedColor from the data in the event
        $scope.i.selectedColor = '#' + String(data.data);
      });
      particle.event('change-color2', function (newState) {
        var data = safeparse.parse(newState.data);
        console.log('change-color2 particle event: ', data.data);

        // set the selectedColor2 from the data in the event
        $scope.i.selectedColor2 = '#' + String(data.data);
      });
    };

    // start up if there's authentication data and a device has been selected
    if (particle.setDevice()) {
      $scope.startup();
    } else if (particle.setToken()) {
      // If there's authentication, but no selected device, just get devices
      // only start when the user has selected a device
      //$scope.getDevices();
    }
    
  }]);
 