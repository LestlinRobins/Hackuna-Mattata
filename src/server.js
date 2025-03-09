const express = require("express");
const twilio = require("twilio");
require("dotenv").config();

const app = express();
app.use(express.json());

// Twilio Credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; 

console.log("📌 TWILIO_ACCOUNT_SID:", accountSid);
console.log("📌 TWILIO_AUTH_TOKEN:", authToken ? "Loaded" : "Not Loaded");
console.log("📌 TWILIO_PHONE_NUMBER:", twilioPhoneNumber);

const client = twilio(accountSid, authToken);

app.post("/make-call", async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ error: "Missing 'to' phone number" });
  }

  console.log("🔍 Calling...");
  console.log("  From:", twilioPhoneNumber);
  console.log("  To:", to);

  try {
    const call = await client.calls.create({
      twiml: "<Response><Say>Hello, this is a test call from Twilio!</Say></Response>",
      to: to,
      from: twilioPhoneNumber, // This should be correctly set
    });

    res.status(200).json({ message: "Call initiated", callSid: call.sid });
  } catch (error) {
    console.error("🚨 Twilio Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

