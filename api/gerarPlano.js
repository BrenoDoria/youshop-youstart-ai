export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {

    const { nicho, canal, obstaculo } = req.body;

    const prompt = `
Nicho: ${nicho}
Canal: ${canal}
Obstáculo: ${obstaculo}

Responda APENAS com JSON válido.

{
  "produto":"...",
  "comissao":"...",
  "conversao":"...",
  "plano7dias":["..."],
  "copy":"...",
  "ia_ajuda":["..."]
}
`;

    const resposta = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    console.log("Gemini respondeu:", JSON.stringify(dados));

    return res.status(200).json(dados);

  } catch (erro) {

    console.error("ERRO:", erro);

    return res.status(500).json({
      erro: erro.message
    });
  }
}