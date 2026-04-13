<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;

class NewStockListSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks to avoid constraint errors
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        // 1. Delete all existing products (images will cascade delete)
        Product::truncate();
        ProductImage::truncate();

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        // 2. Get category IDs by name (they must already exist)
        $categoryMap = [
            'DIY'          => \App\Models\Category::where('name', 'DIY')->first()->id,
            'Components'   => \App\Models\Category::where('name', 'Components')->first()->id,
            'Smart Homes'  => \App\Models\Category::where('name', 'Smart Homes')->first()->id,
        ];

        // 3. Define the new products (from your updated stock list)
        $products = [
            // DIY
            ['name' => 'MG90S Servo Motor', 'description' => 'Metal gear servo motor for robotics', 'price' => 59.99, 'category' => 'DIY', 'image' => 'SG90MicroServoMotor.jpg'],
            ['name' => 'SG90 180 Degree Servo', 'description' => 'SG90 servo motor with 180° rotation for robotics and control.', 'price' => 69.99, 'category' => 'DIY', 'image' => 'SG90MicroServoMotor.jpg'],
            ['name' => 'MG995 360 Degree Servo', 'description' => 'High-torque MG995 servo with 360° rotation.', 'price' => 74.99, 'category' => 'DIY', 'image' => 'MG995.jpg'],
            ['name' => 'NEMA 17 48mm stepper motor', 'description' => 'NEMA 17 stepper motor (42mm) for precise motion control.', 'price' => 259.99, 'category' => 'DIY', 'image' => 'nema17steppermotor.jpg'],
            ['name' => 'Gear Motor', 'description' => 'Small gear motor for DIY robotics and automation.', 'price' => 19.99, 'category' => 'DIY', 'image' => 'GearMotor.jpg'],
            ['name' => 'L298N Motor Driver', 'description' => 'Dual H-bridge motor driver for DC and stepper motors.', 'price' => 39.99, 'category' => 'DIY', 'image' => 'l298ndcmotorcontroller.jpg'],

            // Components
            ['name' => 'DHT11 Temperature Sensor', 'description' => 'Digital temperature and humidity sensor', 'price' => 23.99, 'category' => 'Components', 'image' => 'dht22.jpg'],
            ['name' => 'MPU6050 Sensor Module', 'description' => '6-axis motion tracking device with accelerometer and gyroscope.', 'price' => 59.99, 'category' => 'Components', 'image' => 'mpu6050.jpg'],
            ['name' => 'Ultrasonic Sensor', 'description' => 'Ultrasonic distance measuring sensor for robotics and automation projects.', 'price' => 31.99, 'category' => 'Components', 'image' => 'ultrasonic.jpg'],
            ['name' => 'DHT22', 'description' => 'Digital temperature and humidity sensor for weather monitoring projects.', 'price' => 74.99, 'category' => 'Components', 'image' => 'dht22.jpg'],
            ['name' => 'MQ-2 Gas Sensor module', 'description' => 'Gas and smoke detection module suitable for safety systems.', 'price' => 49.99, 'category' => 'Components', 'image' => 'mq2.jpg'],
            ['name' => 'Soil Temperature and humidity sensor', 'description' => 'Soil sensor for agriculture and garden automation.', 'price' => 19.99, 'category' => 'Components', 'image' => 'soil.jpg'],
            ['name' => 'Infrared tube module photoelectric sensor', 'description' => 'Infrared photoelectric sensor for obstacle avoidance.', 'price' => 25.99, 'category' => 'Components', 'image' => 'infrared.jpg'],
            ['name' => 'High sensitivity microphone', 'description' => 'Microphone module for sound detection projects.', 'price' => 14.99, 'category' => 'Components', 'image' => 'mic.jpg'],
            ['name' => 'LDR photoresistor', 'description' => 'Light-dependent resistor for light intensity detection.', 'price' => 9.99, 'category' => 'Components', 'image' => 'ldr.jpg'],
            ['name' => 'Potentiometer', 'description' => 'Potentiometer for adjustable resistance in circuits.', 'price' => 19.99, 'category' => 'Components', 'image' => 'Potentiometer.jpg'],
            ['name' => '4pin RGB light', 'description' => '4-pin RGB LED module for colorful lighting effects.', 'price' => 24.99, 'category' => 'Components', 'image' => '4pinrgbled.jpg'],
            ['name' => '200pc LED Diode kit mix', 'description' => '200-piece LED kit with assorted colors for projects.', 'price' => 114.99, 'category' => 'Components', 'image' => 'led_kit.jpg'],
            ['name' => 'Buzzer', 'description' => 'Piezo buzzer module for sound and alarm applications.', 'price' => 16.99, 'category' => 'Components', 'image' => 'buzzer5v.jpg'],
            ['name' => '4x4 matrix keypad', 'description' => '4x4 matrix keypad for Arduino and embedded projects.', 'price' => 44.99, 'category' => 'Components', 'image' => '4x4membraneswitchmatrixkeypad.jpg'],
            ['name' => '200 Pcs capacitor box kit', 'description' => '200-piece capacitor assortment kit for electronic projects.', 'price' => 94.99, 'category' => 'Components', 'image' => 'capacitor_kit.jpg'],
            ['name' => '25pc Push button', 'description' => '25-pack of push buttons for prototyping and projects.', 'price' => 49.99, 'category' => 'Components', 'image' => 'push_button.jpg'],
            ['name' => '600pc 30 kinds metal film Resistor', 'description' => '600-piece resistor kit with 30 different values.', 'price' => 159.99, 'category' => 'Components', 'image' => 'resistor_kit.jpg'],
            ['name' => 'Transistor', 'description' => 'General-purpose transistor for electronic circuits.', 'price' => 14.99, 'category' => 'Components', 'image' => 'bc547-transistor.jpg'],
            ['name' => '5A DC-DC step down module', 'description' => 'DC-DC buck converter for power regulation up to 5A.', 'price' => 34.99, 'category' => 'Components', 'image' => 'stepdown.jpg'],
            ['name' => '5V channel Relay module shield', 'description' => 'Relay module shield for switching high voltage devices.', 'price' => 69.99, 'category' => 'Components', 'image' => '5vchannelrelay.jpg'],
            ['name' => '12V dc radial cooling fan 50mmx50mm', 'description' => '12V DC cooling fan 50x50mm for electronics and enclosures.', 'price' => 34.99, 'category' => 'Components', 'image' => '12vdcradialfan.jpg'],
            ['name' => 'KY-023 PS2 Game JoyStickModule', 'description' => 'Compact PS2-style joystick module for intuitive control in gaming and robotics projects.', 'price' => 10.99, 'category' => 'Components', 'image' => 'KY-023PS2joystick.jpg'],
            ['name' => '240X240 RGB TFT DisplayScreen LCD Modules', 'description' => 'High-resolution 240x240 RGB TFT display for vibrant graphics and text in embedded projects.', 'price' => 219.99, 'category' => 'Components', 'image' => '240X240RGBTFT.jpg'],

            // Smart Homes
            ['name' => '0.96" Oled Display', 'description' => 'LCD Display with I2C adapter', 'price' => 59.99, 'category' => 'Smart Homes', 'image' => 'oled.jpg'],
            ['name' => 'LCD 1602 I2C screen', 'description' => '1602 LCD screen with I2C interface for easy display integration.', 'price' => 59.99, 'category' => 'Smart Homes', 'image' => 'lcd1602.jpg'],
            ['name' => 'ESP32 Camera', 'description' => 'ESP32-CAM board with camera for IoT and vision projects.', 'price' => 169.99, 'category' => 'Smart Homes', 'image' => 'esp32cam.jpg'],
            ['name' => 'HC-SR501 PIR Motion Sensor Module Green', 'description' => 'Reliable PIR motion sensor for detecting movement in security and automation applications.', 'price' => 20.99, 'category' => 'Smart Homes', 'image' => 'HC-SR501PIRMotionSensor.jpg'],
        ];

        // Insert products
        foreach ($products as $productData) {
            $product = Product::create([
                'category_id'    => $categoryMap[$productData['category']],
                'name'           => $productData['name'],
                'description'    => $productData['description'],
                'price'          => $productData['price'],
                'stock_quantity' => 150,   // default stock
                'is_active'      => true,
                'is_featured'    => false,
            ]);

            // Create primary image
            ProductImage::create([
                'product_id' => $product->id,
                'url'        => $productData['image'],
                'alt_text'   => $productData['name'],
                'is_primary' => true,
                'sort_order' => 1,
            ]);
        }

        $this->command->info('New stock list seeded successfully! Old products removed.');
    }
}