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

// Generic webhook endpoint
app.post('/webhooks/receive', (req, res) => {
  const payload = JSON.stringify(req.body);
  // Use a generic header for signature, or allow custom via env
  const signatureHeader = process.env.WEBHOOK_SIGNATURE_HEADER || 'x-webhook-signature';
  const providedSignature = req.headers[signatureHeader] ?? '';
  const hmac = crypto.createHmac('sha256', secret);
  const generatedSignature = hmac.update(payload).digest('hex');

  console.log('[Webhook] Received body:', req.body);
  // Save all headers and body for inspection
  writeFileSync(resolve(__dirname, 'headers.json'), JSON.stringify(req.headers, null, 2));
  writeFileSync(resolve(__dirname, 'data.json'), JSON.stringify(req.body, null, 2));

  // Respond to challenge if present (for webhook verification)
  if (req.body.challenge) {
    if (crypto.timingSafeEqual(Buffer.from(providedSignature), Buffer.from(generatedSignature))) {
      console.log('Signature verified');
      return res.status(200).json({ challenge: req.body.challenge });
    } else {
      console.log('Signature not verified');
      return res.status(401).send('Unauthorized');
    }
  }

  // Always verify signature for normal requests
  if (crypto.timingSafeEqual(Buffer.from(providedSignature), Buffer.from(generatedSignature))) {
    return res.status(200).json({ status: 'received', data: req.body });
  }
  return res.status(401).send('Unauthorized');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})