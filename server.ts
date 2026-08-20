import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy GoogleGenAI client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. Technical Copywriting & Specs Generator Endpoint
app.post("/api/ai/copywrite", async (req, res) => {
  try {
    const { category, brand, modelName, rawSpecs, targetChannel, copyTone } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY não configurada. Defina a chave no painel de Segredos/Settings.",
      });
    }

    const systemPrompt = `Você é o principal Arquiteto de Software, Especialista em E-commerce Tech e Copywriter Técnico em português do Brasil.
Sua especialidade exclusiva são dispositivos de tecnologia de ponta: Smartphones, Capinhas de Proteção (Cases) e Fones de Ouvido (Headphones / TWS).

Suas diretrizes fundamentais:
- Responda SEMPRE em português do Brasil com precisão milimétrica em termos técnicos (ex: litografia de semicondutores, taxas de amostragem, codecs de áudio sem perdas, ímãs de Neodímio N52SH, tolerância militar MIL-STD).
- Adote um tom moderno, dinâmico, focado em alta conversão e autoridade em tecnologia.
- Evite jargões vazios ou clichês de marketing genérico (ex: "o melhor da categoria"). Prefira explicar os benefícios a partir da engenharia real dos materiais e componentes.
- Retorne uma estrutura JSON válida.`;

    const userPrompt = `Gere um pacote completo de Copywriting Técnico e Especificações Estruturadas para o seguinte produto tech:

Categoria: ${category || 'Smartphone'}
Marca: ${brand || 'Tech'}
Nome/Modelo: ${modelName || 'Produto'}
Canal de Venda Alvo: ${targetChannel || 'E-commerce Próprio D2C e Marketplaces'}
Tom de Comunicação: ${copyTone || 'Técnico de Alta Conversão com Engenharia de Destaque'}
Especificações Brutas Fornecidas:
${typeof rawSpecs === 'object' ? JSON.stringify(rawSpecs, null, 2) : (rawSpecs || 'Sem especificações prévias')}

Gere uma resposta estritamente no formato JSON com as seguintes chaves:
{
  "marketplaceTitle": "Título otimizado para marketplaces (máx 60-70 caracteres, contendo marca, modelo, atributos chaves e diferencial)",
  "seoMetaTitle": "Título SEO para buscadores (máx 60 caracteres)",
  "seoMetaDescription": "Meta descrição SEO com CTR elevado e chamada para ação (140-160 caracteres)",
  "shortPitch": "Pitch curto de 1 a 2 frases impactantes destacando a engenharia e diferencial do produto",
  "technicalMarkdownDescription": "Descrição técnica completa e formatada em Markdown com títulos de seções (## Visão Geral de Engenharia, ### Performance / Acústica / Proteção, ### Especificações Detalhadas, ### Eficiência Energética / Integração)",
  "keyBenefitsBullets": [
    "Benefício técnico 1 com dados numéricos e engenharia",
    "Benefício técnico 2",
    "Benefício técnico 3",
    "Benefício técnico 4",
    "Benefício técnico 5"
  ],
  "targetAudienceProfile": "Perfil técnico do comprador ideal e dores solucionadas",
  "boxContents": [
    "Item 1 incluso na embalagem",
    "Item 2",
    "Item 3"
  ],
  "compatibilityNotes": "Notas claras de compatibilidade elétrica, física, de protocolos de rede ou acessórios",
  "recommendedTags": ["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const outputText = response.text || "{}";
    const parsedData = JSON.parse(outputText);

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Erro na rota /api/ai/copywrite:", error);
    return res.status(500).json({
      error: error.message || "Falha ao gerar copywriting técnico com IA",
    });
  }
});

// 2. JSON Software Architecture & Payload Generator
app.post("/api/ai/generate-payload", async (req, res) => {
  try {
    const { productData, targetSchema } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY não configurada.",
      });
    }

    const systemPrompt = `Você é um Arquiteto de Software sênior especialista em APIs de E-Commerce, WMS e integrações Omnichannel em Português do Brasil.
Sua tarefa é estruturar payloads JSON robustos, válidos e elegantes que seguem as melhores práticas de Clean Architecture e especificações da indústria de tecnologia.`;

    const userPrompt = `Estruture um payload JSON limpo e completo no formato requerido: "${targetSchema || 'rest_catalog_ingest'}".

Dados do Produto:
${JSON.stringify(productData, null, 2)}

Certifique-se de incluir tipagens corretas (números reais, floats de preço, strings de SKU/EAN, datas ISO 8601 UTC, booleanos) e convenções da categoria (${productData?.category || 'tech'}).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const outputText = response.text || "{}";
    const payloadJson = JSON.parse(outputText);

    return res.json({
      success: true,
      schema: targetSchema,
      payload: payloadJson,
    });
  } catch (error: any) {
    console.error("Erro na rota /api/ai/generate-payload:", error);
    return res.status(500).json({
      error: error.message || "Falha ao gerar payload JSON",
    });
  }
});

// 3. Expert Chat Copilot for E-commerce & Architecture
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, contextProduct } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY não configurada.",
      });
    }

    const systemPrompt = `Você é o Especialista em E-commerce, Arquitetura de Software e Copywriting Técnico da plataforma TechCommerce Studio.
Focado exclusivamente nos 3 nichos de tecnologia:
1. Smartphones (processadores Snapdragon/Apple A-series/Dimensity, memórias LPDDR5X/UFS 4.0, telas OLED/LTPO, conjunto de câmeras e sensores ISOCELL/Sony, 5G, Wi-Fi 7, bateria e carregamento GaN).
2. Capinhas e Acessórios (Kevlar/Fibra de Aramida 1500D, Policarbonato, TPU colmeia, magnetismo MagSafe Neodímio N52SH, padrões militares MIL-STD-810G/H, absorção de choque).
3. Fones de Ouvido (Drivers dinâmicos/planares, diafragmas de fibra de carbono/berílio, cancelamento ativo ANC híbrido adaptativo, DSPs dedicados, codecs LDAC, aptX Adaptive, LC3, áudio espacial e baixa latência).

Diretrizes de resposta:
- Responda SEMPRE em português do Brasil.
- Adote um tom moderno, dinâmico e focado em tecnologia.
- Forneça respostas estruturadas em Markdown ou JSON quando solicitado.
- Seja preciso nas especificações técnicas e evite jargões genéricos sem contexto.
- Quando solicitado esquemas de banco de dados, payloads de API, estratégias de estoque (Safety Stock, Reorder Point, EOQ) ou copywriting de conversão, forneça exemplos prontos para uso em produção.`;

    let conversationText = `Instrução: Atue conforme a persona acima.\n\n`;

    if (contextProduct) {
      conversationText += `[Contexto do Produto Atualmente Selecionado no Studio]:\n${JSON.stringify(contextProduct, null, 2)}\n\n`;
    }

    conversationText += `Histórico da Conversa:\n`;
    for (const msg of messages || []) {
      conversationText += `${msg.role === 'user' ? 'Usuário' : 'Especialista'}: ${msg.content}\n\n`;
    }

    conversationText += `Especialista:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: conversationText,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
      },
    });

    const answer = response.text || "Sem resposta gerada pelo modelo.";

    return res.json({
      success: true,
      message: answer,
    });
  } catch (error: any) {
    console.error("Erro na rota /api/ai/chat:", error);
    return res.status(500).json({
      error: error.message || "Erro ao processar consulta com o especialista",
    });
  }
});

// 4. Inventory Health & Discrepancy Diagnostics
app.post("/api/ai/inventory-analysis", async (req, res) => {
  try {
    const { products } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: "GEMINI_API_KEY não configurada.",
      });
    }

    const systemPrompt = `Você é um Engenheiro de Logística e Arquiteto de WMS/E-commerce especializado em gestão de estoque para bens eletrônicos e de alto giro em Português do Brasil.
Analise a matriz de estoque fornecida e emita um diagnóstico estruturado em JSON com métricas de saúde, alertas de ruptura, capital imobilizado, recomendações de reabastecimento e sugestões de otimização de SKU.`;

    const userPrompt = `Analise a matriz de estoque dos seguintes produtos tech:
${JSON.stringify(products, null, 2)}

Retorne um JSON com a seguinte estrutura:
{
  "inventoryHealthScore": 85,
  "summary": "Resumo executivo do estado do estoque",
  "criticalAlerts": [
    {
      "sku": "SKU-EXEMPLO",
      "productName": "Nome do Produto",
      "severity": "CRITICAL" ou "WARNING" ou "HEALTHY",
      "issue": "Descrição do problema (ex: estoque disponível abaixo do estoque de segurança)",
      "recommendedAction": "Ação recomendada imediata (ex: emitir PO de 50 unidades com lead time de 7 dias)"
    }
  ],
  "stockValueAnalysis": {
    "totalValuationCostBrl": 0,
    "totalPotentialRevenueBrl": 0,
    "projectedGrossMarginBrl": 0,
    "overallMarginPercent": 0
  },
  "turnoverOptimizationTips": [
    "Dica 1 de giro de estoque para smartphones e acessórios",
    "Dica 2 para fones de ouvido e bundles promocionais"
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const outputText = response.text || "{}";
    const analysisJson = JSON.parse(outputText);

    return res.json({
      success: true,
      analysis: analysisJson,
    });
  } catch (error: any) {
    console.error("Erro na rota /api/ai/inventory-analysis:", error);
    return res.status(500).json({
      error: error.message || "Falha ao gerar diagnóstico de estoque",
    });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`TechCommerce Studio Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
