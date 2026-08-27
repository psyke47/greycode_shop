import React from "react";
import { Section, Paragraph, Figure, LibraryList } from "../UI";
import CodeBlock from "../CodeBlock";

const OLED_CODE = `#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void setup() {
  Serial.begin(115200);

  // Initialize I2C
  Wire.begin(21, 22);

  // Initialize OLED
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println("SSD1306 allocation failed");
    while (true);
  }

  display.clearDisplay();

  // Text settings
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);

  // Position the text
  display.setCursor(10, 24);
  display.println("Greycode");
  display.display();
}

void loop() {
  // Nothing to do
}`;

export default function OledDatasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    The 0.96-inch OLED Display (I²C) is a compact, low-power
                    display module commonly used to show text, graphics, and
                    sensor data in embedded systems. It communicates with
                    microcontrollers such as the ESP32 and Arduino using the
                    I²C interface, requiring only two data lines (SDA and
                    SCL). With its high contrast, wide viewing angle, and low
                    power consumption, it is ideal for IoT devices, portable
                    electronics, and real-time monitoring applications.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/DocImages/096-oled-display/oled-circuit.png"
                    alt="OLED wiring diagram"
                    caption="0.96&quot; OLED (I2C) connected to an ESP32/Arduino"
                />
            </Section>

            <Section title="Code">
                <LibraryList
                    title="You will need two libraries:"
                    items={["Adafruit SSD1306", "Adafruit GFX Library"]}
                />

                <Paragraph>
                    The code below will display "Greycode" on the display.
                </Paragraph>
                <CodeBlock language="cpp" code={OLED_CODE} />
            </Section>
        </div>
    );
}
