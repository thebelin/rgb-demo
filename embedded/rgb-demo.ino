/**
 * A particle.io program for controlling an RGB light
 *
 * Use Hex color values as in html to specify the color
 *
 * built for a demonstration for javascript tutorial at Javascript Meetup
 * 
 * @author Belin Fieldson <thebelin@gmail.com>
 *
 * Circuit Layout For Particle Electron
 * D0: 2K resistor (R1) to Red LED1, Base on T1 (pin1)
 * D1: 2K resistor (R2) to Green LED2, Base on T2 (pin1)
 * D2: 2K resistor (R3) to Blue LED3, Base on T3 (pin1)
 * B0: 2K resistor (R1) to Red LED4, Base on T4 (pin1)
 * B1: 2K resistor (R2) to Green LED5, Base on T5 (pin1)
 * B2: 2K resistor (R3) to Blue LED6, Base on T6 (pin1)
 *
 * RGB 12V: 12V
 * RGB R: T1 Collector (pin2)
 * RGB G: T2 Collector (pin2)
 * RGB B: T3 Collector (pin2)
 * 
 * RGB2 12V: 12V
 * RGB2 R: T4 Collector (pin2)
 * RGB2 G: T5 Collector (pin2)
 * RGB2 B: T6 Collector (pin2)
 * 
 * T1: Emmitter (pin3) to GND
 * T2: Emmitter (pin3) to GND
 * T3: Emmitter (pin3) to GND
 * T4: Emmitter (pin3) to GND
 * T5: Emmitter (pin3) to GND
 * T6: Emmitter (pin3) to GND
 *
 * LED1: (R) + to R1, - GND
 * LED2: (G) + to R2, - GND
 * LED3: (B) + to R3, - GND
 * LED4: (R) + to R4, - GND
 * LED5: (G) + to R5, - GND
 * LED6: (B) + to R6, - GND
 */
#include <stdio.h> // NULL
#include <stdlib.h> // strtoll


/**
 * The pins to be used by the program
 */
// RGB LED Bank 1
int redPin = D0;
int greenPin = D1;
int bluePin = D2;

//RGB LED Bank 2
int redPin2 = B0;
int greenPin2 = B1;
int bluePin2 = B2;

//RGB LED Bank 3 (not in circuit explanation)
int redPin3 = D3;
int greenPin3 = B3;
int bluePin3 = A4;

/**
 * The current colors, update when the color function is called
 */
// Set to black (off) to start
String currColor = "000000";

// Set to black (off) to start
String currColor2 = "000000";

// Set to black (off) to start
String currColor3 = "000000";

// These are helper functions for transforming the RGB Hex to RGB(int)
#define RED(a) (a>>16)
#define GREEN(a) ((a>>8) & 0xff)
#define BLUE(a) (a & 0xff)

// This runs first and once
void setup ()
{
  // Configure the RGB pins as outputs
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  pinMode(redPin2, OUTPUT);
  pinMode(greenPin2, OUTPUT);
  pinMode(bluePin2, OUTPUT);

  // A Particle.io function to set the color
  Particle.function("color", setColor);

  // A Particle.io function to set the color2
  Particle.function("color2", setColor2);

  // A Particle.io function to set the color3
  Particle.function("color3", setColor3);

  // A Particle.io function to set all the color
  Particle.function("allcolor", allColor);

  // A Particle.io variable to get the current color
  Particle.variable("currentColor", currColor);

  // A Particle.io variable to get the current color2
  Particle.variable("otherColor", currColor2);

  // A Particle.io variable to get the current color3
  Particle.variable("anotherColor", currColor3);

  // Set the default color
  setColor(currColor);
  setColor2(currColor2);
}

// There's nothing to do on updates, but this is required anyway
void update ()
{}

// This publishes the events on Particle.io
void publish (String event, String data)
{
  bool success;
  success = Particle.publish(event, data);
}

// Converts hex string into a long which can be used to get RGB values
long hexToLong (char *hexChars)
{
  return strtol(hexChars, NULL, 16);
}

// Sends color information to the pins specified
void sendColorToPins (int rPin, int gPin, int bPin, long color)
{
  // write the values
  analogWrite (rPin, RED(color));
  analogWrite (gPin, GREEN(color));
  analogWrite (bPin, BLUE(color));
}

// Converts a string command into a long color which can be made into RGB values
long commandToColor (String command)
{
  // the command should be 6 characters to be a set
  if (command.length() != 6) {
    return -1;
  }

  // Record the color which was set (for the getter)
  currColor = command;

  // convert into R, G and B additive values between 0 and 255, write them to pins
  // make a char with the String contents
  char colorArr[8];
  currColor.toCharArray(colorArr, 8);

  // convert that char to a number and return it
  return hexToLong(colorArr);
}

// Set the color according to RGB values sent
int setColor (String command)
{
  // Get the RGB hex value as a long
  long number = commandToColor(command);

  // If the color isn't a -1, then use it to set the current Color
  if (number != -1) {
    // Record the color which was set (for the getter)
    currColor = command;

    // write the values
    sendColorToPins(redPin, greenPin, bluePin, number);

    // publish the event
    publish("change-color", currColor);

    // Indicate completion
    return 1;
  }
  // Indicate Error if it got this far
  return -1;
}

// Set the color according to RGB values sent
int setColor2 (String command)
{
  // Get the RGB hex value as a long
  long number = commandToColor(command);

  // If the color isn't a -1, then use it to set the current Color
  if (number != -1) {
    // Record the color which was set (for the getter)
    currColor2 = command;

    // write the values
    sendColorToPins(redPin2, greenPin2, bluePin2, number);

    // publish the event
    publish("change-color2", currColor2);

    // Indicate completion
    return 1;
  }
  // Indicate Error if it got this far
  return -1;
}

// Set the color according to RGB values sent
int setColor3 (String command)
{
  // Get the RGB hex value as a long
  long number = commandToColor(command);

  // If the color isn't a -1, then use it to set the current Color
  if (number != -1) {
    // Record the color which was set (for the getter)
    currColor3 = command;

    // write the values
    sendColorToPins(redPin3, greenPin3, bluePin3, number);

    // publish the event
    publish("change-color3", currColor3);

    // Indicate completion
    return 1;
  }
  // Indicate Error if it got this far
  return -1;
}

// Set all colors
int allColor (String command)
{
  // Get the RGB hex value as a long
  long number = commandToColor(command);

  // If the color isn't a -1, then use it to set the current Color
  if (number != -1) {
    // Record the color which was set (for the getter)
    currColor = command;
    currColor2 = command;
    currColor3 = command;

    // write the values
    sendColorToPins(redPin, greenPin, bluePin, number);
    sendColorToPins(redPin2, greenPin2, bluePin2, number);
    sendColorToPins(redPin3, greenPin3, bluePin3, number);

    // publish the event
    publish("change-color", currColor);
    publish("change-color2", currColor2);
    publish("change-color3", currColor3);

    // Indicate completion
    return 1;
  }
  // Indicate Error if it got this far
  return -1;
}
