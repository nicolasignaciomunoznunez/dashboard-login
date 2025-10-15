// test-rv-templates.js
import { EmailService } from './services/emailService.js';

async function testRVTemplates() {
  console.log('🧪 PROBANDO PLANTILLAS R&V SPA\n');
  
  try {
    // 1. Probar email de verificación
    console.log('1. 📧 Probando email de verificación R&V SPA...');
    await EmailService.sendVerificationEmail(
      'munoznuneznicolas@gmail.com',
      '987654',
      'Nicolas Test'
    );
    
    // 2. Probar email de bienvenida
    console.log('\n2. 🎉 Probando email de bienvenida R&V SPA...');
    await EmailService.sendWelcomeEmail(
      'munoznuneznicolas@gmail.com',
      'Nicolas Test'
    );
    
    // 3. Probar email de restablecimiento
    console.log('\n3. 🔑 Probando email de restablecimiento R&V SPA...');
    await EmailService.sendPasswordResetEmail(
      'munoznuneznicolas@gmail.com',
      'test-token-123',
      'Nicolas Test'
    );
    
    console.log('\n🎊 ¡PLANTILLAS R&V SPA FUNCIONANDO PERFECTAMENTE!');
    
  } catch (error) {
    console.log('❌ Error probando plantillas:', error.message);
  }
}

testRVTemplates();