const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost");

// Event generator
client.on("connect", () => {
  setInterval(() => {
    const value = getRandomNumber();
    client.publish("test", String(value));
    console.log("Sent:", value);
  }, 1000);
});

const getRandomNumber = () => {
  return (Math.random() * 100).toFixed(2);
};
