const mqtt = require("mqtt");
const WebSocket = require("ws");

const mqttClient = mqtt.connect("mqtt://localhost");
let wsClient = new WebSocket("ws://localhost:8081");

const server = new WebSocket.Server({
  port: 8081,
});

let sockets = [];

server.on("connection", (socket) => {
  console.log("Client connected to WS");
  sockets.push(socket);

  socket.send(
    JSON.stringify({ date: Date.now(), status: "Connected", foo: "bar" })
  );

  // socket.on("message", (msg) => {
  //   socket.send(msg);
  //   sockets.forEach((s) => {
  //     console.log("Message:", msg);
  //     socket.send(msg);
  //   });
  // });
});

mqttClient.on("connect", () => {
  console.log("Connected to MQTT server");
  // Subscribe to all topics with #
  mqttClient.subscribe("#");
});

mqttClient.on("message", (topic, message) => {
  wsClient.send("From MQTT: " + message.toString());
  sockets.forEach((s) => {
    s.send(JSON.stringify({ topic, message: message.toString() }));
  });
});
