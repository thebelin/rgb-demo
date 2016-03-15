RGB Demo
=====================
[![IMAGE ALT TEXT](http://img.youtube.com/vi/E2Nmnc8KeSM/0.jpg)](http://www.youtube.com/watch?v=E2Nmnc8KeSM "Demonstration of RGB Controller")
____
A project demonstrating how to connect to particle.io using an angular.js system like ionic / cordova.
____

This project allows control of two RGB LED values via cellular networks. There are conversion techniques included for turning a hex color value into a RGB value, and applying that value to an RGB light controller.


It demonstrates the creation of variables, functions and events in the particle.io cloud, then how to connect to them using angular.js in an ionic framework.

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

If you are looking for RGB Hex Conversion tool for arduino, go to the [Arduino Source Code](https://github.com/thebelin/rgb-demo/blob/master/embedded/rgb-demo.ino).


More info on ionic can be found on the Ionic [Getting Started](http://ionicframework.com/getting-started) page and the [Ionic CLI](https://github.com/driftyco/ionic-cli) repo.

