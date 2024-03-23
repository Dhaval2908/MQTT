const express = require('express');
const mqtt = require('mqtt');
const ejs = require('ejs');

const app = express();
const client = mqtt.connect('mqtt://3.96.178.57:1883'); // or use your MQTT broker URL

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', { websiteStatus: websiteStatus });
});

app.post('/toggle', (req, res) => {
  websiteStatus = !websiteStatus;
  const message = websiteStatus ? 'on' : 'off';
  client.publish('website/status', message);
  res.redirect('/');
});

let websiteStatus = true;

client.on('connect', () => {
  client.subscribe('website/status');
});

client.on('message', (topic, message) => {
  if (topic === 'website/status') {
    websiteStatus = message.toString() === 'on';
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
