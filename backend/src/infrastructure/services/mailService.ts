import nodemailer,{Transporter} from 'nodemailer'

import configKeys from '../config/config'

export class MailService{
    private transporter:nodemailer.Transporter
constructor(){
this.transporter=nodemailer.createTransport({
     host:'smtp.gmail.com',
     port:587,
     secure: false,

    auth:{
        user:configKeys.SERVER_EMAIL,
        pass:configKeys.SERVER_PASS
    },
    debug: true,  // Enable debugging output
    logger: true,
})}

async sendMail(username:string,email:string,otp:string):Promise<any>
{
    console.log(email,configKeys.SERVER_EMAIL,"email to and from");
    
    const mailOptions={
        from:configKeys.SERVER_EMAIL,
        to:email,
        subject:"Account verification",
        html:`<p> hlo ${username} we have sent an otp to verify your mail here is ${otp}`
    }

    try
    {
        //console.log("jfh",mailOptions);
        
        const result=await this.transporter.sendMail(mailOptions)
        //console.log(result,"bbjhb");
        
        return result
    }
    catch(error)
    {
        console.log("sending error mail",error);
        
    }
}

async sendApprovalMail(theatreName: string, email: string): Promise<any> {
    const mailOptions = {
        from: configKeys.SERVER_EMAIL,
        to: email,
        subject: "Theatre Approval Notification",
        html: `<p>Dear ${theatreName},</p>
               <p>Congratulations! Your theatre has been <strong>approved</strong>. You can now access and manage your theatre through our platform.</p>
               <p>Thank you for joining us!</p>
               <p>Best regards,<br/>The Admin Team</p>`,
    };

    try {
        const result = await this.transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("Error sending approval email:", error);
    }
}

// Method to send decline email
async sendDeclineMail(theatreName: string, email: string): Promise<any> {
    const mailOptions = {
        from: configKeys.SERVER_EMAIL,
        to: email,
        subject: "Theatre Decline Notification",
        html: `<p>Dear ${theatreName},</p>
               <p>We regret to inform you that your theatre has been <strong>declined</strong> after a careful review. If you have any questions or need further information, feel free to contact our support team.</p>
               <p>We appreciate your interest and hope you apply again in the future.</p>
               <p>Best regards,<br/>The Admin Team</p>`,
    };

    try {
        const result = await this.transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("Error sending decline email:", error);
    }
}

}


