import nodemailer from "nodemailer"
import {google } from "googleapis"
import {activateEmailTemp} from "../emails/activateEmailTemplate"
const {OAuth2} = google.auth;
const OATH_PLAYGROUND = "https://developers.google.com/oauthplayground"

const {
    MAILING_SERVICE_CLIENT_SECRET,MAILING_SERVICE_CLIENT_ID,MAILING_SERVICE_REFRESH_TOKEN,
    SENDER_EMAIL_ADDRESS
} = process.env 

const oauth2Client = new OAuth2({
    clientId: MAILING_SERVICE_CLIENT_ID,
    clientSecret: MAILING_SERVICE_CLIENT_SECRET,
    refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
    access_type: OATH_PLAYGROUND
    
});

//send email

export const sendEmail= (to,url,txt,subject)=>{
 oauth2Client.setCredentials({
     refresh_token:MAILING_SERVICE_REFRESH_TOKEN
 });
 const accessToken = oauth2Client.getAccessToken();
 const smtpTransport = nodemailer.createTransport({
     service:"gmail",
     auth:{
         type:"OAuth2",
         user:SENDER_EMAIL_ADDRESS,
         clientId:MAILING_SERVICE_CLIENT_ID,
         clientSecret:MAILING_SERVICE_CLIENT_SECRET,
         refreshToken:MAILING_SERVICE_REFRESH_TOKEN,
         accessToken
     }
 });
 const mailOptions = {
     from:SENDER_EMAIL_ADDRESS,
     to:to,
     subject:subject,
     html:activateEmailTemp(to,url),

 }
 smtpTransport.sendMail(mailOptions,(err,info)=>{
     if(err){
         return err;
     }
     return info
 })
}