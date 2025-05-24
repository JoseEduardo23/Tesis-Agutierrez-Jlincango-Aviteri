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
         <h1>Sistema de prueba (TIENDANIMAL - 🛒🐶🦴)</h1> <br>
        <p>Hola, haz clic <a href="${process.env.URL_FRONTEND}/confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
    };
    

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
};


const sendMailToRecoveryPassword = async (userMail, token) => {
    try {
        const recoveryUrl = `${process.env.URL_FRONTEND}/recuperar-password/${token}`;
        
        console.log("Preparando email con URL:", recoveryUrl); // Debug
        
        const info = await transporter.sendMail({
            from: `"TiendaAnimal" <${process.env.USER_MAILTRAP}>`,
            to: userMail,
            subject: "Restablece tu contraseña",
            html: `<p>Haz clic <a href="${recoveryUrl}">aquí</a> para restablecer tu contraseña.</p>`
        });
        
        console.log("Email enviado con ID:", info.messageId);
        return true;
        
    } catch (error) {
        console.error("Error al enviar email:", error);
        throw new Error("Fallo al enviar el email: " + error.message);
    }
};


export {
    sendMailToUser,
    sendMailToRecoveryPassword,
}
