import React, { useState } from 'react';
import { 
  Product, 
  ProductCategory, 
  SmartphoneSpecs, 
  CaseSpecs, 
  HeadphoneSpecs 
} from '../types';
import { 
  X, 
  Save, 
  Smartphone, 
  Shield, 
  Headphones, 
  Layers, 
  DollarSign, 
  Warehouse,
  Sparkles,
  Image as ImageIcon,
  Plus
} from 'lucide-react';

interface ProductFormModalProps {
  initialProduct?: Product | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  initialProduct,
  onClose,
  onSave,
}) => {
  const isEditing = !!initialProduct;

  const [category, setCategory] = useState<ProductCategory>(initialProduct?.category || 'smartphones');
  const [sku, setSku] = useState(initialProduct?.sku || `SKU-TECH-${Date.now().toString().slice(-6)}`);
  const [ean, setEan] = useState(initialProduct?.ean || '789899' + Math.floor(1000000 + Math.random() * 9000000));
  const [name, setName] = useState(initialProduct?.name || '');
  const [brand, setBrand] = useState(initialProduct?.brand || '');
  const [model, setModel] = useState(initialProduct?.model || '');
  const [color, setColor] = useState(initialProduct?.color || 'Preto Titânio');
  const [releaseYear, setReleaseYear] = useState(initialProduct?.releaseYear || 2024);

  // Pricing
  const [costPrice, setCostPrice] = useState(initialProduct?.pricing.costPrice || 100);
  const [regularPrice, setRegularPrice] = useState(initialProduct?.pricing.regularPrice || 199);
  const [promotionalPrice, setPromotionalPrice] = useState(initialProduct?.pricing.promotionalPrice || 179);

  // Stock
  const [physicalStock, setPhysicalStock] = useState(initialProduct?.stock.physical || 50);
  const [reservedStock, setReservedStock] = useState(initialProduct?.stock.reserved || 0);
  const [minSafetyStock, setMinSafetyStock] = useState(initialProduct?.stock.minSafetyStock || 10);
  const [reorderPoint, setReorderPoint] = useState(initialProduct?.stock.reorderPoint || 20);
  const [warehouseLocation, setWarehouseLocation] = useState(initialProduct?.stock.warehouseLocation || 'CD-SP-01 / Corredor B-04 / Prateleira 2');

  // Copy basics
  const [shortPitch, setShortPitch] = useState(initialProduct?.copy.shortPitch || '');
  const [tagsInput, setTagsInput] = useState(initialProduct?.tags.join(', ') || 'tech, lançamento, alta performance');

  // Images state
  const [imagesInput, setImagesInput] = useState<string>(initialProduct?.images?.join('\n') || '');

  // Specs state
  const [smartphoneSpecs, setSmartphoneSpecs] = useState<Partial<SmartphoneSpecs>>(
    initialProduct?.smartphoneSpecs || {
      chipset: 'Qualcomm Snapdragon 8 Gen 3 (4nm TSMC N4P)',
      gpu: 'Adreno 750 (1 GHz)',
      ramGb: 12,
      ramType: 'LPDDR5X (8533 Mbps)',
      storageGb: 256,
      storageType: 'UFS 4.0',
      displayType: 'Dynamic LTPO AMOLED 2X',
      displaySizeInches: 6.7,
      refreshRateHz: 120,
      peakBrightnessNits: 2600,
      resolution: '3120 x 1440 QHD+',
      cameraMainMp: 200,
      cameraMainSensor: 'ISOCELL HP2 1/1.3"',
      cameraUltraWideMp: 12,
      opticalZoom: '5x Periscópio Óptico + 3x Óptico',
      videoRecordingMax: '8K @ 30fps / 4K @ 120fps',
      batteryMah: 5000,
      chargingSpeedWatts: 45,
      wirelessChargingWatts: 15,
      ipRating: 'IP68',
      dimensionsMm: '162.3 x 79.0 x 8.6 mm',
      weightGrams: 232,
      bluetoothVer: '5.3 LE Audio',
      wifiGen: 'Wi-Fi 7 (802.11be)',
    }
  );

  const [caseSpecs, setCaseSpecs] = useState<Partial<CaseSpecs>>(
    initialProduct?.caseSpecs || {
      material: 'Fibra de Aramida (Kevlar 1500D) + TPU Bayer',
      thicknessMm: 1.1,
      dropProtectionRatingMeters: 3.5,
      militaryStandard: 'MIL-STD-810H Method 516.8',
      magSafeCompatible: true,
      magnetStrengthGauss: 1400,
      raisedLipCameraMm: 1.5,
      raisedLipScreenMm: 1.2,
      innerLining: 'Microfibra aveludada anti-risco',
      weightGrams: 28,
      compatibleModels: ['iPhone 15 Pro Max', 'iPhone 15 Pro'],
      specialFeatures: ['Botão de Ação tátil em alumínio usinado CNC', 'Bisel de câmera em liga de titânio'],
    }
  );

  const [headphoneSpecs, setHeadphoneSpecs] = useState<Partial<HeadphoneSpecs>>(
    initialProduct?.headphoneSpecs || {
      formFactor: 'over-ear',
      acousticDesign: 'fechado',
      driverSizeMm: 40,
      driverType: 'Domos de Fibra de Carbono com suspensão de TPU',
      frequencyResponse: '4 Hz - 40.000 Hz (Hi-Res Audio)',
      impedanceOhms: 48,
      sensitivityDb: 102,
      ancType: 'híbrido adaptativo dinâmico',
      ancAttenuationDb: 38,
      transparencyMode: true,
      codecs: ['LDAC', 'AAC', 'SBC', 'aptX Adaptive', 'LC3'],
      bluetoothVer: '5.3',
      multipointSupport: true,
      batteryWithAncHours: 30,
      batteryTotalWithCaseHours: 40,
      fastChargeSpecs: '3 min de carga = 3 horas de reprodução (USB-PD)',
      microphonesCount: 8,
      ipRating: 'IPX4',
      weightGrams: 250,
      latencyMs: 45,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const marginPercent = regularPrice > 0 ? ((regularPrice - costPrice) / regularPrice) * 100 : 0;
    const available = Math.max(0, physicalStock - reservedStock);
    const tags = tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    const images = imagesInput
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const productPayload: Product = {
      id: initialProduct?.id || `prod-${Date.now()}`,
      sku,
      ean,
      name,
      brand,
      model,
      category,
      color,
      releaseYear: Number(releaseYear),
      status: 'active',
      images: images.length > 0 ? images : (initialProduct?.images || []),
      pricing: {
        costPrice: Number(costPrice),
        regularPrice: Number(regularPrice),
        promotionalPrice: promotionalPrice ? Number(promotionalPrice) : undefined,
        currency: 'BRL',
        marginPercent,
      },
      stock: {
        physical: Number(physicalStock),
        reserved: Number(reservedStock),
        available,
        minSafetyStock: Number(minSafetyStock),
        reorderPoint: Number(reorderPoint),
        warehouseLocation,
        batchNumber: initialProduct?.stock.batchNumber || `LOT-2024-V${Math.floor(100 + Math.random() * 900)}`,
        lastRestockedDate: initialProduct?.stock.lastRestockedDate || new Date().toISOString().split('T')[0],
        leadTimeDays: initialProduct?.stock.leadTimeDays || 12,
      },
      smartphoneSpecs: category === 'smartphones' ? (smartphoneSpecs as SmartphoneSpecs) : undefined,
      caseSpecs: category === 'cases' ? (caseSpecs as CaseSpecs) : undefined,
      headphoneSpecs: category === 'headphones' ? (headphoneSpecs as HeadphoneSpecs) : undefined,
      copy: initialProduct?.copy || {
        marketplaceTitle: `${brand} ${name} - Original com Garantia e NF`,
        shortPitch: shortPitch || `${brand} ${model} com engenharia de alta performance.`,
        keyBenefitsBullets: [
          `Hardware topo de linha ${brand}`,
          `Construção premium com materiais de engenharia`,
          `Garantia nacional de 12 meses`,
        ],
        technicalMarkdownDescription: `## ${brand} ${name}\n\nEspecificações técnicas homologadas para e-commerce tech.`,
        seoMetaTitle: `${name} | Oficial e Pronta Entrega`,
        seoMetaDescription: `Compre ${name} da ${brand} com envio imediato e nota fiscal.`,
        boxContents: ['1x ' + name, '1x Manual de Instruções', '1x Certificado de Garantia'],
        targetAudienceProfile: 'Usuários exigentes focados em desempenho e durabilidade.',
      },
      tags,
      createdAt: initialProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(productPayload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700">
              {category === 'smartphones' && <Smartphone className="w-5 h-5 text-cyan-400" />}
              {category === 'cases' && <Shield className="w-5 h-5 text-emerald-400" />}
              {category === 'headphones' && <Headphones className="w-5 h-5 text-violet-400" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {isEditing ? `Editar SKU: ${initialProduct?.sku}` : 'Cadastrar Novo SKU de Tecnologia'}
              </h2>
              <p className="text-xs text-slate-400">
                Preencha os dados de engenharia, precificação e localização de estoque WMS.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 uppercase">Nicho Tecnológico</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setCategory('smartphones')}
                className={`p-3 rounded-xl border font-semibold flex items-center justify-center space-x-2 transition ${
                  category === 'smartphones'
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Smartphones</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('cases')}
                className={`p-3 rounded-xl border font-semibold flex items-center justify-center space-x-2 transition ${
                  category === 'cases'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Capinhas</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('headphones')}
                className={`p-3 rounded-xl border font-semibold flex items-center justify-center space-x-2 transition ${
                  category === 'headphones'
                    ? 'bg-violet-950 border-violet-500 text-violet-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>Fones</span>
              </button>
            </div>
          </div>

          {/* Identification Details */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Identificação & Catálogo</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Nome Comercial do Produto *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Galaxy S24 Ultra 5G Titânio 512GB"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Marca / Fabricante *</label>
                <input
                  type="text"
                  required
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ex: Samsung, Apple, Sony, Spigen"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Modelo / Referência</label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ex: SM-S928B, WH-1000XM5"
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Código SKU *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono rounded-lg p-2 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Código de Barras EAN-13 *</label>
                <input
                  type="text"
                  required
                  value={ean}
                  onChange={(e) => setEan(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white font-mono rounded-lg p-2 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Cor / Acabamento</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Margins */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Precificação (BRL) & Margem</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Preço de Custo (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white font-mono rounded-lg p-2 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Preço Tabela Regular (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={regularPrice}
                  onChange={(e) => setRegularPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white font-mono rounded-lg p-2 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Preço Promocional / PIX (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={promotionalPrice}
                  onChange={(e) => setPromotionalPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono rounded-lg p-2 focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Stock & WMS */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Warehouse className="w-4 h-4 text-amber-400" />
              <span>Estoque & Parâmetros WMS</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Estoque Físico Total *</label>
                <input
                  type="number"
                  required
                  value={physicalStock}
                  onChange={(e) => setPhysicalStock(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white font-mono rounded-lg p-2 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Estoque Reservado</label>
                <input
                  type="number"
                  value={reservedStock}
                  onChange={(e) => setReservedStock(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-amber-400 font-mono rounded-lg p-2 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Estoque de Segurança</label>
                <input
                  type="number"
                  value={minSafetyStock}
                  onChange={(e) => setMinSafetyStock(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-white font-mono rounded-lg p-2 focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Ponto de Pedido (ROP)</label>
                <input
                  type="number"
                  value={reorderPoint}
                  onChange={(e) => setReorderPoint(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 text-amber-300 font-mono rounded-lg p-2 focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Endereço de Armazenagem no CD</label>
              <input
                type="text"
                value={warehouseLocation}
                onChange={(e) => setWarehouseLocation(e.target.value)}
                placeholder="Ex: CD-SP-01 / Corredor B-04 / Prateleira 2"
                className="w-full bg-slate-900 border border-slate-700 text-white font-mono rounded-lg p-2 focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Fotos e Mídia do Produto (URLs)</span>
            </h4>

            <div>
              <label className="text-slate-400 block mb-1">
                URLs das Imagens (uma por linha ou separadas por quebra)
              </label>
              <textarea
                rows={3}
                value={imagesInput}
                onChange={(e) => setImagesInput(e.target.value)}
                placeholder="https://exemplo.com/foto-smartphone-1.jpg&#10;https://exemplo.com/foto-smartphone-2.jpg"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 font-mono text-xs focus:border-cyan-500"
              />
            </div>

            {/* Live previews of images entered */}
            {imagesInput.trim() && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400">Pré-visualização das Fotos:</span>
                <div className="flex flex-wrap gap-2.5">
                  {imagesInput
                    .split('\n')
                    .map((url) => url.trim())
                    .filter((url) => url.length > 0)
                    .map((url, i) => (
                      <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700 bg-slate-900">
                        <img
                          src={url}
                          alt={`Preview ${i + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-center text-slate-300 font-mono py-0.5">
                          #{i + 1}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags & Pitch */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div>
              <label className="text-slate-400 block mb-1">Pitch Rápido de Vendas</label>
              <input
                type="text"
                value={shortPitch}
                onChange={(e) => setShortPitch(e.target.value)}
                placeholder="Ex: O smartphone com a melhor câmera e durabilidade em titânio do mercado."
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Tags (separadas por vírgula)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ex: titânio, 200mp, 512gb, snapdragon"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2 focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Footer Submit Button */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold flex items-center space-x-1.5 shadow-lg shadow-cyan-600/25 transition"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
