import React from "react";
import { Section, Paragraph, Figure, Note } from "../UI";
import CodeBlock from "../CodeBlock";

const MQ2_CODE = `#include <Arduino.h>

// MQ-2 Smoke Sensor connected to GPIO 34
const int smokePin = 34;

void setup() {
  Serial.begin(115200);
  Serial.println("MQ-2 Smoke Sensor Test");
}

void loop() {
  // Read smoke level (0 - 4095)
  int smokeLevel = analogRead(smokePin);
  Serial.print("Smoke Level: ");
  Serial.println(smokeLevel);

  // Smoke detection threshold
  if (smokeLevel > 2000) {
    Serial.println("WARNING: Smoke Detected!");
  } else {
    Serial.println("Air Quality: Normal");
  }

  Serial.println("--------------------");
  delay(1000);
}`;

export default function SmokeDetectorDatasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    The MQ-2 Smoke Sensor is a gas detection module designed
                    to detect smoke and various combustible gases such as
                    LPG, methane, and alcohol. It uses a sensitive
                    gas-detecting element whose resistance changes when
                    exposed to gases, allowing a microcontroller such as an
                    Arduino or ESP32 to monitor air quality and detect
                    potential hazards. It is commonly used in smoke alarms,
                    safety systems, and IoT-based environmental monitoring
                    projects.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/DocImages/mq-2-gas-sensor-module/mq2-circuit.png"
                    alt="MQ-2 smoke sensor wiring diagram"
                    caption="MQ-2 connected to an ESP32/Arduino"
                />
            </Section>

            <Section title="Code">
                <Paragraph>
                    The code below reads and displays smoke levels detected
                    by the sensor on the serial monitor.
                </Paragraph>
                <CodeBlock language="cpp" code={MQ2_CODE} />
                <Note>
                    The MQ-2 needs a short warm-up period after power-on
                    before readings stabilize — give it a minute or two
                    before relying on the values for detection logic.
                </Note>
            </Section>
        </div>
    );
}
