RGB Demo
=====================
[![IMAGE ALT TEXT](http://img.youtube.com/vi/E2Nmnc8KeSM/0.jpg)](http://www.youtube.com/watch?v=E2Nmnc8KeSM "Demonstration of RGB Controller")
____

[Presentation Slideshow](https://goo.gl/WMpqub)
____

A project demonstrating how to connect to particle.io using an angular.js system like ionic / cordova.

Particle.io is a platform which replaced Spark Core, allowing anyone who can interact with an API to build connected devices. A REST API, managed by Particle.io, handles the sharing and broadcast of data directly from the devices. Creation and connection is simultaneous on this platform, even allowing the developer to flash the programmer on the Particle Electron "over the air" on the 3G connection.

Particle.io recommends that users build their own web and mobile apps for operation of their platform. Ionic.io has created an app creation system which allows people who are familiar with the CLI (Command Line Interface) to build apps using the angular.js framework. Using the ionic system, it's possible to build and publish an app for both android and IOS quite quickly.

This framework pairing with Particle.io and Ionic.io represents a perfect opportunity for web developers to build IoT devices, using their existing knowledge and capability.

This demo includes a service which I wrote for Particle devices which handles the API communication with an angular.js app. The service handles connection creation, function calls, variable getting, and server sent events created by the device and subscribed to by the app.
____
Specifications of the app:
* Use ionic.io to build in android or in iOS
* Allow the user to log into particle.io and select a device to control
* Present an interface allowing the user to change the color of each set of lights
* If another user changes the color of the lights, it should update any connected user
____

This project allows control of two RGB LED values via cellular networks. There are conversion techniques included for turning a hex color value into a RGB value, and applying that value to an RGB light controller.


It demonstrates the creation of variables, functions and events in the particle.io cloud, then how to connect to them using angular.js in an ionic framework.
____

Install Particle-cli, cordova, ionic globally (may require sudo):
```bash
npm i -g particle-cli cordova ionic
```

Compile particle code:
```bash
particle build electron embedded/rgb-demo.ino
```

Flash a local particle device with compiled code:
```bash
particle flash electron --serial embedded/electron_firmware_xxxx.bin
```

Check Login for particle.io
```bash
particle login
```

Start local server with ionic app (for debugging the app)
```bash
ionic serve
```

Add Android platform
```bash
ionic platform add android
```

Build and Run Android platform
```bash
ionic run android
```

If you are looking for the particle.io angular service for authentication, variables, functions and events, it's in the [js source code](https://github.com/thebelin/rgb-demo/blob/master/www/js/services.js).

If you are looking for RGB Hex Conversion tool for arduino, go to the [Arduino Source Code](https://github.com/thebelin/rgb-demo/blob/master/embedded/rgb-demo.ino).


More info on ionic can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page and the [Ionic CLI](https://github.com/driftyco/ionic-cli) repo.

