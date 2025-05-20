const express = require('express');
const crypto = require('node:crypto');
const cors = require('cors');
const { writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const app = express();
const port = 6666;
const secret = '8zp389Y3K9QS62!sAo#KbDz4M2$6&=DepQm*#(8,5k_on2s0OV0%3E3t3%u,mIyo';
// const secret = 'ba447d1cd505da07b0245db37113c5435cb571b869d01427ed2b4617b4304ab7';

app.use(express.json());
app.use(cors());

app.post('/webhooks/evaluations/truliooplatformbusinessinsights', (req, res) => {
// app.post('/webhooks/evaluations/truliooplatformpersonmatch', (req, res) => {
  // console.log('[44m%s[0m', 'index.js:13 req.body', req.body);
  // writeFileSync(resolve(__dirname, 'headers.json'), JSON.stringify(req.headers, null, 2));

  const payload = JSON.stringify(req.body);
  const providedSignature = req.headers['x-trulioo-signature'] ?? '';
  const hmac = crypto.createHmac('sha256', secret);
  const generatedSignature = hmac.update(payload).digest('hex');

  console.log('[44m%s[0m', 'index.js:19 req.body', req.body);
  // console.log('[44m%s[0m', 'index.js:20 req.body.event.type', req.body.event.type);
  // console.log('[44m%s[0m', 'index.js:20 req.body.serviceData', req.body.serviceData);
  if (req.body?.event?.type?.includes('SERVICE_SUBMIT') && req.body?.serviceData !== undefined) {
    console.log('[34m%s[0m', 'index.js:19 ', req.body);
    if (req.body.event.type === 'SERVICE_SUBMIT') {
      writeFileSync(resolve(__dirname, 'headers.json'), JSON.stringify(req.headers, null, 2));
      writeFileSync(resolve(__dirname, 'data.json'), JSON.stringify(req.body, null, 2));
    }
    return res.status(200).header(req.headers).json(req.body);
  }

  if (req.body.challenge) {
    if (crypto.timingSafeEqual(Buffer.from(providedSignature), Buffer.from(generatedSignature))) {
      console.log('Signature verified');
      return res.status(200).json({
        challenge: req.body.challenge
      });
    } else {
      console.log('Signature not verified');
      return res.status(401).send('Unauthorized');
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})