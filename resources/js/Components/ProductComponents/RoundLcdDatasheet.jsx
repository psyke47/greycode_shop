import React from "react";
import { Section, Paragraph, Figure, LibraryList } from "../UI";
import CodeBlock from "../CodeBlock";

const ROUND_LCD_CODE = `#include <Adafruit_GFX.h>
#include <Adafruit_GC9A01A.h>
#include <SPI.h>

#define TFT_MOSI 23
#define TFT_SCK  18
#define TFT_CS   5
#define TFT_DC   2
#define TFT_RST  4

Adafruit_GC9A01A tft(TFT_CS, TFT_DC, TFT_RST);

void setup() {
  SPI.begin(TFT_SCK, -1, TFT_MOSI, -1);
  tft.begin();
  tft.setRotation(0);
}

void loop() {
  // Red
  tft.fillScreen(GC9A01A_RED);
  delay(1000);

  // Green
  tft.fillScreen(GC9A01A_GREEN);
  delay(1000);

  // Blue
  tft.fillScreen(GC9A01A_BLUE);
  delay(1000);
}`;

export default function RoundLcdDatasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    The 1.28-inch TFT LCD Round Module is a full-colour
                    circular display designed to show text, graphics, icons,
                    and animations with high clarity. It communicates with
                    microcontrollers such as the ESP32 using the SPI
                    interface, providing fast data transfer and smooth
                    display performance. With its vibrant colours and compact
                    design, it is ideal for smartwatches, IoT devices,
                    digital dashboards, and other embedded system
                    applications.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/DocImages/240x240-rgb-tft-displayscreen-lcd-modules/round-lcd-circuit.png"
                    alt="Round TFT LCD wiring diagram"
                    caption="Round TFT LCD connected to an ESP32"
                />
            </Section>

            <Section title="Code">
                <LibraryList
                    title="You will need 3 libraries for this module:"
                    items={[
                        "Adafruit GFX Library",
                        "Adafruit GC9A01A",
                        "TFT_eSPI@^2.5.43",
                    ]}
                />

                <Paragraph>
                    The code below will show different lights (RGB) turning
                    on the display and cycling through.
                </Paragraph>
                <CodeBlock language="cpp" code={ROUND_LCD_CODE} />
            </Section>
        </div>
    );
}
