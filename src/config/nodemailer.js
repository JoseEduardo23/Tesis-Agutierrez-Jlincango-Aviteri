import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config()


let transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.HOST_MAILTRAP,
  port: process.env.PORT_MAILTRAP,
  auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
  }
});

const sendMailToUser = (userMail, token) => {

  let mailOptions = {
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: "Verifica tu cuenta",
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


  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });
};


const sendMailToRecoveryPassword = async (userMail, token) => {
  let info = await transporter.sendMail({
    from: 'admin@tesis.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
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
  console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}


export {
  sendMailToUser,
  sendMailToRecoveryPassword,
}
