/**
 * Zariya ESP32 + BNO055 Posture Sensor
 * =====================================
 * Sends posture data to the Zariya dashboard API
 * 
 * Required Libraries:
 * - Adafruit BNO055 (by Adafruit)
 * - Adafruit Unified Sensor
 * - ArduinoJson (by Benoit Blanchon)
 * - WiFi (built-in ESP32)
 * - HTTPClient (built-in ESP32)
 */

#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BNO055.h>
#include <WiFi.h>
#include <HTTPClient.h>

// ── Configuration ──────────────────────────────────────
const char* ssid = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "http://YOUR_SERVER_IP:3000/api/posture";

// ── Hardware ───────────────────────────────────────────
Adafruit_BNO055 bno = Adafruit_BNO055(55, 0x29);
const int VIBRATION_PIN = 27;

// ── Baseline ───────────────────────────────────────────
float baselineY = 0;
float baselineZ = 0;

// ── Vibration tracking ─────────────────────────────────
unsigned long badPostureStart = 0;
bool isBadPosture = false;
bool isVibrating = false;

void setup() {
  Serial.begin(115200);
  pinMode(VIBRATION_PIN, OUTPUT);
  digitalWrite(VIBRATION_PIN, LOW);

  // Init BNO055
  if (!bno.begin()) {
    Serial.println("BNO055 NOT detected!");
    while (1);
  }
  bno.setExtCrystalUse(true);
  Serial.println("BNO055 ready!");

  // Connect WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected!");

  // Calibration countdown
  Serial.println("======================");
  Serial.println("CALIBRATION STARTING!");
  Serial.println("Sit in GOOD posture...");
  Serial.println("Calibrating in 3...");
  delay(1000);
  Serial.println("2...");
  delay(1000);
  Serial.println("1...");
  delay(1000);

  imu::Vector<3> euler = bno.getVector(Adafruit_BNO055::VECTOR_EULER);
  baselineY = euler.y();
  baselineZ = euler.z();

  Serial.println("Calibration done!");
  Serial.print("Baseline Y: "); Serial.println(baselineY);
  Serial.print("Baseline Z: "); Serial.println(baselineZ);
  Serial.println("======================");
}

void loop() {
  imu::Vector<3> euler = bno.getVector(Adafruit_BNO055::VECTOR_EULER);

  float deviationY = abs(euler.y() - baselineY);
  float deviationZ = abs(euler.z() - baselineZ);
  float deviation = max(deviationY, deviationZ);

  String posture;
  if (deviation <= 10) posture = "good";
  else if (deviation <= 20) posture = "warning";
  else if (deviation <= 35) posture = "bad";
  else posture = "very_bad";

  Serial.print("Deviation: "); Serial.print(deviation);
  Serial.print(" | Posture: "); Serial.println(posture);

  // Vibration logic
  if (posture == "bad" || posture == "very_bad") {
    if (!isBadPosture) {
      isBadPosture = true;
      badPostureStart = millis();
      Serial.println("Bad posture detected! Starting timer...");
    } else {
      unsigned long elapsed = millis() - badPostureStart;
      if (elapsed >= 10000 && !isVibrating) {
        Serial.println("10 seconds of bad posture! Vibrating!");
        digitalWrite(VIBRATION_PIN, HIGH);
        isVibrating = true;
      }
    }
  } else {
    if (isVibrating) {
      Serial.println("Posture corrected! Stopping vibration.");
      digitalWrite(VIBRATION_PIN, LOW);
      isVibrating = false;
    }
    isBadPosture = false;
    badPostureStart = 0;
  }

  // Send to dashboard
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverURL);
    http.addHeader("Content-Type", "application/json");
    String payload = "{\"posture\":\"" + posture + "\",\"deviation\":" + deviation + "}";
    int responseCode = http.POST(payload);
    Serial.print("Response: "); Serial.println(responseCode);
    http.end();
  }

  delay(3000);
}