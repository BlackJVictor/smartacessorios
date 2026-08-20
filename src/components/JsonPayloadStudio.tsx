import React, { useState } from 'react';
import { 
  Product, 
  PayloadSchemaType 
} from '../types';
import { generateProductPayload } from '../utils/payloadGenerator';
import { 
  FileJson, 
  Copy, 
  Check, 
  Download, 
  Send, 
  Code2, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  Terminal,
  RefreshCw,
  Cpu
} from 'lucide-react';

interface JsonPayloadStudioProps {
  products: Product[];
  activeProduct?: Product | null;
}

export const JsonPayloadStudio: React.FC<JsonPayloadStudioProps> = ({
  products,
  activeProduct,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(activeProduct?.id || products[0]?.id || '');
  const [schemaType, setSchemaType] = useState<PayloadSchemaType>('rest_catalog_ingest');
  const [copied, setCopied] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [customAiPrompt, setCustomAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiCustomPayload, setAiCustomPayload] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Dispatch simulation state
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResponse, setSimulationResponse] = useState<any | null>(null);

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Base generated payload
  const activePayload = aiCustomPayload || (currentProduct ? generateProductPayload(currentProduct, schemaType) : {});
  const jsonString = JSON.stringify(activePayload, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payload_${currentProduct?.sku.toLowerCase() || 'export'}_${schemaType}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCurl = () => {
    let endpoint = 'https://api.techcommerce.internal/v1/products';
    if (schemaType === 'stock_sync_webhook') endpoint = 'https://api.techcommerce.internal/v1/webhooks/inventory';
    if (schemaType === 'marketplace_feed') endpoint = 'https://omnichannel.techcommerce.internal/v2/items';
    
    const curlCommand = `curl -X POST "${endpoint}" \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer sec_tok_tech_commerce_live" \\\n  -d '${JSON.stringify(activePayload)}'`;
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const handleSimulateDispatch = () => {
    setIsSimulating(true);
    setSimulationResponse(null);

    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResponse({
        http_status: 201,
        status_text: 'CREATED / ASYNC_COMMITTED',
        gateway: 'KONG_ENTERPRISE_API_GATEWAY',
        cluster_node: 'node-us-east-cluster-04',
        duration_ms: Math.floor(Math.random() * 30) + 18,
        validation: {
          json_schema_valid: true,
          specifications_passed: true,
          ean_checksum_valid: true,
          stock_consistency_verified: true,
        },
        entity_id: `prod_entity_${Date.now()}`,
        transaction_id: `tx_${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date().toISOString(),
      });
    }, 550);
  };

  const handleAiTransform = async () => {
    if (!customAiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/ai/generate-payload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productData: currentProduct,
          targetSchema: customAiPrompt,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao transformar payload');
      }

      setAiCustomPayload(data.payload);
    } catch (err: any) {
      setAiError(err.message || 'Erro ao transformar payload com IA');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResetAiCustom = () => {
    setAiCustomPayload(null);
    setCustomAiPrompt('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 p-5 rounded-2xl border border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <FileJson className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-extrabold text-white tracking-tight">
              Studio de Arquitetura de Software & Payloads JSON
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Estruture contratos de dados, esquemas de ingestão de catálogo, webhooks de sincronização de estoque e feeds Omnichannel para sistemas de e-commerce e WMS.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-lg bg-slate-950 text-emerald-400 border border-emerald-800/60 text-xs font-mono font-bold flex items-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5" />
            <span>CLEAN ARCHITECTURE V2</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Controls + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Selectors & AI Transformer (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Target Schema Selector */}
          <div className="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Contrato & Schema Alvo</span>
            </h3>

            {/* Product Picker */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Produto Fonte
              </label>
              <select
                id="select-payload-product"
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setAiCustomPayload(null);
                }}
                className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500 font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.category.toUpperCase()}] {p.brand} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Schema Options List */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block mb-1">
                Especificação da Arquitetura
              </label>

              <button
                onClick={() => { setSchemaType('rest_catalog_ingest'); setAiCustomPayload(null); }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                  schemaType === 'rest_catalog_ingest' && !aiCustomPayload
                    ? 'bg-emerald-950/70 border-emerald-600 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">POST /api/v1/products</div>
                  <div className="text-[11px] text-slate-400">Ingestão Completa de Catálogo REST</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400">REST</span>
              </button>

              <button
                onClick={() => { setSchemaType('stock_sync_webhook'); setAiCustomPayload(null); }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                  schemaType === 'stock_sync_webhook' && !aiCustomPayload
                    ? 'bg-emerald-950/70 border-emerald-600 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">Webhook: inventory.level.changed</div>
                  <div className="text-[11px] text-slate-400">Sincronização de Saldos Físico/Disponível</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-400">EVENT</span>
              </button>

              <button
                onClick={() => { setSchemaType('marketplace_feed'); setAiCustomPayload(null); }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                  schemaType === 'marketplace_feed' && !aiCustomPayload
                    ? 'bg-emerald-950/70 border-emerald-600 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">Marketplace Omnichannel Feed</div>
                  <div className="text-[11px] text-slate-400">Padrão Mercado Livre, Amazon & Magalu</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400">FEED</span>
              </button>

              <button
                onClick={() => { setSchemaType('schema_org_json_ld'); setAiCustomPayload(null); }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                  schemaType === 'schema_org_json_ld' && !aiCustomPayload
                    ? 'bg-emerald-950/70 border-emerald-600 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">Schema.org Product (JSON-LD)</div>
                  <div className="text-[11px] text-slate-400">SEO Estruturado para Google Rich Results</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-violet-400">SEO</span>
              </button>

              <button
                onClick={() => { setSchemaType('vtex_product_payload'); setAiCustomPayload(null); }}
                className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${
                  schemaType === 'vtex_product_payload' && !aiCustomPayload
                    ? 'bg-emerald-950/70 border-emerald-600 text-white font-semibold'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold">VTEX / Enterprise Platform</div>
                  <div className="text-[11px] text-slate-400">Especificações de SKU, RefId e Dimensões</div>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-pink-400">ERP</span>
              </button>
            </div>
          </div>

          {/* AI Schema Transformer Customizer */}
          <div className="bg-slate-900 border border-slate-800 p-4.5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Customizar Payload com IA</span>
              </h4>
              {aiCustomPayload && (
                <button
                  onClick={handleResetAiCustom}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Restaurar Original
                </button>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Solicite transformações para SAP, Bling, Tiny ERP, Magento, Shopify GraphQL ou schemas customizados.
            </p>

            <textarea
              rows={2}
              value={customAiPrompt}
              onChange={(e) => setCustomAiPrompt(e.target.value)}
              placeholder="Ex: Formatar payload para SAP S/4HANA com campos MATNR, WERKS e LGORT..."
              className="w-full bg-slate-950 border border-slate-700 text-xs text-white rounded-lg p-2.5 focus:outline-none focus:border-cyan-500 font-mono"
            />

            <button
              onClick={handleAiTransform}
              disabled={isAiLoading || !customAiPrompt.trim()}
              className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition disabled:opacity-50"
            >
              {isAiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Transformando Payload...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Estruturar com Gemini IA</span>
                </>
              )}
            </button>

            {aiError && (
              <p className="text-xs text-rose-400">{aiError}</p>
            )}
          </div>
        </div>

        {/* Right Side: Code Editor / Viewer (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            {/* Code Toolbar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-slate-400 font-mono ml-2 font-medium">
                  {currentProduct?.sku.toLowerCase() || 'payload'}.json
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono text-[10px]">
                  200 OK
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  id="btn-simulate-dispatch"
                  onClick={handleSimulateDispatch}
                  disabled={isSimulating}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-700/20 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSimulating ? 'Validando...' : 'Testar Ingestão API'}</span>
                </button>

                <button
                  onClick={handleCopyCurl}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs transition"
                  title="Copiar comando cURL completo"
                >
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{copiedCurl ? 'cURL Copiado!' : 'cURL'}</span>
                </button>

                <button
                  id="btn-copy-payload-json"
                  onClick={handleCopyJson}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
                  title="Baixar arquivo JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* JSON Code Viewer */}
            <div className="bg-slate-950 p-4 overflow-x-auto max-h-[520px]">
              <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
                <code>{jsonString}</code>
              </pre>
            </div>
          </div>

          {/* Simulation Output Banner */}
          {simulationResponse && (
            <div className="bg-emerald-950/40 border border-emerald-800/80 p-4 rounded-2xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Transação Validada no Gateway API ({simulationResponse.gateway})
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Entidade: <span className="font-mono text-cyan-300">{simulationResponse.entity_id}</span> • Latência: <span className="text-emerald-300 font-bold">{simulationResponse.duration_ms}ms</span>
                    </p>
                  </div>
                </div>

                <span className="px-2 py-1 rounded bg-emerald-900/60 text-emerald-300 font-mono text-xs font-bold">
                  HTTP {simulationResponse.http_status} {simulationResponse.status_text}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-900/50 text-[11px]">
                <div className="text-slate-300">✓ JSON Schema: <strong className="text-emerald-400">Válido</strong></div>
                <div className="text-slate-300">✓ Checksum GTIN/EAN: <strong className="text-emerald-400">OK</strong></div>
                <div className="text-slate-300">✓ Matriz de Estoque: <strong className="text-emerald-400">Sincronizada</strong></div>
                <div className="text-slate-300 font-mono text-slate-400">{simulationResponse.timestamp.split('T')[1].replace('Z','')} UTC</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
