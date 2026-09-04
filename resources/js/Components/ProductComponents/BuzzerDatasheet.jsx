import React from "react";
import { Section, Paragraph, Figure } from "../UI";
import CodeBlock from "../CodeBlock";

const BUZZER_CODE = `#include <Arduino.h>

const int buzzerPin = 2;

void setup() {
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  // Turn the buzzer ON
  digitalWrite(buzzerPin, HIGH);
  delay(1000);

  // Turn the buzzer OFF
  digitalWrite(buzzerPin, LOW);
  delay(1000);
}`;

export default function BuzzerDatasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    A buzzer is an electronic sound-producing device that
                    converts electrical energy into audible tones or beeps.
                    It is commonly used to provide alerts, warnings, and
                    user feedback in electronic systems. Buzzers are widely
                    used in alarm systems, doorbells, timers, and
                    microcontroller-based projects such as those using
                    Arduino and ESP32 because they are simple to control and
                    provide an effective audible indication.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/DocImages/buzzer/buzzer-circuit.png"
                    alt="Buzzer wiring diagram"
                    caption="Buzzer connected to an ESP32/Arduino"
                />
            </Section>

            <Section title="Code">
                <Paragraph>
                    The code below plays a tone after every one second.
                </Paragraph>
                <CodeBlock language="cpp" code={BUZZER_CODE} />
            </Section>
        </div>
    );
}
