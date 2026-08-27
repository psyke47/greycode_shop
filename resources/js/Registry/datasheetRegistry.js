import DHT22Datasheet from "../Components/ProductComponents/Dht22datasheet";
import UltrasonicSensorDatasheet from "../Components/ProductComponents/UltrasonicSensorDatasheet";
import OledDatasheet from "../Components/ProductComponents/OledDatasheet";
import JoystickDatasheet from "../Components/ProductComponents/JoystickDatasheet";
import RoundLcdDatasheet from "../Components/ProductComponents/RoundLcdDatasheet";
import ServoDatasheet from "../Components/ProductComponents/ServoDatasheet";
import LdrDatasheet from "../Components/ProductComponents/LdrDatasheet";
import PotentiometerDatasheet from "../Components/ProductComponents/PotentiometerDatasheet";

/**
 * Map of product slug -> datasheet component.
 * Add an entry here every time you write up a new product's documentation.
 * A product with no entry just won't show a documentation section
 * (ProductDocumentation returns null) — nothing breaks.
 *
 * IMPORTANT: keys must match the real `slug` column in the products table,
 * not a shorthand name — that's what caused oled-display / joystick /
 * round-lcd / servo-motor / ldr to silently never render before.
 */
const datasheetRegistry = {
    "dht22": DHT22Datasheet,
    "ultrasonic-sensor": UltrasonicSensorDatasheet,
    "096-oled-display": OledDatasheet,
    "ky-023-ps2-game-joystickmodule": JoystickDatasheet,
    "240x240-rgb-tft-displayscreen-lcd-modules": RoundLcdDatasheet,
    "ldr-photoresistor": LdrDatasheet,
    "potentiometer": PotentiometerDatasheet,

    // Same generic servo write-up for all three servo products
    // (was a single invalid "servo-motor" key before):
    "mg90s-servo-motor": ServoDatasheet,
    "sg90-180-degree-servo": ServoDatasheet,
    "mg995-360-degree-servo": ServoDatasheet,

    // "4x4-matrix-keypad": — held back. The uploaded Matrix_doc is
    // actually an 8x8 LED dot-matrix (MAX7219) datasheet, not the 4x4
    // keypad. Confirm the right product before wiring this one in.
};

export default datasheetRegistry;