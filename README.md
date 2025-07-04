# Webhoodys Webhooks Receiver

This project is a simple, generic Express.js server designed to receive and process webhook events from any service.

## Features
- Listens for POST requests at `/webhooks/receive`.
- Verifies incoming webhook signatures using HMAC SHA-256 for security (header and secret configurable via environment variables).
- Saves incoming request headers and body to `headers.json` and `data.json` for further inspection or processing.
- Responds to challenge requests for webhook verification (if your provider uses this pattern).

## Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   node index.js
   ```

3. **Endpoint:**
   - POST `/webhooks/receive`

## Configuration
- `PORT`: (optional) Port to run the server (default: 6666)
- `WEBHOOK_SECRET`: (required) Secret used to verify webhook signatures
- `WEBHOOK_SIGNATURE_HEADER`: (optional) Header name for the signature (default: `x-webhook-signature`)

## Files
- `index.js`: Main server code.
- `data.json`: Stores the latest webhook payload received.
- `headers.json`: Stores the headers of the latest webhook request.

## Requirements
- Node.js
- npm

## License
ISC

## Files
- `index.js`: Main server code.
- `data.json`: Stores the latest webhook payload received.
- `headers.json`: Stores the headers of the latest webhook request.

## Requirements
- Node.js
- npm

## License
ISC
