import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import './App.css';
import data from './data.json';

const App = () => {
  const [parsedData, setParsedData] = useState([]);

  useEffect(() => {
    const parseData = data.map(entry => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
      severity: entry.alert.severity,
      src_ip: entry.src_ip
    }));
    setParsedData(parseData);
  }, []);

  const severityData = parsedData.reduce((acc, entry) => {
    acc[entry.severity] = (acc[entry.severity] || 0) + 1;
    return acc;
  }, {});

  const severityArray = Object.keys(severityData).map(key => ({
    severity: key,
    count: severityData[key]
  }));

  const topSrcIPs = parsedData.reduce((acc, entry) => {
    acc[entry.src_ip] = (acc[entry.src_ip] || 0) + 1;
    return acc;
  }, {});

  const topSrcIPsArray = Object.keys(topSrcIPs).map(key => ({
    src_ip: key,
    count: topSrcIPs[key]
  })).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div className="App">
      {/* <h1>Security Alerts Dashboard</h1> */}

      <h2>Alerts Over Time</h2>
      <LineChart width={600} height={300} data={parsedData}>
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="flow_id" stroke="#8884d8" />
      </LineChart>

      <h2>Alerts by Severity</h2>
      <BarChart width={600} height={300} data={severityArray}>
        <XAxis dataKey="severity" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>

      <h2>Top 10 Source IPs</h2>
      <PieChart width={600} height={300}>
        <Pie data={topSrcIPsArray} dataKey="count" nameKey="src_ip" cx="50%" cy="50%" outerRadius={100}>
          {topSrcIPsArray.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d0ed57', '#a4de6c', '#d4a6a6', '#a28bfc', '#6f8aff'][index % 10]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default App;

