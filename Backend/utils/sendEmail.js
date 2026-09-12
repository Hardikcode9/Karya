const nodemailer = require("nodemailer");

/**
 * Configure Nodemailer transporter.
 * Works with Gmail App Passwords, Brevo, or generic SMTP hosts.
 */
function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // Custom SMTP host or default to Gmail
  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Sends a 6-digit login OTP email to the user.
 * @param {string} toEmail - Recipient email
 * @param {string} otpCode - 6-digit numeric OTP
 * @param {string} userName - Optional user's name
 * @param {string} userRole - Role (Customer, Worker, SHG Group)
 */
const sendOtpEmail = async (toEmail, otpCode, userName = "User", userRole = "Customer") => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  // Log in terminal for development visibility
  console.log("\n=================================================");
  console.log(`✉️  KARYA OTP DISPATCH`);
  console.log(`To: ${toEmail} (${userName} - ${userRole})`);
  console.log(`OTP Code: ${otpCode}`);
  console.log(`Expires in: 5 Minutes`);
  console.log("=================================================\n");

  // If SMTP credentials are dummy or missing, don't crash - allow developer to test
  if (!user || !pass || pass.includes("your_") || pass === "") {
    console.warn("⚠️  EMAIL_USER or EMAIL_PASS not set in Backend/.env. Using console OTP display for development.");
    return { devMode: true, message: "OTP logged to server terminal" };
  }

  const transporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Karya Portal" <${user}>`,
    to: toEmail,
    subject: `Your Karya Verification Code: ${otpCode}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FBF7EE; margin: 0; padding: 20px; color: #1e293b; }
          .container { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 20px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 28px; font-weight: bold; color: #526B3C; margin: 0; }
          .tagline { font-size: 12px; color: #64748b; margin-top: 4px; }
          .card { background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; padding: 24px; text-align: center; margin: 20px 0; }
          .otp-box { font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #526B3C; background: #EEF5E6; padding: 14px 20px; border-radius: 10px; display: inline-block; margin: 16px 0; border: 1px solid #C8DEC0; }
          .expiry { font-size: 13px; color: #ef4444; font-weight: 600; }
          .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">Karya</h1>
            <p class="tagline">Local skills. Better opportunities.</p>
          </div>
          
          <p>Hello <strong>${userName}</strong>,</p>
          <p>Use the verification code below to complete your login as <strong>${userRole}</strong> on the Karya Portal:</p>
          
          <div class="card">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">Your 6-Digit Code</div>
            <div class="otp-box">${otpCode}</div>
            <div class="expiry">⏱ Valid for 5 minutes only</div>
          </div>
          
          <p style="font-size: 13px; color: #64748b;">If you did not request this verification code, please ignore this email or contact support if you suspect unauthorized access.</p>
          
          <div class="footer">
            © ${new Date().getFullYear()} Karya Digital Public Infrastructure Platform.<br>
            Direct village payouts & zero middleman deductions.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${toEmail}! MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`❌ SMTP Error when sending to ${toEmail}:`, err.message);
    if (err.code === "EAUTH") {
      console.warn("⚠️  Google Authentication Failed (BadCredentials). The EMAIL_USER must match the exact account where the 16-letter App Password was generated.");
    }
    return { success: false, error: err.message, devMode: true };
  }
};

module.exports = { sendOtpEmail };
