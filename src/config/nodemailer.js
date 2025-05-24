import nodemailer from "nodemailer"
import dotenv from "dotenv";

dotenv.config()


let transporter = nodemailer.createTransport({
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

const sendMailToUser = async (userMail, token) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.USER_MAILTRAP,
            to: userMail,
            subject: "Verifica tu cuenta",
            html: `
                <h1>Sistema de prueba (TIENDANIMAL - 🛒🐶🦴)</h1><br>
                <p>Hola, haz clic <a href="${process.env.URL_FRONTEND}confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>
            `,
        });
        console.log("Correo enviado: ", info.messageId);
    } catch (error) {
        console.error("Error al enviar correo: ", error.message);
        throw new Error("No se pudo enviar el correo de confirmación");
    }
};


const sendMailToRecoveryPassword = async (userMail, token) => {
    let info = await transporter.sendMail({
        from: 'admin@tesis.com',
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
    <h1>Sistema de prueba (TIENDANIMAL (> - <) )</h1>
    <hr>
    <a href=${process.env.URL_FRONTEND}recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>Te damos la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}


export {
    sendMailToUser,
    sendMailToRecoveryPassword,
}
