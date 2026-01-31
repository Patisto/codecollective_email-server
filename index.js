require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')

const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP verify failed:', error)
  } else {
    console.log('SMTP server is ready')
  }
})

const allowedOrigins = [
  'https://codecollective-tech.netlify.app',
  'http://localhost:3000',
  'http://localhost:5173'
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
  })
)
app.use(express.json())

app.post('/send-email', async function (req, res) {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    // 1️⃣ Email to CLIENT
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER
    await transporter.sendMail({
      from: `"Code Collective" <${fromEmail}>`,
      to: email,
      replyTo: process.env.ADMIN_EMAIL,
      subject: 'We received your message',
      html: `
        <h2>Hello ${name},</h2>
        <p>Thanks for contacting us.</p>
        <p>We received your message:</p>
        <blockquote>${message}</blockquote>
        <p>We’ll get back to you shortly.</p>
      `
    })

    // 2️⃣ Email to YOU (ADMIN)
    await transporter.sendMail({
      from: `"Website Contact" <${fromEmail}>`,
      to: process.env.ADMIN_EMAIL,
      replyTo: email,
      subject: 'New client message',
      html: `
        <h3>New Message Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    })

    res.json({ success: true, message: 'Emails sent successfully' })
  } catch (error) {
    console.error('Send failed:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

module.exports = app