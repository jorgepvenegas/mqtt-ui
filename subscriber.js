const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

client.on("message", (topic, message) => {
  console.log(topic, message.toString());
});

client.on("connect", () => {
  console.log("Connected");
  client.subscribe("#");
});
