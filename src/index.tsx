import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const WS = new WebSocket("ws://localhost:8081");

WS.onopen = function () {
  console.log("Connection opened");
};

WS.onerror = function (err) {
  console.error(err);
};

const App: React.FC = () => {
  const [temperature, setTemperature] = useState([]);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    WS.onmessage = function (msg) {
      const { topic, message } = JSON.parse(msg.data);
      setTopic(topic);
      const date = new Date();
      setTemperature((currentTemp) => [
        ...currentTemp,
        {
          name: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
          temp: parseFloat(message),
        },
      ]);
    };
  }, []);

  return (
    <>
      {temperature.length === 0 ? (
        <p>Waiting for datapoints...</p>
      ) : (
        <>
          <p>Data reported to {topic}</p>
          <LineChart
            width={600}
            height={300}
            data={temperature}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temp" dot={false} stroke="#8884d8" />
          </LineChart>
        </>
      )}
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
