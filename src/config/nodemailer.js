import nodemailer from "nodemailer"
import dotenv from "dotenv";
//
dotenv.config();

// Configuración para producción (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Tu email de Gmail completo
    pass: process.env.GMAIL_APP_PASSWORD // Contraseña de aplicación (16 dígitos)
  }
});

// Verificación de conexión al iniciar
transporter.verify((error) => {
  if (error) {
    console.error('❌ Error al configurar el transporte de emails:', error);
  } else {
    console.log('✔ Servicio de emails configurado correctamente');
  }
});

const sendMailToUser = (userMail, token) => {
  const mailOptions = {
    from: `"TiendaAnimal" <${process.env.GMAIL_USER}>`, // Usa el mismo email autorizado
    to: userMail,
    subject: "Verifica tu cuenta en TiendaAnimal",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4CAF50;">¡Bienvenido a TiendaAnimal! 🛒🐶🦴</h1>
        <p>Para completar tu registro, por favor confirma tu cuenta haciendo clic en el siguiente enlace:</p>
        <a href="${process.env.URL_FRONTEND}/confirmar/${encodeURIComponent(token)}" 
           style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; 
                  color: white; text-decoration: none; border-radius: 5px;">
          Confirmar mi cuenta
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">
          Si no solicitaste este registro, por favor ignora este mensaje.
        </p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error('❌ Error al enviar email de confirmación:', error);
    } else {
      console.log('✅ Email de confirmación enviado:', info.messageId);
    }
  });
};

const sendMailToRecoveryPassword = async (userMail, token) => {
  try {
    const info = await transporter.sendMail({
      from: `"Soporte TiendaAnimal" <${process.env.GMAIL_USER}>`, // Email autorizado
      to: userMail,
      subject: "Restablece tu contraseña en TiendaAnimal",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #FF5722;">Recuperación de contraseña (> - <)</h1>
          <p>Haz clic en el botón para restablecer tu contraseña:</p>
          <a href="${process.env.URL_FRONTEND}/recuperar-password/${token}"
             style="display: inline-block; padding: 10px 20px; background-color: #FF5722; 
                    color: white; text-decoration: none; border-radius: 5px;">
            Restablecer contraseña
          </a>
          <p style="font-size: 12px; color: #777;">
            Este enlace expirará en 15 minutos. Si no solicitaste este cambio, ignora este email.
          </p>
        </div>
      `
    });
    console.log("✅ Email de recuperación enviado:", info.messageId);
  } catch (error) {
    console.error("❌ Error al enviar email de recuperación:", error);
    throw error;
  }
};

export {
  sendMailToUser,
  sendMailToRecoveryPassword
};