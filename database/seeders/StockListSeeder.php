<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Str;

class StockListSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'DIY' => 'Do-it-yourself products',
            'Components' => 'Electronic components and parts',
            'Smart Homes'=> 'Smart home & automation devices',
        ];

        $categoriesMap = [];

        foreach ($categories as $name => $description) {
            $slug = Str::slug($name);
            $category = Category::firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => $description,
                    'is_active' => true,
                    'sort_order' => 1
                ]
            );
            $categoryMap[$name] = $category->id;
        }
        //Default Stock Quantity == 150
        $products = [
            // DIY Category Products
            [
                'name' => 'MG90S Servo Motor',
                'description' => 'A high-quality MG90S servo motor for robotics projects',
                'price'=> 59.99,
                'category_name' => 'DIY',
                'image_url' => resource_path('/images/SG90MicroServoMotor.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Nema 17 48mm Stepper Motor',
                'description' => 'A powerful Nema 17 stepper motor for 3D printing projects',
                'price' => 259.99,
                'category_name' => 'DIY',
                'image_url' => resource_path('/images/Nema17StepperMotor.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'MG995 360 Degree Servo',
                'price' => 74.99,
                'description' => 'High-torque MG995 servo with 360° rotation.',
                'category_name' => 'DIY',
                'image_url' => resource_path('/images/MG995.jpg'),
                'stock_quantity' => 150,

            ],
            [
                'name' => 'NEMA 17 48mm stepper motor',
                'price' => 259.99,
                'description' => 'NEMA 17 stepper motor (42mm) for precise motion control.',
                'category_name' => 'DIY',
                'image_url' => resource_path('/images/nema17steppermotor.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Gear Motor',
                'price' => 19.99,
                'description' => 'Small gear motor for DIY robotics and automation.',
                'category_name' => 'DIY',
                'image_url' => resource_path('/images/GearMotor.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Breadboard',
                'price' => 20.99,
                'description' => 'Standard breadboard for prototyping and circuit testing.',
                'category_name' => 'DIY',
                'image_url' => resource_path('/images/breadboard.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Jumper wires Male to male',
                'price' => 15.99,
                'description' => 'Male-to-male jumper wires for breadboard and prototyping.',
                'category_name' => 'DIY',
                'image_url' => resource_path('/images/jumper-wire-MM.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Jumper wires male to female',
                'price' => 15.99,
                'description' => 'Male-to-female jumper wires for breadboard and prototyping.',
                'category_name' => 'DIY',
                'image_url' => resource_path('/images/jumper-wire-MF.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Jumper wires female to female',
                'price' => 15.99,
                'description' => 'Female-to-female jumper wires for breadboard and prototyping.',
                'category_name' => 'DIY',
                'image_url' => resource_path('/images/jumper-wire-FF.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Component Kit led resistor switch potentiometer',
                'price' => 49.99,
                'description' => 'Electronics kit with LEDs, resistors, switches, and potentiometers.',
                'category_name' => 'DIY',
                'image_url' => resource_path('/images/component_kit.jpg'),
                'stock_quantity' => 150,
            ],

            // Components Category - individual electronic components
            [
                'name' => 'DHT11 Temperature Sensor',
                'price' => 23.99,
                'description' => 'Digital temperature and humidity sensor',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/dht22.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'MPU6050 Sensor Module',
                'price' => 59.99,
                'description' => '6-axis motion tracking device with accelerometer and gyroscope.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/mpu6050.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Ultrasonic Sensor',
                'price' => 31.99,
                'description' => 'Ultrasonic distance measuring sensor for robotics and automation projects.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/ultrasonic.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'DHT22',
                'price' => 74.99,
                'description' => 'Digital temperature and humidity sensor for weather monitoring projects.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/dht22.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'MQ-2 Gas Sensor module',
                'price' => 49.99,
                'description' => 'Gas and smoke detection module suitable for safety systems.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/mq2.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Soil Temperature and humidity sensor',
                'price' => 19.99,
                'description' => 'Soil sensor for agriculture and garden automation.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/soil.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Infrared tube module photoelectric sensor',
                'price' => 25.99,
                'description' => 'Infrared photoelectric sensor for obstacle avoidance.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/infrared.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'High sensitivity microphone',
                'price' => 14.99,
                'description' => 'Microphone module for sound detection projects.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/mic.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'LDR photoresistor',
                'price' => 9.99,
                'description' => 'Light-dependent resistor for light intensity detection.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/ldr.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'L298N Motor Driver',
                'price' => 39.99,
                'description' => 'Dual H-bridge motor driver for DC and stepper motors.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/l298ndcmotorcontroller.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Potentiometer',
                'price' => 19.99,
                'description' => 'Potentiometer for adjustable resistance in circuits.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/Potentiometer.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => '4pin RGB light',
                'price' => 24.99,
                'description' => '4-pin RGB LED module for colorful lighting effects.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/4pinrgbled.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => '200pc LED Diode kit mix',
                'price' => 114.99,
                'description' => '200-piece LED kit with assorted colors for projects.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/led_kit.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Buzzer',
                'price' => 16.99,
                'description' => 'Piezo buzzer module for sound and alarm applications.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/buzzer5v.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => '4x4 matrix keypad',
                'price' => 44.99,
                'description' => '4x4 matrix keypad for Arduino and embedded projects.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/4x4membraneswitchmatrixkeypad.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => '200 Pcs capacitor box kit',
                'price' => 94.99,
                'description' => '200-piece capacitor assortment kit for electronic projects.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/capacitor_kit.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => '25pc Push button',
                'price' => 49.99,
                'description' => '25-pack of push buttons for prototyping and projects.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/push_button.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => '600pc 30 kinds metal film Resistor',
                'price' => 159.99,
                'description' => '600-piece resistor kit with 30 different values.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/resistor_kit.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Transistor',
                'price' => 14.99,
                'description' => 'General-purpose transistor for electronic circuits.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/bc547-transistor.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => '5A DC-DC step down module',
                'price' => 34.99,
                'description' => 'DC-DC buck converter for power regulation up to 5A.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/stepdown.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => '5V channel Relay module shield',
                'price' => 69.99,
                'description' => 'Relay module shield for switching high voltage devices.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/5vchannelrelay.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => '12V dc radial cooling fan 50mmx50mm',
                'price' => 34.99,
                'description' => '12V DC cooling fan 50x50mm for electronics and enclosures.',
                'category_name' => 'Components',
                'image_url' => resource_path('/images/12vdcradialfan.jpg'),
                'stock_quantity' => 150,
            ],

            // Smart Homes Category - IoT, displays, and automation
            [
                'name' => '0.96" Oled Display',
                'price' => 59.99,
                'description' => 'LCD Display with I2C adapter',
                'category_name' => 'Smart Homes',
                'image_url' => resource_path('/images/oled.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'LCD 1602 I2C screen',
                'price' => 59.99,
                'description' => '1602 LCD screen with I2C interface for easy display integration.',
                'category_name' => 'Smart Homes',
                'image_url' => resource_path('/images/lcd1602.jpg'),
                'stock_quantity' => 150,
            ],
            [
                'name' => 'ESP32 Camera',
                'price' => 169.99,
                'description' => 'ESP32-CAM board with camera for IoT and vision projects.',
                'category_name' => 'Smart Homes',
                'image_url' => resource_path('/images/esp32cam.jpg'),
                'stock_quantity' => 150,
            ],
        ];

        // Insert products and their images
        foreach ($products as $productData) {
            $product = Product::create([
                'category_id' => $categoryMap[$productData['category_name']],
                'name' => $productData['name'],
                'description' => $productData['description'],
                'price' => $productData['price'],
                'stock_quantity' => 100, // Default stock quantity
                'is_featured' => false,
                'is_active' => true,
            ]);

            // Create product image
            ProductImage::create([
                'product_id' => $product->id,
                'url' => basename($productData['image_url']),
                'alt_text' => $productData['name'],
                'is_primary' => true,
                'sort_order' => 1,
            ]);
        }

        $this->command->info('Stock list data seeded successfully with new categories: DIY, Components, Smart Homes!');
    }
}
