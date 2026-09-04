import React from "react";
import { Section, Paragraph, Figure, LibraryList } from "../UI";
import CodeBlock from "../CodeBlock";

const MPU6050_CODE = `#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(115200);

  // Start I2C communication
  Wire.begin(21, 22);
  Serial.println("MPU6050 Test");

  // Initialize MPU6050
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip!");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  // Configure sensor
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);
  delay(1000);
}

void loop() {
  sensors_event_t accel, gyro, temp;

  // Get sensor readings
  mpu.getEvent(&accel, &gyro, &temp);

  Serial.println("--------------------");

  // Accelerometer values
  Serial.println("Accelerometer:");
  Serial.print("X: ");
  Serial.print(accel.acceleration.x);
  Serial.print(" m/s2  ");
  Serial.print("Y: ");
  Serial.print(accel.acceleration.y);
  Serial.print(" m/s2  ");
  Serial.print("Z: ");
  Serial.print(accel.acceleration.z);
  Serial.println(" m/s2");

  // Gyroscope values
  Serial.println("Gyroscope:");
  Serial.print("X: ");
  Serial.print(gyro.gyro.x);
  Serial.print(" rad/s  ");
  Serial.print("Y: ");
  Serial.print(gyro.gyro.y);
  Serial.print(" rad/s  ");
  Serial.print("Z: ");
  Serial.print(gyro.gyro.z);
  Serial.println(" rad/s");

  // Temperature
  Serial.print("Temperature: ");
  Serial.print(temp.temperature);
  Serial.println(" C");

  delay(500);
}`;

export default function GyroDatasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    The MPU6050 is a 6-axis motion sensor that combines a
                    3-axis accelerometer and a 3-axis gyroscope to measure
                    movement, orientation, and rotation. It communicates
                    with microcontrollers such as Arduino and ESP32 using
                    the I²C interface, making it suitable for motion
                    tracking, robotics, drones, gaming controllers, and IoT
                    applications that require accurate motion and position
                    sensing.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/DocImages/mpu6050-sensor-module/mpu6050-circuit.png"
                    alt="MPU6050 wiring diagram"
                    caption="MPU6050 connected to an ESP32/Arduino"
                />
            </Section>

            <Section title="Code">
                <LibraryList
                    title="You will need two libraries:"
                    items={["Adafruit MPU6050", "Adafruit Unified Sensor"]}
                />

                <Paragraph>
                    The code below will read and display both accelerometer
                    and gyroscope values on the serial monitor.
                </Paragraph>
                <CodeBlock language="cpp" code={MPU6050_CODE} />
            </Section>
        </div>
    );
}
