import nodemailer, { Transport } from "nodemailer";
import ejs from "ejs";
import path from "path";

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gamil.com",
    port: 465,
    service: "gmail",
    auth: {
      user: "ms7500746@gmail.com",
      pass: "uuftfiyiivxdxkrm",
    },
  });
  const { email, subject, template, data } = options;

  const templetPath = path.join(__dirname, "../mails/", template);
  const html: string = await ejs.renderFile(templetPath, data);

  const mailOptions = {
    from: "ms7500746@gmail.com",
    to: email,
    subject,
    html,
  };
  await transporter.sendMail(mailOptions);
};
export default sendMail;
