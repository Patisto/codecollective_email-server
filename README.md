AUTHOR : PATRICK
# CodeCollective Email Server

Node.js email server for **CodeCollective**. Handles email sending and related endpoints for the platform.

---

## 🚀 Features
* **Email delivery service**
* **Simple HTTP API**
* **Vercel-ready deployment**

## 🛠 Tech Stack
* **Node.js**
* **Express**
* **Vercel**

---

## 🏁 Getting Started

### Prerequisites
* Node.js 18+

### Install
1. Clone the repo
2. Install dependencies:
   ```bash
   npm install

```

### Environment Variables

Create a `.env` file with your email provider credentials:

| Variable | Description |
| --- | --- |
| `SMTP_HOST` | Your SMTP server address |
| `SMTP_PORT` | Typically 587 or 465 |
| `SMTP_USER` | Your account username |
| `SMTP_PASS` | Your account password |
| `FROM_EMAIL` | The "sender" address |

### Run Locally

```bash
npm start

```

---

## 📦 Deployment

**Deploy with Vercel:**

1. Ensure environment variables are set in Vercel settings.
2. Push to GitHub and connect the repo.

## 📡 API

* `POST /send` - Example endpoint for sending email.

## 📄 License

[MIT](https://www.google.com/search?q=LICENSE)

## 👥 Contact

**CodeCollective Team** codecollective.dev@gmail.com

