using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public interface IEmailService
    {
        Task<bool> SendPasswordResetEmailAsync(string email, string username, string token, string callbackUrl);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _smtpUsername;
        private readonly string _smtpPassword;
        private readonly string _senderEmail;
        private readonly string _senderName;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            
            // Obtener configuración del email desde appsettings.json
            _smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.example.com";
            _smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
            _smtpUsername = _configuration["EmailSettings:Username"] ?? "user@example.com";
            _smtpPassword = _configuration["EmailSettings:Password"] ?? "password";
            _senderEmail = _configuration["EmailSettings:SenderEmail"] ?? "no-reply@digitalmedsuite.com";
            _senderName = _configuration["EmailSettings:SenderName"] ?? "DigitalMedSuite";
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email, string username, string token, string callbackUrl)
        {
            try
            {
                string resetLink = $"{callbackUrl}?token={token}";
                
                string subject = "Recuperación de Contraseña - DigitalMedSuite";
                string body = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #4a00e0, #8e2de2); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }}
                        .content {{ padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px; }}
                        .button {{ display: inline-block; background: linear-gradient(to right, #4a00e0, #8e2de2); color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0; }}
                        .footer {{ margin-top: 20px; font-size: 12px; color: #777; text-align: center; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h2>Recuperación de Contraseña</h2>
                        </div>
                        <div class='content'>
                            <p>Hola <strong>{username}</strong>,</p>
                            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en DigitalMedSuite.</p>
                            <p>Para continuar con este proceso, por favor haz clic en el siguiente botón:</p>
                            <p style='text-align: center;'><a href='{resetLink}' class='button'>Restablecer mi contraseña</a></p>
                            <p>O copia y pega el siguiente enlace en tu navegador:</p>
                            <p><a href='{resetLink}'>{resetLink}</a></p>
                            <p>Si no has solicitado este cambio, puedes ignorar este correo.</p>
                            <p>Este enlace expirará en 24 horas por razones de seguridad.</p>
                            <p>Tu token de recuperación es: <strong>{token}</strong></p>
                            <p>Saludos,<br>El equipo de DigitalMedSuite</p>
                        </div>
                        <div class='footer'>
                            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                        </div>
                    </div>
                </body>
                </html>";

                MailMessage message = new MailMessage
                {
                    From = new MailAddress(_senderEmail, _senderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true
                };

                message.To.Add(new MailAddress(email, username));

                using (SmtpClient client = new SmtpClient(_smtpServer, _smtpPort))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(_smtpUsername, _smtpPassword);
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;

                    await client.SendMailAsync(message);
                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al enviar email: {ex.Message}");
                return false;
            }
        }
    }
}