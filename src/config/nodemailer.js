import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config()


const transporter = nodemailer.createTransport({
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP, 
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP
    },
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
        const recoveryUrl = `${process.env.URL_FRONTEND}/recuperar-password/${encodeURIComponent(token)}`;
        
        const info = await transporter.sendMail({
            from: `"TiendaAnimal" <${process.env.USER_MAILTRAP}>`,
            to: userMail,
            subject: "Restablece tu contraseña en TiendaAnimal",
            html: `
            <div style="font-family: Arial, sans-serif;">
                <h1 style="color: #ff6b00;">TiendaAnimal 🐾</h1>
                <p>Haz clic en el botón para restablecer tu contraseña:</p>
                <a href="${recoveryUrl}" 
                   style="background: #ff6b00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Restablecer contraseña
                </a>
                <p><small>Si no solicitaste esto, ignora este email.</small></p>
            </div>
            `
        });
        
        console.log("Email enviado:", info.messageId);
        return true;
        
    } catch (error) {
        console.error("Error al enviar email:", error);
        throw error;
    }
};


export {
    sendMailToUser,
    sendMailToRecoveryPassword,
}
