// gmail-diagnostic.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 DIAGNÓSTICO GMAIL COMPLETO');
console.log('===============================');

// Verificar todas las posibles causas
const diagnosticChecks = [
  {
    name: 'Variables de entorno',
    check: () => {
      if (!process.env.EMAIL_USER) return 'EMAIL_USER no configurado';
      if (!process.env.EMAIL_APP_PASSWORD) return 'EMAIL_APP_PASSWORD no configurado';
      if (process.env.EMAIL_APP_PASSWORD.includes(' ')) return 'EMAIL_APP_PASSWORD tiene espacios';
      if (process.env.EMAIL_APP_PASSWORD.length !== 16) return `EMAIL_APP_PASSWORD debe tener 16 caracteres (tiene ${process.env.EMAIL_APP_PASSWORD.length})`;
      return 'OK';
    }
  },
  {
    name: 'Formato de email',
    check: () => {
      const email = process.env.EMAIL_USER;
      if (!email.includes('@gmail.com')) return 'El email debe ser @gmail.com';
      return 'OK';
    }
  }
];

// Ejecutar diagnósticos
diagnosticChecks.forEach(check => {
  const result = check.check();
  console.log(`📋 ${check.name}: ${result === 'OK' ? '✅' : '❌'} ${result}`);
});

console.log('\n🔐 Probando autenticación...');