import React from "react";
import { Section, Paragraph, Figure } from "../UI";
import CodeBlock from "../CodeBlock";


const POTENTIOMETER_CODE = `#include <Arduino.h>

const int potPin = 34;

void setup() {
  Serial.begin(115200);
}

void loop() {
  // Read the analog value (0 - 4095)
  int potValue = analogRead(potPin);

  // Display the value
  Serial.print("Potentiometer Value: ");
  Serial.println(potValue);
  delay(100);
}`;

export default function PotentiometerDatasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    A potentiometer is a variable resistor used to adjust and
                    measure voltage levels in electronic circuits. By
                    rotating its shaft or sliding its control, the resistance
                    changes, allowing precise control of parameters such as
                    volume, brightness, motor speed, and sensor input.
                    Potentiometers are widely used in electronic devices and
                    microcontroller projects, including Arduino and ESP32
                    applications.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/DocImages/potentiometer/potentiometer-circuit.png"
                    alt="Potentiometer wiring diagram"
                    caption="Potentiometer connected to an ESP32/Arduino"
                />
            </Section>

            <Section title="Code">
                <Paragraph>
                    Below is a code example on how to display the resistance
                    values while turning the knob on a potentiometer:
                </Paragraph>
                <CodeBlock language="cpp" code={POTENTIOMETER_CODE} />

                <Paragraph>
                    Your serial monitor should look like this when you turn
                    the knob to vary the resistance:
                </Paragraph>
                <Figure
                    src="/images/DocImages/potentiometer/potentiometer-output-1.png"
                    alt="Serial monitor output, low resistance"
                />
                <Figure
                    src="/images/DocImages/potentiometer/potentiometer-output-2.png"
                    alt="Serial monitor output, high resistance"
                />
            </Section>
        </div>
    );
}
