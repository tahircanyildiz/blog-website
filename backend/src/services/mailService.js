const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

/**
 * Yeni iletişim mesajı geldiğinde admin'e bildirim maili gönderir
 */
const sendContactNotification = async ({ name, email, message }) => {
  const sentFrom = new Sender(
    process.env.MAILERSEND_FROM_EMAIL,
    process.env.MAILERSEND_FROM_NAME || 'Website'
  );

  const recipients = [
    new Recipient(process.env.MAILERSEND_TO_EMAIL, 'Admin')
  ];

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #40916c, #2d6a4f); padding: 24px; border-radius: 12px 12px 0 0;">
        <h2 style="color: white; margin: 0; font-size: 20px;">📬 Yeni İletişim Mesajı</h2>
      </div>
      <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; width: 100px; vertical-align: top;">
              <strong style="color: #374151;">İsim</strong>
            </td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
              <strong style="color: #374151;">E-posta</strong>
            </td>
            <td style="padding: 10px 0; font-size: 14px;">
              <a href="mailto:${email}" style="color: #40916c;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 14px; vertical-align: top;">
              <strong style="color: #374151;">Mesaj</strong>
            </td>
            <td style="padding: 10px 0; color: #111827; font-size: 14px; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
          <a href="mailto:${email}"
             style="display: inline-block; background: #40916c; color: white; padding: 10px 20px;
                    border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">
            Yanıtla
          </a>
        </div>
      </div>
    </div>
  `;

  const textContent = `Yeni İletişim Mesajı\n\nİsim: ${name}\nE-posta: ${email}\nMesaj:\n${message}`;

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(`Yeni Mesaj: ${name}`)
    .setHtml(htmlContent)
    .setText(textContent);

  await mailerSend.email.send(emailParams);
};

module.exports = { sendContactNotification };
