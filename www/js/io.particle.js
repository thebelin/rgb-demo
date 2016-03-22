angular.module('app.directives', [])

  .directive('ioParticle', ['$interval', '$timeout', 'particle', 'safeparse',

  function ($interval, $timeout, particle, safeparse) {
    // Set this to a string to prepend to debug statements
    var debug = false;

    // Return an object with expected keys for an angular directive
    return {
      template:
      // Template HTML for a login page (uses ionic styles)
        '<ion-list>' +
            '<ion-radio class="item"' +
                'data-ng-repeat="device in p.devices"' +
                'ng-checked="p.deviceId==device.id"' +
                'ng-model="p.deviceId"' +
                'ng-value="device.id"' +
                'ng-change="p.setDevice(device.id)">' +
                '<span data-ng-bind="device.id"></span>' +
                '<span data-ng-bind="device.name"></span>' +
            '</ion-radio>' +
        '</ion-list>' +

        '<form class="list" data-ng-if="!p.token">' +
            '<label class="item item-input">' +
              '<span class="input-label">Particle User</span>' +
              '<input type="text" data-ng-model="p.username">' +
            '</label>' +

            '<label class="item item-input">' +
              '<span class="input-label">Particle Pass</span>' +
              '<input type="password" data-ng-model="p.password">' +
            '</label>' +

            '<button class="button button-full button-positive" data-ng-click="p.authenticate()">' +
              'Log In To Particle' +
            '</button>' +
        '</form>' +

        '<form class="list" data-ng-if="p.token">' +
            '<button class="button button-full button-positive" data-ng-click="p.logout()">' +
              'Log Out of Particle' +
            '</button>' +
        '</form>',

      restrict: 'E',

      controller: function ($scope) {
        if (debug) console.log(debug + 'particle io controller active');
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
              if (debug) console.log(debug + 'got particle.io device list: ', deviceList);
              $scope.p.devices = deviceList.data;
            });
          },

          // Authenticate on the particle.io platform
          authenticate: function () {
            // call authenticate with a device list as a callback
            particle.authenticate($scope.p.username, $scope.p.password, function (authData) {
              if (debug) console.log(debug + 'authenticated: ', authData);
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
              if (debug) console.log(debug + 'setDevice', deviceId);
              $scope.p.deviceId = deviceId;
              particle.setDevice(deviceId);
              $scope.startup();
            }
            return $scope.p.deviceId;
          }
        };

        // start up if there's authentication data and a device has been selected
        if (particle.setDevice()) {
          $scope.startup();
        } else if (particle.setToken()) {
          // If there's authentication, but no selected device, just get devices
          // only start when the user has selected a device
          $scope.p.getDevices();
        }
      }
    };
  }]);
