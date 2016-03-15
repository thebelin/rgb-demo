angular.module('app.services', [])

.service('safeparse', function () {
  // A safe parse routine
  this.parse = function (toParse) {
    try {
      return JSON.parse(toParse);
    } catch (e) {
      console.log('unable to parse: ', toParse);
      return toParse;
    }
  };
})

/**
 * A service for operating localStorage as a service in angular.js
 */
.service('localstorage', function() {
  // Set this to false to suppress console messages
  var debug = "localstorage service ";
  // Store this data
  this.setItem = function (key, data) {
    if (debug) console.log(debug + 'setItem %s', key, data);
    return window.localStorage.setItem(key, JSON.stringify(data));
  };

  this.getItem = function (key) {
    var ret = JSON.parse(window.localStorage.getItem(key));
    if (debug) console.log(debug + 'getItem %s', key, ret);
    return ret;
  };

  this.removeItem = function (key) {
    if (debug) console.log(debug + 'removeItem %s', key);
    return window.localStorage.removeItem(key);
  };

})

/**
 * page controller for operating the particle.io board
 */
.service('particle', ['$http', 'localstorage',
  function ($http, localstorage) {

    // me var for this scope in children
    var me = this,

    // The root url of the particle API
      root_url = 'https://api.particle.io/v1/',

    // Set the identification values of the particle interface by first authenticating
    // and then getting a device list, then choosing one of the devices
      device_id = localstorage.getItem('device_id'),
      access_token = localstorage.getItem('access_token');

    // Authenticate with Particle.io and retrieve an auth_token
    this.authenticate = function (username, password, callback) {
      $http({
          method: 'POST',
          url: 'https://api.particle.io/oauth/token',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic cGFydGljbGU6cGFydGljbGU=' // particle:particle
          },
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data: {grant_type:'password', username: username, password: password}
      }).success(function (accessData) {
        // The accessData should be an object with an access token
        me.setToken(accessData.access_token);

        // Do the callback on successful authentication, if provided
        if (typeof callback === 'function') {
          callback(accessData);
        }
      });
    };

    this.logout = function () {
      me.setToken(-1);
      me.setDevice(-1);
    };

    this.getDevices = function (callback) {
      $http.get(root_url + 'devices?access_token=' + access_token)
        .then(function (data) {
          // success
          if (typeof callback === 'function') {
            console.log('particle getDevices: ', data);
            callback(data);
          }
        }, function (data) {
          //Fail
        });
    };

    // provide the ability to set the current device_id var
    this.setDevice = function (deviceId) {
      if (deviceId) {
        if (deviceId === -1) deviceId = '';
        console.log('setDevice', deviceId);
        device_id = deviceId;

        // Also store in localstorage
        localstorage.setItem('device_id', device_id);
      }
      return device_id;
    };

    this.setToken = function (newToken) {
      if (newToken) {
        if (newToken === -1) newToken = '';
        console.log('set Token: ', newToken);
        access_token = newToken;

        // Also store the access token retrieved
        localstorage.setItem('access_token', access_token);
      }
      return access_token;
    };

    // Send a particle function call to the particle.io cloud
    this.callFunction = function (commandType, command, callback) {
      $http.post(
        root_url + 'devices/' + device_id + '/' + commandType + '?access_token=' + access_token,
        {args: command}
      ).then(function (data) {
        // particle call success
        console.log('particle %s %s return success', commandType, command, data);
        if (typeof callback === 'function') {
          callback(data);
        }
      }, function () {
        console.log('fail on call data');
      });
    };

    // Get a particle variable from the particle.io cloud
    this.variable = function (varName, callback) {
      $http.get(root_url + 'devices/' + device_id + '/' + varName + '?access_token=' + access_token)
        .then(function (data) {
          // success
          if (typeof callback === 'function') {
            console.log('particle variable call', varName, data.data.result);
            callback(data.data.result);
          }
        }, function (data) {
          //Fail
        });
    };

    // Subscribe to a server sent event from the particle.io cloud for this device
    this.event = function (eventName, callback) {
      // Track if the callback has been run
      var callbackTracker = false,

      // SSE error handler
        errorHandler = function (err) {
          console.log('SSE ERROR', err);
        },

      // This is the SSE data source 
      // format: /v1/devices/:deviceId/events/:eventPrefix
        source = new EventSource(
          root_url + 'devices/' + device_id + '/events/' + eventName + '?access_token=' + access_token
        );

      // Use the EventListener to bind the SSE message service to the callback Handler
      if (typeof callback === 'function') {
        source.addEventListener(eventName, callback, false);
      }

      // also bind the error event
      source.addEventListener('error', errorHandler, false);
    };
  }]);
