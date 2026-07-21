import React from "react";
import { Section, Paragraph, Figure, LibraryList, Note } from "../UI";
import CodeBlock from "../CodeBlock";

const DHT22_CODE = `#include <Arduino.h>
#include <DHT.h>

#define DHTPIN 2      // GPIO 2
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("DHT22 Sensor Test");
  dht.begin();
}

void loop() {
  // Read humidity and temperature
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  // Check if any reads failed
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT22 sensor!");
    delay(2000);
    return;
  }

  Serial.println("--------------------");
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" °C");
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  delay(2000); // DHT22 should not be read more than once every 2 seconds
}`;

export default function DHT22Datasheet() {
    return (
        <div className="space-y-8">
            <Section title="Description">
                <Paragraph>
                    The DHT22 is a digital temperature and humidity sensor
                    that provides accurate, calibrated measurements through a
                    single-wire interface. It is widely used in IoT, weather
                    monitoring, and environmental sensing applications due to
                    its high accuracy and compatibility with microcontrollers
                    such as Arduino and ESP32.
                </Paragraph>
            </Section>

            <Section title="Circuit Diagram">
                <Figure
                    src="/images/DocImages/dht22/dht22-circuit.png"
                    alt="DHT22 wiring diagram"
                    caption="DHT22 connected to an ESP32/Arduino"
                />
            </Section>

            <Section title="Code">
                <LibraryList
                    title="Add the following libraries to your project:"
                    items={[
                        "adafruit/Adafruit Unified Sensor@^1.1.15",
                        "adafruit/DHT sensor library@^1.4.7",
                    ]}
                />

                <Paragraph>Your platformio.ini should look like this:</Paragraph>
                <Figure
                    src="/images/DocImages/dht22/dht22-platformio.png"
                    alt="platformio.ini example"
                />

                <Paragraph>
                    Below is the complete code to read the temperature and
                    humidity from the DHT22 and display it on the serial
                    monitor:
                </Paragraph>
                <CodeBlock language="cpp" code={DHT22_CODE} />

                <Note>
                    Upload and monitor the code — you should see live
                    temperature and humidity values printed every 2 seconds.
                </Note>
                <Figure
                    src="/images/DocImages/dht22/dht22-serial-output.png"
                    alt="Serial monitor output"
                    caption="Example serial monitor output"
                />
            </Section>
        </div>
    );
}