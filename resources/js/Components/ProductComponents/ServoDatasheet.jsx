import React from "react";
import { Section, Paragraph, Figure } from "../UI";
import CodeBlock from "../CodeBlock";

const SERVO_CODE = `#include <ESP32Servo.h>

Servo myServo;
const int servoPin = 13;

void setup() {
  Serial.begin(115200);
  myServo.attach(servoPin);
  Serial.println("Servo Open/Close Demo");
}

void loop() {
  // Open
  Serial.println("OPEN");
  myServo.write(180); // Change this angle if needed
  delay(2000);

  // Close
  Serial.println("CLOSE");
  myServo.write(0);   // Change this angle if needed
  delay(2000);
}`;

/**
 * Generic servo motor datasheet - shared across all servo products
 * (MG90S, SG90, MG995) since the wiring and control code are the same.
 */
export default function ServoDatasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    A servo motor is a compact rotary actuator designed to
                    provide precise control of angular position. It uses a
                    feedback system to accurately move to and hold a specific
                    angle based on a control signal, typically a PWM signal
                    from a microcontroller like an Arduino or ESP32. Servo
                    motors are widely used in robotics, automation systems,
                    RC vehicles, and mechanical projects where controlled
                    movement is required, such as robotic arms, steering
                    systems, and camera positioning.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/docs/servo/servo-circuit.png"
                    alt="Servo motor wiring diagram"
                    caption="Servo motor connected to an ESP32/Arduino"
                />
            </Section>

            <Section title="Code">
                <Paragraph>
                    The code below is to just move the servo arm and back.
                </Paragraph>
                <CodeBlock language="cpp" code={SERVO_CODE} />
            </Section>
        </div>
    );
}
