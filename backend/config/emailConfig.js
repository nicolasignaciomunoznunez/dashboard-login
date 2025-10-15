// config/emailConfig.js - VERSIÓN FINAL FUNCIONANDO
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configuración QUE SÍ FUNCIONA (probada)
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ CONEXIÓN GMAIL ESTABLECIDA');
    console.log('   Servicio: Gmail');
    console.log('   Cuenta:', process.env.EMAIL_USER);
    return true;
  } catch (error) {
    console.error('❌ ERROR CONEXIÓN GMAIL:', error.message);
    return false;
  }
};

export default transporter;