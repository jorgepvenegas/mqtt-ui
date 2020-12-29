const ws = require("ws");
const mqtt = require("mqtt");

//  Setup MQTT
const {
  parsed: { MQTT_USERNAME, MQTT_PASSWORD, MQTT_BROKER },
} = require("dotenv").config();

const mqttClient = mqtt.connect(MQTT_BROKER, {
  username: MQTT_USERNAME,
  password: MQTT_PASSWORD,
});

//  Setup WebSockets
const wsServer = new ws.Server({
  port: 8081,
});

let sockets = [];

wsServer.on("connection", (socket) => {
  console.log("Client connected to WS");
  sockets.push(socket);
  socket.send(JSON.stringify({ date: Date.now(), status: "Connected" }));
});

mqttClient.on("connect", () => {
  console.log("Connected to MQTT broker");
  // Subscribe to all topics with #
  mqttClient.subscribe("livingroom/sensor/temperature/state");
});

mqttClient.on("error", (err) => {
  console.error(err);
});

mqttClient.on("message", (topic, message) => {
  sockets.forEach((s) => {
    s.send(JSON.stringify({ topic, message: message.toString() }));
  });
});
