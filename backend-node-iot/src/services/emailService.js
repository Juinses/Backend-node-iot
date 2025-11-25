import nodemailer from "nodemailer";

const {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USER,
    MAIL_PASS,
    MAIL_FROM_NAME,
    MAIL_FROM_EMAIL,
} = process.env;

// 1. Crear el transporter (conexión SMTP)
const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT) || 2525,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
    },
});

// 2. Función genérica para enviar correo
export async function sendEmail({ to, subject, html, text }) {
    const from = MAIL_FROM_NAME
        ? `${MAIL_FROM_NAME} <${MAIL_FROM_EMAIL}>`
        : MAIL_FROM_EMAIL;

    const mailOptions = {
        from,
        to,
        subject,
        text,
        html,
    };

   transporter.verify((error, success) => {
        if (error) {
            console.error('Error al conectar con SMTP:', error);
        } else {
            console.log('SMTP listo para enviar correos');
        }
    });
    // Enviamos el correo
    const info = await transporter.sendMail(mailOptions); 
    
    console.log("Correo enviado:", info.messageId);
    return info;
}

// 3. Función específica para enviar código de recuperación
export async function sendRecoveryCodeEmail(toEmail, code) {
    const subject = "Código de recuperación de contraseña";

    const text = `Tu código de recuperación es: ${code}`;

    const html = `
    <h2>Recuperación de contraseña</h2>
    <p>Hemos recibido una solicitud para recuperar tu contraseña.</p>
    <p>Tu código es: <b>${code}</b></p>
    <p>Este código tiene una vigencia de <b>1 minuto</b>.</p>
  `;

    return sendEmail({
        to: toEmail,
        subject,
        text,
        html,
    });
}

