import type { FastifyInstance } from "fastify";
import z from "zod";
import { env } from "../env";
import { isDevelopment } from "../utils/chose-environment";

export async function rootRoute(app: FastifyInstance) {
	app.get(
		"/",
		{
			schema: {
				tags: ["root"],
				response: {
					201: z.string(),
				},
			},
		},
		async (request, reply) => {
			const docsUrl = isDevelopment()
				? `http://localhost:${env.PORT}/docs`
				: `${env.PRODUCTION_URL}/docs`;

			const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nekso API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
            text-align: center;
        }
        .version {
            color: #999;
            text-align: center;
            margin-bottom: 30px;
            font-size: 0.9em;
        }
        p {
            color: #555;
            line-height: 1.6;
            margin-bottom: 20px;
            text-align: center;
        }
        .status {
            background: #e8f5e9;
            color: #2e7d32;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 30px;
            font-weight: 600;
        }
        .links {
            display: flex;
            gap: 15px;
            flex-direction: column;
        }
        a {
            display: block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 10px;
            text-align: center;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        a:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        .secondary {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .info {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #eee;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            color: #666;
        }
        .info-label {
            font-weight: 600;
            color: #333;
        }
        .contacts {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid #eee;
        }
        .contacts h2 {
            color: #667eea;
            font-size: 1.5em;
            margin-bottom: 20px;
            text-align: center;
        }
        .contact-links {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
        }
        .contact-links a {
            padding: 10px 20px;
            font-size: 0.9em;
            flex: 1;
            min-width: 150px;
        }
        .github {
            background: linear-gradient(135deg, #24292e 0%, #000000 100%);
        }
        .linkedin {
            background: linear-gradient(135deg, #0077b5 0%, #00669c 100%);
        }
        .email {
            background: linear-gradient(135deg, #ea4335 0%, #c5221f 100%);
        }
        .whatsapp {
            background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Nekso API</h1>
        <div class="version">v0.1.0</div>
        
        <div class="status">
            ✓ API está funcionando perfeitamente
        </div>
        
        <p>
            Bem-vindo à API do Nekso! Esta é uma API RESTful construída com Fastify 
            para gerenciamento de tarefas e sessões de produtividade.
        </p>
        
        <div class="links">
            <a href="${docsUrl}">📚 Documentação da API (Swagger)</a>
            ${isDevelopment() ? '<a href="http://localhost:5173" class="secondary">🌐 Aplicação Web (Dev)</a>' : ""}
        </div>
        
        <div class="info">
            <div class="info-item">
                <span class="info-label">Ambiente:</span>
                <span>${isDevelopment() ? "Desenvolvimento" : "Produção"}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Porta:</span>
                <span>${env.PORT}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Status:</span>
                <span style="color: #2e7d32;">Online</span>
            </div>
        </div>

        <div class="contacts">
            <h2>📞 Contatos</h2>
            <div class="contact-links">
                <a href="https://github.com/AndrewMoreira91" target="_blank" class="github">
                    🐙 GitHub
                </a>
                <a href="https://www.linkedin.com/in/andrew-santos-moreira-998538165/" target="_blank" class="linkedin">
                    💼 LinkedIn
                </a>
                <a href="mailto:andrewmoreira9113@gmail.com" class="email">
                    ✉️ Email
                </a>
                <a href="https://wa.me/5511952684609" target="_blank" class="whatsapp">
                    💬 WhatsApp
                </a>
            </div>
        </div>
    </div>
</body>
</html>
            `;

			return reply.type("text/html").send(html);
		},
	);
}
