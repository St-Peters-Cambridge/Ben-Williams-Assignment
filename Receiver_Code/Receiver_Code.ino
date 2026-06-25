#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#define SERVICE_UUID  "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHAR_UUID     "beb5483e-36e1-4688-b7f5-ea07361b26a8"

#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 32 // OLED display height, in pixels
#define LOGO_HEIGHT   32
#define LOGO_WIDTH    64

String latestTelemetry = "";
struct Telemetry {
  uint16_t Time;
  uint8_t PacketCount;
  uint8_t Mode;
  uint16_t Altitude; // For flights over 6.5km, change to uint32_t
  uint16_t VerticalVelocity; // For flights over mach 19, use uint32_t
  uint32_t GPSLat;
  uint32_t GPSLon;
  uint16_t HDOPSats;
  uint8_t Voltage;
  uint8_t EnabledItems; // BaroEnabled, imuAccelEnabled, imuGyroEnabled, accelEnabled, flashEnabled, SDEnabled
  uint8_t Checksum;
} __attribute__((packed));
Telemetry t;
int ReceivedPackets = 0;

static const unsigned char PROGMEM logo_bmp[] = {
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x30, 0x00, 0x1f, 0xc0, 
	0x00, 0x00, 0x00, 0x00, 0x78, 0x01, 0xff, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x1d, 0xff, 0x80, 
	0x00, 0x00, 0x00, 0xe0, 0x00, 0xfe, 0xff, 0x80, 0x00, 0x00, 0x00, 0x00, 0x03, 0xff, 0xbf, 0x00, 
	0x00, 0x00, 0x00, 0x00, 0x0f, 0xff, 0xf2, 0x00, 0x00, 0x00, 0x00, 0x00, 0x7c, 0x1f, 0xfc, 0x00, 
	0x00, 0x00, 0x00, 0x7e, 0xfa, 0x37, 0xf8, 0x00, 0x00, 0x00, 0x0f, 0xfb, 0xf6, 0x17, 0xe0, 0x00, 
	0x00, 0x00, 0x7f, 0xef, 0xf9, 0xe7, 0xc0, 0x40, 0x00, 0x01, 0xff, 0xff, 0xff, 0x7f, 0x03, 0xf0, 
	0x00, 0x07, 0x87, 0x7f, 0xdf, 0xfc, 0x00, 0xc0, 0x00, 0x0e, 0x00, 0xff, 0x7f, 0xf0, 0x00, 0x00, 
	0x00, 0x00, 0x1e, 0xfd, 0xff, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x07, 0xb7, 0xff, 0x60, 0x30, 0x00, 
	0x00, 0x00, 0x01, 0xdf, 0xfb, 0xe0, 0x30, 0x00, 0x00, 0x00, 0x07, 0x7b, 0xef, 0xe0, 0x00, 0x00, 
	0x00, 0x00, 0x37, 0xde, 0x3f, 0xc0, 0x00, 0x00, 0x00, 0x03, 0x9d, 0x86, 0x1f, 0x80, 0x00, 0x00, 
	0x00, 0x18, 0xfa, 0x00, 0x0f, 0x00, 0x00, 0x00, 0x00, 0x41, 0xe6, 0x00, 0x1e, 0x00, 0x00, 0x00, 
	0x00, 0x03, 0x8c, 0x00, 0x78, 0x00, 0x00, 0x00, 0x00, 0x40, 0x10, 0x00, 0xe0, 0x00, 0x00, 0x00, 
	0x00, 0x82, 0x60, 0x01, 0x00, 0x00, 0x00, 0x00, 0x03, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
	0x07, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
	0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};


#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

HardwareSerial E32(2);

BLECharacteristic *pCharacteristic;
class MyCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *pChar) {
    String value = pChar->getValue().c_str();
    Serial.println("Received: " + value);
    
    // Echo back
    pChar->setValue(("Echo: " + value).c_str());
    pChar->notify();
  }
};

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    Serial.println("Client connected");
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    pAdvertising->start();
  }

  void onDisconnect(BLEServer* pServer) {
    Serial.println("Client disconnected");
    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    pAdvertising->start();
    BLEDevice::startAdvertising();
  }
};

void setup() {
  Serial.begin(115200);
  pinMode(0, OUTPUT);
  digitalWrite(0, LOW);
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }
  display.display();
  display.clearDisplay();
  display.drawBitmap(
    (SCREEN_WIDTH  - LOGO_WIDTH)  / 2,   // x: centered horizontally
    (SCREEN_HEIGHT - LOGO_HEIGHT) / 2,   // y: centered vertically
    logo_bmp,
    LOGO_WIDTH,
    LOGO_HEIGHT,
    SSD1306_WHITE
  );
  display.display();
  E32.begin(9600, SERIAL_8N1, 16, 17);
  BLEDevice::init("Rocket Ground Station");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pServer->setCallbacks(new MyServerCallbacks());

  pCharacteristic = pService->createCharacteristic(
    CHAR_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE |
    BLECharacteristic::PROPERTY_NOTIFY
  );
  pCharacteristic->addDescriptor(new BLE2902());
  pCharacteristic->setCallbacks(new MyCallbacks());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->start();
}

void loop() {
  if (Serial.available()) {

    String message = Serial.readStringUntil('\n');

    E32.println(message);

    Serial.print("Sent: ");
    Serial.println(message);
  }
  while(E32.available()>=sizeof(Telemetry)){
    struct Telemetry {
      uint16_t Time;
      uint8_t PacketCount;
      uint8_t Mode;
      uint16_t Altitude; // For flights over 6.5km, change to uint32_t
      uint16_t VerticalVelocity; // For flights over mach 19, use uint32_t
      int32_t GPSLat;
      int32_t GPSLon;
      uint16_t HDOPSats;
      uint8_t Voltage;
      uint8_t EnabledItems; // BaroEnabled, imuAccelEnabled, imuGyroEnabled, accelEnabled, flashEnabled, SDEnabled
      uint8_t Checksum;
    } __attribute__((packed));
    Telemetry t;
    ReceivedPackets ++;
    E32.readBytes((uint8_t*)&t,sizeof(Telemetry));
    uint8_t Sats = (t.HDOPSats % 11);
    float HDOP = (t.HDOPSats / 11) / 10.0;
    String latestTelemetry = String(t.Time / 10.0, 1) + "," +
                        String(t.PacketCount) + "," +
                        String(ReceivedPackets) + "," +
                        String(t.Altitude / 10.0, 1) + "," +
                        String(t.VerticalVelocity/10.0, 1) + "," +
                        String(t.GPSLat/ 1000000.0, 6) + "," +
                        String(t.GPSLon/1000000.0, 6) + "," +
                        String(HDOP, 1) + "," + 
                        String(Sats) + "," +
                        String(t.Voltage / 10.0, 1) + "," +
                        String((t.EnabledItems & 0x01)?1:0) + "," + 
                        String((t.EnabledItems & 0x02)?1:0) + "," + 
                        String((t.EnabledItems & 0x04)?1:0) + "," + 
                        String((t.EnabledItems & 0x08)?1:0) + "," + 
                        String((t.EnabledItems & 0x16)?1:0) + "," + 
                        String((t.EnabledItems & 0x32)?1:0);
      Serial.println(latestTelemetry);
    BLECharacteristic *pChar;
    delay(50);delay(50);
    pCharacteristic->setValue(latestTelemetry.c_str());
    pCharacteristic->notify();
  }
}
