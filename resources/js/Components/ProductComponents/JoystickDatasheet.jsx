import React from "react";
import { Section, Paragraph, Figure } from "../UI";
import CodeBlock from "../CodeBlock";

const JOYSTICK_CODE = `#include <Arduino.h>

#define VRx 32
#define VRy 36

void setup() {
  Serial.begin(115200);
  pinMode(VRx, INPUT);
  pinMode(VRy, INPUT);
  delay(1000);
  Serial.println("Joystick test started...");
}

void loop() {
  int xValue = analogRead(VRx);
  int yValue = analogRead(VRy);

  Serial.print("VRx: ");
  Serial.print(xValue);
  Serial.print(" | VRy: ");
  Serial.println(yValue);

  delay(200); // adjust for smoother/faster updates
}`;

export default function JoystickDatasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    The Joystick Module is an input device that combines two
                    potentiometers and a push-button switch to detect
                    movement along the X and Y axes as well as button
                    presses. It provides analog outputs for directional
                    control and a digital output for the button, making it
                    ideal for controlling robots, games, menus, and other
                    interactive Arduino and ESP32 projects. Its simple design
                    and ease of use make it a popular choice for embedded
                    systems and IoT applications.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/DocImages/ky-023-ps2-game-joystickmodule/joystick-circuit.png"
                    alt="Joystick wiring diagram"
                    caption="Joystick module connected to an ESP32/Arduino"
                />
            </Section>

            <Section title="Code">
                <Paragraph>
                    The code below is a joystick test sketch that reads only
                    the joystick values and prints them on the serial
                    monitor. We won't be connecting SW, because it is a
                    switch and won't be necessary for this sketch code.
                </Paragraph>
                <CodeBlock language="cpp" code={JOYSTICK_CODE} />
            </Section>
        </div>
    );
}
