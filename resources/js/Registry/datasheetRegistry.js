import DHT22Datasheet from "../Components/ProductComponents/Dht22datasheet";

/**
 * Map of product slug -> datasheet component.
 * Add an entry here every time you write up a new product's documentation.
 * A product with no entry just won't show a documentation section
 * (ProductDocumentation returns null) — nothing breaks.
 *
 * e.g. once you build the others:
 * import DHT11Datasheet from "./DHT11Datasheet";
 * import MPU6050Datasheet from "./MPU6050Datasheet";
 */
const datasheetRegistry = {
    "dht22": DHT22Datasheet,
    // "dht11-temperature-sensor": DHT11Datasheet,
    // "mpu6050-sensor-module": MPU6050Datasheet,
    // "ultrasonic-sensor": UltrasonicDatasheet,
};

export default datasheetRegistry;