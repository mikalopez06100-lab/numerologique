// Service d'envoi d'email

import nodemailer from 'nodemailer';

interface EmailConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  auth?: {
    user: string;
    pass: string;
  };
}

/**
 * Crée un transporteur email
 */
function createTransporter() {
  // Configuration pour différents services
  const emailService = process.env.EMAIL_SERVICE || 'gmail';
  
  if (emailService === 'resend') {
    // Resend utilise une API, pas SMTP classique
    // On utilisera leur SDK plus tard
    return null;
  }

  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  };

  if (!config.auth?.user || !config.auth?.pass) {
    console.warn('⚠️ Configuration SMTP incomplète. Les emails ne seront pas envoyés.');
    return null;
  }

  return nodemailer.createTransport(config);
}

/**
 * Envoie un email avec un lien de connexion
 */
export async function sendAuthEmail(email: string, token: string): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('❌ Transporteur email non configuré');
    return false;
  }

  // Détecter automatiquement l'URL de base (pour Vercel)
  const baseUrl = 
    process.env.NEXT_PUBLIC_BASE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` :
    'http://localhost:3001'));
  const authUrl = `${baseUrl}/auth/verify?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Numerologie App <noreply@numerologie.app>',
      to: email,
      subject: '🔮 Accédez à votre analyse numérologique',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background: #9333ea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔮 Votre Analyse Numérologique</h1>
            <p>Bonjour,</p>
            <p>Cliquez sur le bouton ci-dessous pour accéder à votre analyse numérologique personnalisée :</p>
            <a href="${authUrl}" class="button">Accéder à mon analyse</a>
            <p>Ce lien est valide pendant 15 minutes.</p>
            <p class="footer">Si vous n'avez pas demandé cette analyse, vous pouvez ignorer cet email.</p>
          </div>
        </body>
        </html>
      `,
      text: `Accédez à votre analyse numérologique : ${authUrl}`,
    });

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return false;
  }
}

/**
 * Envoie l'analyse par email avec le PDF en pièce jointe
 */
export async function sendAnalysisEmail(
  email: string,
  pdfBuffer: Buffer,
  prenom: string,
  nom: string
): Promise<boolean> {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.error('❌ Transporteur email non configuré');
    return false;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Numerologie App <noreply@numerologie.app>',
      to: email,
      subject: `🔮 Votre analyse numérologique - ${prenom} ${nom}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🔮 Votre Analyse Numérologique</h1>
            <p>Bonjour ${prenom},</p>
            <p>Votre analyse numérologique personnalisée est prête !</p>
            <p>Vous trouverez le document PDF en pièce jointe.</p>
            <p>Merci d'avoir utilisé notre service.</p>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `analyse-numerologique-${prenom}-${nom}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email avec PDF:', error);
    return false;
  }
}
