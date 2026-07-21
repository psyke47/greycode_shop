import React from "react";
import { Section, Paragraph, Figure, LibraryList, Note } from "../UI";
import CodeBlock from "../CodeBlock";

const ULTRASONIC_SENSOR_CODE = `#include <Arduino.h>
// HC-SR04 Pins
const int trigPin = 5;
const int echoPin = 18;

void setup() {
  Serial.begin(115200);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  Serial.println("HC-SR04 Distance Sensor");
}

void loop() {
  // Clear the trigger pin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  // Send a 10 µs pulse
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Read the echo time
  long duration = pulseIn(echoPin, HIGH);

  // Calculate distance in cm
  float distance = duration * 0.0343 / 2.0;

  Serial.print("Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  delay(500);
}`;


export default function UltrasonicSensorDatasheet() {
  return (
    <div className="space-y-8">
      <Section title="Description">
        <Paragraph>
          The HC-SR04 Ultrasonic Sensor is a distance-measuring sensor that uses ultrasonic sound waves to detect the distance between the sensor and an object. It operates by transmitting a high-frequency sound pulse and measuring the time it takes for the echo to return. The sensor provides accurate, non-contact distance measurements, making it ideal for obstacle detection, robotics, parking systems, and automation projects. It is widely used with microcontrollers such as Arduino and ESP32.
        </Paragraph>
      </Section>
      <Section title="Circuit Diagram">
        <Figure
          src="/images/DocImages/ultrasonic-sensor/ultrasonic-code-diagram.png"
          alt="HC-SR04 wiring diagram"
        />
      </Section>
      
    </div>

  )
}
