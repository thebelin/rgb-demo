angular.module('app.controllers', [])
  
.controller('controlColorCtrl', ['$scope', '$interval', '$timeout', 'particle', 'safeparse',
  function ($scope, $interval, $timeout, particle, safeparse) {

    // Particle device model for access on $scope
    $scope.p = {
      username: '',
      password: '',
      currentDevice: '',
      deviceId: particle.setDevice(),
      token: particle.setToken(),
      devices: [],
      
      // Make a list of available devices
      getDevices: function () {
        particle.getDevices(function (deviceList) {
          console.log('got particle.io device list: ', deviceList);
          $scope.p.devices = deviceList.data;
        });
      },

      // Authenticate on the particle.io platform
      authenticate: function () {
        // call authenticate with a device list as a callback
        particle.authenticate($scope.p.username, $scope.p.password, function (authData) {
          console.log('authenticated: ', authData);
          // Set the local auth token
          $scope.p.token = authData.access_token || '';

          // List available devices
          $scope.p.getDevices();

        });
      },

      // terminate session and blank the token
      logout: function () {
        $scope.p.username = '';
        $scope.p.password = '';
        $scope.p.token = '';
        $scope.p.devices = [];
        particle.logout();
      },

      // Expose the particle setToken method
      setToken: particle.setToken,

      // Select the current device for particle platform
      setDevice: function (deviceId) {
        if (deviceId) {
          console.log('setDevice', deviceId);
          $scope.p.deviceId = deviceId;
          particle.setDevice(deviceId);
          $scope.startup();
        }
        return $scope.p.deviceId;
      }
    };

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
      // Get the device list
      $scope.p.getDevices();

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
      $scope.p.getDevices();
    }
    
  }]);
 