import React from "react";
import { Section, Paragraph, Figure, LibraryList } from "../UI";
import CodeBlock from "../CodeBlock";

const LCD1602_CODE = `#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// LCD I2C address (commonly 0x27 or 0x3F)
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  // Start I2C communication
  Wire.begin(21, 22);

  // Initialize LCD
  lcd.init();
  lcd.backlight();

  // Display message
  lcd.setCursor(0, 0);
  lcd.print("Hello");
  lcd.setCursor(0, 1);
  lcd.print("Greycode");
}

void loop() {
  // Nothing required here
}`;

export default function I2cDisplayDatasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    The I²C Interface 16×2 LCD Display Module is a
                    character-based display that can show up to 16
                    characters on each of its 2 rows. It uses the I²C
                    communication protocol, allowing it to connect to
                    microcontrollers such as Arduino and ESP32 using only
                    two data lines (SDA and SCL), reducing the number of
                    required pins. It is commonly used for displaying sensor
                    readings, system messages, and real-time information in
                    embedded and IoT projects.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/DocImages/lcd-1602-i2c-screen/lcd1602-circuit.png"
                    alt="16x2 I2C LCD wiring diagram"
                    caption="16x2 I2C LCD connected to an ESP32/Arduino"
                />
            </Section>

            <Section title="Code">
                <LibraryList
                    title="You will need this library:"
                    items={["LiquidCrystal I2C"]}
                />

                <Paragraph>
                    The code below displays "Hello Greycode" on the display.
                </Paragraph>
                <CodeBlock language="cpp" code={LCD1602_CODE} />
            </Section>
        </div>
    );
}
