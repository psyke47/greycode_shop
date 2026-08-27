import React from "react";
import { Section, Paragraph, Figure } from "../UI";
import CodeBlock from "../CodeBlock";

const LDR_CODE = `#include <Arduino.h>

// LDR connected to GPIO 34
const int ldrPin = 34;

void setup() {
  Serial.begin(115200);
}

void loop() {
  // Read the analog value (0-4095)
  int ldrValue = analogRead(ldrPin);
  Serial.print("Brightness Value: ");
  Serial.println(ldrValue);
  delay(200);
}`;

export default function LdrDatasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    An LDR (Light Dependent Resistor) is a light-sensitive
                    sensor whose resistance changes according to the
                    intensity of light falling on its surface. As light
                    intensity increases, its resistance decreases, allowing
                    it to detect changes in ambient lighting. LDRs are
                    commonly used in automatic lighting systems, light
                    meters, security devices, and smart home applications.
                    They are widely used with microcontrollers such as
                    Arduino and ESP32 for light-sensing and automation
                    projects.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/docs/ldr-photoresistor/ldr-circuit.png"
                    alt="LDR wiring diagram"
                    caption="LDR connected to an ESP32/Arduino"
                />
            </Section>

            <Section title="Code">
                <CodeBlock language="cpp" code={LDR_CODE} />
            </Section>
        </div>
    );
}
