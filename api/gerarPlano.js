export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {

    const { nicho, canal, obstaculo } = req.body;

    const prompt = `
Você é um especialista da YouShop.

Analise o perfil abaixo e gere um plano extremamente personalizado.

PERFIL:

Nicho: ${nicho}
Canal: ${canal}
Obstáculo: ${obstaculo}

REGRAS OBRIGATÓRIAS:

1. O produto recomendado deve estar diretamente relacionado ao nicho informado.

2. Gere entre 5 e 10 ações.

3. Escolha um prazo realista entre 0 e 30 dias.

4. Retorne o prazo em:

"tempo_estimado"

5. Cada ação deve ter no máximo 1 frase.

6. O plano deve ser objetivo e fácil de executar.

7. A copy deve ser totalmente diferente para cada nicho.

8. Não use markdown (**).

9. Não use listas dentro das ações.

10. Em "ia_ajuda" gere exatamente 5 itens.

RESPONDA SOMENTE COM JSON VÁLIDO.

{
  "produto":"...",
  "comissao":"...",
  "conversao":"...",
  "tempo_estimado":"...",
  "plano":["..."],
  "copy":"...",
  "ia_ajuda":["..."]
}
`;

    const resposta = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const dados = await resposta.json();
    console.log(JSON.stringify(dados, null, 2));

    console.log("Gemini respondeu:", JSON.stringify(dados));

    return res.status(200).json(dados);

  } catch (erro) {

    console.error("ERRO:", erro);

    return res.status(500).json({
      erro: erro.message
    });
  }
}