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

2. O plano de Mínimo: 0 dias
Máximo: 30 dias deve ser diferente para cada canal:
- Instagram = reels, stories, carrosséis
- YouTube = vídeos, shorts e lives
- WhatsApp = listas, grupos e mensagens
- Blog = artigos e SEO

3. O obstáculo deve influenciar toda a estratégia.

Exemplos:

Se obstáculo = nao_saber_criar
→ sugerir Canva, ChatGPT e conteúdo simples.

Se obstáculo = nao_vender
→ foco em copy e fechamento.

Se obstáculo = produto_errado
→ foco em validação de produto.

Se obstáculo = tempo
→ foco em automação e produtividade.

4. A comissão deve ser realista.

5. A conversão deve ser um percentual curto:
Exemplo:
"2.5%"
"4.1%"
"3.8%"

6. A copy deve ser totalmente diferente para cada nicho.

7. Em "ia_ajuda" gere exatamente 5 itens.

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