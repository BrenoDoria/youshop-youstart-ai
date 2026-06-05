export default async function handler(req, res) {

  const { nicho, canal, obstaculo } = req.body;

  const prompt = `
  Nicho: ${nicho}
  Canal: ${canal}
  Obstáculo: ${obstaculo}

  Gere:
  Produto recomendado
  Plano de 7 dias
  Copy
  Como IA ajuda
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
  try {
    const dados = await resposta.json();
  }
  catch(error){
    console.error(error);

    return res.status(500).json({
        erro: "Falha ao gerar plano"
    });
  }

}