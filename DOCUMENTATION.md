# Code Collective Email Server

## Overview
This server exposes a single endpoint that accepts contact form data and sends two emails:
- An auto‑reply to the client
- A notification to the admin

## Requirements
- Node.js 18+
- A Brevo SMTP account
- Verified sender email in Brevo

## Environment Variables
Create a `.env` file with the following values:

- `PORT` — Server port (default: 3000)
- `SMTP_HOST` — Brevo SMTP host (e.g., `smtp-relay.brevo.com`)
- `SMTP_PORT` — SMTP port (e.g., `587`)
- `SMTP_SECURE` — `true` for port 465, otherwise `false`
- `SMTP_USER` — Brevo SMTP login
- `SMTP_PASS` — Brevo SMTP key
- `FROM_EMAIL` — Verified sender email (used in the `from` field)
- `ADMIN_EMAIL` — Admin email to receive notifications
- `FRONTEND_ORIGIN` — Optional single allowed origin for CORS if you prefer env-based config

Example:

```
PORT=3000
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-login@smtp-brevo.com
SMTP_PASS=your-smtp-key
FROM_EMAIL=verified@yourdomain.com
ADMIN_EMAIL=you@yourdomain.com
FRONTEND_ORIGIN=https://codecollective-tech.netlify.app
```

## Start the Server
Install dependencies and start:

```
npm install
node index.js
```

You should see:

```
Server is running on port 3000
SMTP server is ready
```

## API Endpoint
### POST /send-email
**Request body (JSON):**

- `name` (string, required)
- `email` (string, required)
- `message` (string, required)

**Success response (200):**

```
{
  "success": true,
  "message": "Emails sent successfully"
}
```

**Error responses:**
- `400` if any field is missing
- `500` if SMTP fails

## Connect From a Frontend
The frontend should send a JSON POST request to the server.

### Example (Fetch API)

```
async function sendContactForm(payload) {
  const res = await fetch('http://localhost:3000/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Request failed')
  }

  return res.json()
}

// Usage
sendContactForm({
  name: 'Jane Doe',
  email: 'jane@example.com',
  message: 'Hello!'
})
  .then(console.log)
  .catch(console.error)
```

### Example (Axios)

```
import axios from 'axios'

export async function sendContactForm(payload) {
  const { data } = await axios.post('http://localhost:3000/send-email', payload, {
    headers: { 'Content-Type': 'application/json' }
  })
  return data
}
```

## CORS Notes
If your frontend runs on a different origin (e.g., `https://codecollective-tech.netlify.app`), you must allow it with CORS. This server currently allows:
- `https://codecollective-tech.netlify.app`
- `http://localhost:3000`
- `http://localhost:5173`

Update the list in the server if you need other origins.

Common options:
- Add CORS middleware to the server
- Use a development proxy in the frontend (Vite, Next.js, CRA, etc.)

## Troubleshooting
- If SMTP verification fails, check host, port, user, pass, and `SMTP_SECURE`.
- If emails are not delivered, ensure `FROM_EMAIL` is verified in Brevo.
- Check Brevo Email Activity/Logs for rejects or bounces.

## Deploy to Vercel

1. Install Vercel CLI (optional):
   ```
   npm i -g vercel
   ```

2. Push your code to GitHub/GitLab/Bitbucket

3. Go to [vercel.com](https://vercel.com) and import your repository

4. Configure environment variables in Vercel project settings:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `FROM_EMAIL`
   - `ADMIN_EMAIL`

5. Deploy

Your endpoint will be: `https://your-project.vercel.app/send-email`

Update the `allowedOrigins` array in [index.js](index.js) if you need to allow your production domain.
