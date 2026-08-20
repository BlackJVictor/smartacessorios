import { Product } from '../types';

import imgS24Ultra from '../assets/images/samsung_s24_ultra_1787163600553.jpg';
import imgIPhone15PM from '../assets/images/iphone_15_pro_max_1787163615238.jpg';
import imgKevlarCase from '../assets/images/kevlar_phone_case_1787163629158.jpg';
import imgSonyXM5 from '../assets/images/sony_headphones_1787163640189.jpg';
import imgAirPodsPro from '../assets/images/airpods_pro_case_1787163658225.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-sp-001',
    sku: 'SP-SAM-S24U-512-TI',
    ean: '7892509128394',
    name: 'Samsung Galaxy S24 Ultra 5G Titânio 512GB',
    brand: 'Samsung',
    category: 'smartphones',
    model: 'SM-S928B/DS',
    color: 'Cinza Titânio (Titanium Gray)',
    releaseYear: 2024,
    status: 'active',
    pricing: {
      costPrice: 5800.0,
      regularPrice: 8999.0,
      promotionalPrice: 7999.0,
      marginPercent: 27.5,
      taxRatePercent: 12.0,
      currency: 'BRL',
    },
    stock: {
      physical: 48,
      reserved: 12,
      available: 36,
      minSafetyStock: 15,
      reorderPoint: 20,
      leadTimeDays: 7,
      warehouseLocation: 'Galpão Principal - Corredor A3 - Prateleira 12',
      batchNumber: 'LOTE-SAM-2401-BR',
      lastRestockedDate: '2025-01-15',
    },
    smartphoneSpecs: {
      chipset: 'Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm TSMC)',
      cpuArchitecture: 'Octa-core (1x 3.39 GHz Cortex-X4 & 3x 3.1 GHz Cortex-A720 & 2x 2.9 GHz Cortex-A720 & 2x 2.2 GHz Cortex-A520)',
      gpu: 'Adreno 750 (1 GHz) c/ Hardware Ray Tracing em tempo real',
      ramGb: 12,
      ramType: 'LPDDR5X (8533 Mbps)',
      storageGb: 512,
      storageType: 'UFS 4.0 Dual-Lane',
      expandableStorage: false,
      displayType: 'Dynamic AMOLED 2X Plano, HDR10+, Corning Gorilla Armor antirreflexo',
      displaySizeInches: 6.8,
      refreshRateHz: 120,
      resolution: '3120 x 1440 pixels (QHD+ / 505 ppi)',
      peakBrightnessNits: 2600,
      batteryMah: 5000,
      chargingSpeedWatts: 45,
      wirelessChargingWatts: 15,
      reverseWirelessCharging: true,
      cameraMainMp: 200,
      cameraMainSensor: 'ISOCELL HP2 (1/1.3", f/1.7, OIS Multieixo, Super Quad Pixel PDAF)',
      cameraUltraWideMp: 12,
      cameraTelephotoMp: 50,
      opticalZoom: '5x Periscópio Óptico + 3x Telefoto Secundária + 100x Space Zoom AI',
      cameraFrontMp: 12,
      videoRecordingMax: '8K @ 30fps / 4K @ 120fps HDR10+ 10-bit',
      network5G: true,
      simType: 'Dual SIM (1x Nano-SIM + 1x eSIM ou 2x eSIM)',
      wifiGen: 'Wi-Fi 7 (802.11be Tri-Band 320MHz)',
      bluetoothVer: '5.3 c/ LE Audio & Auracast',
      nfc: true,
      ipRating: 'IP68 (até 1.5m por 30 minutos)',
      os: 'Android 14 c/ One UI 6.1 (7 anos de atualizações de SO e segurança garantidos)',
      weightGrams: 232,
      dimensionsMm: '162.3 x 79.0 x 8.6 mm',
      biometrics: ['Leitor Ultrassônico 3D sob o display', 'Reconhecimento Facial 2D AI'],
    },
    copy: {
      marketplaceTitle: 'Samsung Galaxy S24 Ultra 5G 512GB 12GB RAM Titânio Cinza Snapdragon 8 Gen 3 Câmera 200MP',
      seoMetaTitle: 'Samsung Galaxy S24 Ultra 512GB 5G - Câmera 200MP e Tela Antirreflexo',
      seoMetaDescription: 'Compre o Samsung Galaxy S24 Ultra 512GB Titânio com Snapdragon 8 Gen 3, tela Dynamic AMOLED 2X 120Hz de 2600 nits e S Pen integrada. Envio imediato!',
      shortPitch: 'A fusão definitiva entre titânio aeroespacial, poder de processamento Snapdragon 8 Gen 3 for Galaxy e conjunto óptico de 200 MP com inteligência artificial Galaxy AI.',
      technicalMarkdownDescription: `## Visão Geral de Engenharia & Arquitetura de Hardware

O **Samsung Galaxy S24 Ultra** representa o ápice da computação móvel moderna, construído com chassi em liga de **titânio Grau 2**, proporcionando integridade estrutural superior contra impactos torcionais e redução significativa de peso térmico.

### Desempenho & Processamento
* **SoC:** Qualcomm Snapdragon 8 Gen 3 for Galaxy manufaturado em litografia de 4nm da TSMC.
* **NPU de 45 TOPS:** Processamento local para recursos de visão computacional e Galaxy AI sem latência de rede.
* **Câmara de Vapor 1.9x Maior:** Redissipação térmica contínua evitando *thermal throttling* em sessões prolongadas de renderização ou jogos com *Ray Tracing* ativo.
* **Memória & Barramento:** 12GB de RAM LPDDR5X operando a 8533 Mbps combinado a 512GB de armazenamento ultra-rápido UFS 4.0.

### Engenharia Óptica & Conjunto de Câmeras
* **Sensor Primário:** 200 MP Samsung ISOCELL HP2 com abertura f/1.7, estabilização óptica OIS aprimorada em 2x de amplitude angular e tecnologia de pixel binning 16-em-1 (Tetra2Pixel).
* **Telefoto Periscópica de 50 MP:** Sensor de 1/2.52" com zoom óptico de 5x nativo e abertura luminosa f/3.4, capaz de gravação 8K a 30fps em telefoto.
* **Ultra-Wide de 12 MP:** Campo de visão de 120° com autofoco Dual Pixel para fotos macro a partir de 2cm.

### Display & Tecnologia Óptica
* **Painel:** Dynamic AMOLED 2X de 6.8" com taxa de atualização adaptativa LTPO de 1Hz a 120Hz.
* **Brilho de Pico:** 2.600 nits com Vision Booster dinâmico para legibilidade sob incidência solar direta.
* **Vidro:** Corning® Gorilla® Armor com tratamento antirreflexo óptico que atenua até 75% dos reflexos ambientes.

### Especificações Energéticas
* **Bateria:** 5.000 mAh com arquitetura de célula dupla e suporte a recarga rápida Super Fast Charging 2.0 de 45W (0 a 65% em aprox. 30 minutos).`,
      keyBenefitsBullets: [
        'Processador Snapdragon 8 Gen 3 customizado com aceleração por hardware para Ray Tracing e NPU de 45 TOPS',
        'Vidro exclusivo Corning Gorilla Armor com atenuação óptica de reflexos em 75% e resistência a riscos 4x superior',
        'Sensor ProVisual de 200MP com estabilização óptica aprimorada e gravação em 8K 30fps / 4K 120fps',
        'Chassi estrutural usinado em Titânio aeroespacial com certificação IP68 de estanqueidade contra água e poeira',
        'Caneta S Pen embutida de latência ultra-baixa de 2.8ms para produtividade e anotações de precisão',
      ],
      targetAudienceProfile: 'Power users, criadores de conteúdo audiovisual exigentes, desenvolvedores móveis e executivos que necessitam de máxima performance, multitarefa e longevidade de software.',
      boxContents: [
        'Smartphone Samsung Galaxy S24 Ultra 512GB',
        'Caneta S Pen integrada',
        'Cabo USB-C para USB-C de 3A',
        'Extrator de gaveta de chip SIM',
        'Guia rápido de inicialização e certificado de garantia nacional',
      ],
      compatibilityNotes: 'Compatível com redes 5G SA/NSA nacionais (Bandas n1, n3, n7, n28, n78). Carregamento rápido requer fonte compatível com padrão USB Power Delivery PPS 45W.',
    },
    images: [
      imgS24Ultra,
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['5G', 'Snapdragon 8 Gen 3', '200MP', 'Titânio', 'S Pen', 'Dynamic AMOLED', 'Flagship'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2025-01-15T14:30:00Z',
  },
  {
    id: 'prod-sp-002',
    sku: 'SP-APL-IP15PM-256-NT',
    ean: '0195949038289',
    name: 'Apple iPhone 15 Pro Max 256GB Titânio Natural',
    brand: 'Apple',
    category: 'smartphones',
    model: 'A3106',
    color: 'Titânio Natural (Natural Titanium)',
    releaseYear: 2023,
    status: 'active',
    pricing: {
      costPrice: 6200.0,
      regularPrice: 9499.0,
      promotionalPrice: 8499.0,
      marginPercent: 27.0,
      taxRatePercent: 12.0,
      currency: 'BRL',
    },
    stock: {
      physical: 32,
      reserved: 8,
      available: 24,
      minSafetyStock: 10,
      reorderPoint: 15,
      leadTimeDays: 10,
      warehouseLocation: 'Galpão Principal - Corredor A1 - Cofre Alta Segurança',
      batchNumber: 'LOTE-APL-2402-BR',
      lastRestockedDate: '2025-02-01',
    },
    smartphoneSpecs: {
      chipset: 'Apple A17 Pro (N3B 3nm EUV TSMC)',
      cpuArchitecture: 'Hexa-core (2x 3.78 GHz Everest de alta performance + 4x 2.11 GHz Sawtooth de eficiência)',
      gpu: 'Apple GPU 6-core com arquitetura Pro-class e aceleração de Ray Tracing por hardware',
      ramGb: 8,
      ramType: 'LPDDR5 (6400 Mbps)',
      storageGb: 256,
      storageType: 'NVMe Apple Custom Controller',
      expandableStorage: false,
      displayType: 'Super Retina XDR OLED com ProMotion e Dynamic Island',
      displaySizeInches: 6.7,
      refreshRateHz: 120,
      resolution: '2796 x 1290 pixels (460 ppi)',
      peakBrightnessNits: 2000,
      batteryMah: 4422,
      chargingSpeedWatts: 27,
      wirelessChargingWatts: 15,
      reverseWirelessCharging: true,
      cameraMainMp: 48,
      cameraMainSensor: 'Sony 48MP Quad-Bayer (1/1.28", f/1.78, Sensor-Shift OIS 2ª Geração, 24mm/28mm/35mm selecionáveis)',
      cameraUltraWideMp: 12,
      cameraTelephotoMp: 12,
      opticalZoom: '5x Telefoto Tetraprisma (120mm focal equivalente, abertura f/2.8 com 3D Sensor-Shift)',
      cameraFrontMp: 12,
      videoRecordingMax: '4K @ 60fps ProRes Log com suporte a gravação direta em SSD externo via USB-C',
      network5G: true,
      simType: 'Dual SIM (1x Nano-SIM + 1x eSIM ou Dual eSIM)',
      wifiGen: 'Wi-Fi 6E (802.11ax 6GHz)',
      bluetoothVer: '5.3',
      nfc: true,
      ipRating: 'IP68 (profundidade máxima de 6m por até 30 minutos)',
      os: 'iOS 17 (atualizável para iOS 18 com Apple Intelligence)',
      weightGrams: 221,
      dimensionsMm: '159.9 x 76.7 x 8.25 mm',
      biometrics: ['Face ID via câmera TrueDepth com projetor de pontos infravermelhos'],
    },
    copy: {
      marketplaceTitle: 'Apple iPhone 15 Pro Max 256GB Titânio Natural Chip A17 Pro Câmera 48MP USB-C 10Gbps',
      seoMetaTitle: 'iPhone 15 Pro Max 256GB Titânio Natural - Chip A17 Pro e Câmera 5x Tetraprisma',
      seoMetaDescription: 'Garanta o iPhone 15 Pro Max 256GB Titânio com Chip A17 Pro, conector USB-C com velocidade USB 3 de 10Gbps e gravação de vídeo ProRes Log. Pronta entrega.',
      shortPitch: 'Usinado em liga de Titânio Grau 5 com o inovador chip A17 Pro de 3nm, lente tetraprisma com zoom óptico de 5x e porta USB-C de alta velocidade (10 Gb/s).',
      technicalMarkdownDescription: `## Arquitetura de Engenharia & Especificações Apple Pro

O **iPhone 15 Pro Max** redefine a ergonomia e performance em dispositivos móveis através de uma estrutura interna em alumínio 100% reciclado termo-fundida por difusão em estado sólido com bandas externas de **Titânio Grau 5 (Ti-6Al-4V)**.

### Plataforma de Silício Apple A17 Pro
* **Litografia:** Primeiro chip comercial manufaturado no processo de 3 nanômetros (N3B) da TSMC com 19 bilhões de transistores.
* **GPU Pro-Class 6-Core:** Renderização com sombreamento mesh e aceleração por hardware para *Ray Tracing* 4x mais rápida que a geração anterior.
* **Controlador USB 3 Dedicado:** Barramento USB-C com taxas de transferência de até **10 Gb/s**, viabilizando *tethering* profissional em estúdio e captura simultânea ProRes 4K 60fps direto para unidades NVMe externas.

### Sistema de Câmeras Pro & Tetraprisma
* **Câmera Principal de 48MP:** Sensor quad-pixel de 2.44µm com saída padrão de fotos super em alta resolução de 24MP combinando detalhe de iluminação e nitidez. Três distâncias focais equivalentes (24mm, 28mm e 35mm).
* **Telefoto 5x Tetraprisma:** Design óptico exclusivo que reflete a luz quatro vezes através de uma estrutura de vidro tridimensional, oferecendo 120mm de distância focal sem protuberância excessiva.
* **Gravação Log & Academy Color Encoding System (ACES):** Primeiro smartphone no mundo a suportar o padrão global de cores cinematográfico da Academia de Hollywood.

### Interface & Botão de Ação Háptico
* **Action Button:** Substitui a chave de toque/silencioso por um botão de estado sólido configurável com feedback do Taptic Engine para acionamento de atalhos, lanterna, câmera ou workflows de automação.`,
      keyBenefitsBullets: [
        'Chip A17 Pro de 3nm pioneiro na indústria com aceleração de Ray Tracing por hardware para jogos nível console',
        'Chassi aeroespacial em Titânio Grau 5 com as bordas mais finas já desenvolvidas pela Apple',
        'Porta USB-C com suporte a USB 3 (10 Gbps) permitindo gravação direta de vídeo ProRes Log em SSD externo',
        'Lente telefoto com design inovador de Tetraprisma e zoom óptico nativo de 5x (120mm focal)',
        'Botão de Ação customizável com feedback háptico de alta precisão via Taptic Engine',
      ],
      targetAudienceProfile: 'Diretores de fotografia, entusiastas do ecossistema Apple, gamers competitivos e profissionais que demandam velocidade de barramento e consistência de cores.',
      boxContents: [
        'iPhone 15 Pro Max 256GB Titânio Natural',
        'Cabo trançado USB-C de recarga rápida (1 metro)',
        'Documentação oficial e adesivo da marca',
      ],
      compatibilityNotes: 'Compatível com acessórios MagSafe de até 15W e carregadores Qi2 de 15W. Requer cabo USB 3 de 10Gbps (vendido separadamente) para taxas de dados de alta velocidade.',
    },
    images: [
      imgIPhone15PM,
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['A17 Pro', '3nm', 'Titânio', 'Tetraprisma', 'ProRes Log', 'USB 3', 'MagSafe', 'iOS'],
    createdAt: '2023-09-25T12:00:00Z',
    updatedAt: '2025-02-01T11:00:00Z',
  },
  {
    id: 'prod-cs-001',
    sku: 'CS-KEV-IP15PM-06MM-MAG',
    ean: '7898712340912',
    name: 'Capa Fibra de Aramida Kevlar 1500D MagSafe Ultra-Slim 0.6mm p/ iPhone 15 Pro Max',
    brand: 'AeroShield Tech',
    category: 'cases',
    model: 'AS-KEV-15PM-MAG',
    color: 'Carbon Fiber Matte Black (Trama 1500D)',
    releaseYear: 2024,
    status: 'active',
    pricing: {
      costPrice: 95.0,
      regularPrice: 289.0,
      promotionalPrice: 249.0,
      marginPercent: 61.8,
      taxRatePercent: 12.0,
      currency: 'BRL',
    },
    stock: {
      physical: 140,
      reserved: 22,
      available: 118,
      minSafetyStock: 30,
      reorderPoint: 45,
      leadTimeDays: 14,
      warehouseLocation: 'Galpão Acessórios - Prateleira C2 - Gaveta 04',
      batchNumber: 'LOTE-KEV-2403-BR',
      lastRestockedDate: '2025-02-10',
    },
    caseSpecs: {
      material: '100% Fibra de Aramida DuPont™ Kevlar® 1500D Original de Grau Aeroespacial',
      dropProtectionRatingMeters: 2.0,
      militaryStandard: 'MIL-STD-810H Método 516.8 (Impactos e Vibração)',
      magSafeCompatible: true,
      magnetStrengthGauss: 1400,
      thicknessMm: 0.65,
      raisedLipCameraMm: 1.4,
      raisedLipScreenMm: 1.1,
      innerLining: 'Revestimento de Micro-filme isolante térmico e anti-riscos',
      finishTexture: 'Acabamento Matte Soft-Grip com corte a vácuo 3D (Textura antiderrapante sedosa)',
      compatibleModels: ['Apple iPhone 15 Pro Max (6.7 polegadas)'],
      wirelessChargingPassThrough: true,
      weightGrams: 16.5,
      specialFeatures: [
        'Anel Magnético de Neodímio N52SH ultrafino integrado sem relevo traseiro',
        'Aro de proteção da câmera usinado em liga de alumínio anodizado CNC aeroespacial',
        'Recorte de precisão laser para o Botão de Ação e porta USB-C para cabos com conectores largos',
        'Resistência absoluta a oleosidade e marcas de impressões digitais',
      ],
    },
    copy: {
      marketplaceTitle: 'Capa Fibra Aramida Kevlar 1500D MagSafe Ultra Fina 0.6mm p/ iPhone 15 Pro Max',
      seoMetaTitle: 'Capa Kevlar MagSafe iPhone 15 Pro Max 0.6mm - Fibra de Aramida DuPont',
      seoMetaDescription: 'Proteja seu iPhone 15 Pro Max com fibra de aramida Kevlar 1500D ultra fina (0.65mm), ímãs de Neodímio N52 MagSafe e aro de câmera em alumínio CNC.',
      shortPitch: 'Construída em fibra de aramida DuPont™ Kevlar® 1500D original com apenas 0.65mm de espessura: proteção balística de nível militar sem adicionar volume ao aparelho.',
      technicalMarkdownDescription: `## Especificações de Engenharia de Materiais & Proteção Balística

A **Capa AeroShield Kevlar 1500D MagSafe** é fabricada através do processo de moldagem a vácuo em alta temperatura a partir de filamentos entrelaçados de **fibra de aramida DuPont™ Kevlar® 1500D**, material sintético 5 vezes mais resistente que o aço na mesma proporção de peso.

### Propriedades Físicas & Mecânicas
* **Espessura de Parede:** Apenas 0.65 mm, preservando a pegada e a ergonomia original do iPhone 15 Pro Max sem criar degraus laterais incômodos.
* **Peso Mínimo:** 16.5 gramas (uma das capas mais leves do mercado mundial).
* **Condutividade Térmica Passiva:** A trama aberta de fibra dissipa o calor gerado pelo chip A17 Pro com eficiência 30% superior aos polímeros de silicone convencionais.

### Integração Eletromagnética & MagSafe
* **Matriz Magnética N52SH:** Anel composto por 36 ímãs de Neodímio de grau N52SH com tolerância a calor de até 150°C, garantindo força de atração de **1400 Gauss** para fixação firme em carregadores veiculares, baterias portáteis e suportes magnéticos.
* **Transparência a Sinais:** Não causa nenhuma atenuação ou gaiola de Faraday nos sinais 5G mmWave, Sub-6GHz, Wi-Fi 6E, Bluetooth 5.3 ou GPS L1/L5.

### Proteção Óptica & Usinagem de Precisão
* **Aro de Câmera em Alumínio CNC:** Moldura protetora de 1.4 mm usinada em alumínio aeronáutico que impede o contato das três lentes tetraprisma com superfícies planas abrasivas.`,
      keyBenefitsBullets: [
        'Confeccionada em 100% fibra de aramida Kevlar 1500D autêntica, imune a riscos, arranhões e desgaste por atrito',
        'Perfil ultra-slim de 0.65mm que não adiciona volume ao bolso e mantém o toque premium do titânio',
        'Matriz de ímãs Neodímio N52SH compatível com todos os carregadores e acessórios MagSafe oficiais',
        'Aro de proteção das lentes em liga de alumínio usinado em CNC com elevação de 1.4mm',
        'Resina de revestimento oleofóbico e anti-suor que elimina marcas de digitais',
      ],
      targetAudienceProfile: 'Usuários exigentes que buscam proteger seu smartphone topo de linha sem abrir mão do design original, espessura fina e compatibilidade MagSafe impecável.',
      boxContents: [
        'Capa de Proteção AeroShield Kevlar 1500D MagSafe',
        'Kit de lenços de microfibra para limpeza pré-instalação',
        'Manual de conservação e garantia de 12 meses contra delaminação',
      ],
      compatibilityNotes: 'Projetada sob medida exclusivamente para o Apple iPhone 15 Pro Max (6.7"). Não compatível com iPhone 15 Plus ou modelos das gerações anteriores.',
    },
    images: [
      imgKevlarCase,
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Kevlar', 'Aramida 1500D', 'MagSafe', 'Ultra-Slim', 'iPhone 15 Pro Max', 'Alumínio CNC', 'N52SH'],
    createdAt: '2024-02-15T09:00:00Z',
    updatedAt: '2025-02-10T16:00:00Z',
  },
  {
    id: 'prod-cs-002',
    sku: 'CS-RUG-S24U-MIL-KICK',
    ean: '7898712340943',
    name: 'Capa Rugged Armored Drop-Test 3.8m Shockproof c/ Kickstand 360° p/ Galaxy S24 Ultra',
    brand: 'ArmorX Defense',
    category: 'cases',
    model: 'AX-RUG-S24U-KICK',
    color: 'Titanium Black / Gunmetal',
    releaseYear: 2024,
    status: 'active',
    pricing: {
      costPrice: 52.0,
      regularPrice: 179.9,
      promotionalPrice: 149.9,
      marginPercent: 65.3,
      taxRatePercent: 12.0,
      currency: 'BRL',
    },
    stock: {
      physical: 85,
      reserved: 10,
      available: 75,
      minSafetyStock: 25,
      reorderPoint: 35,
      leadTimeDays: 10,
      warehouseLocation: 'Galpão Acessórios - Prateleira C4 - Gaveta 11',
      batchNumber: 'LOTE-RUG-2404-BR',
      lastRestockedDate: '2025-01-28',
    },
    caseSpecs: {
      material: 'Construção Híbrida em Policarbonato Bayer® + TPU Alemão c/ Bolsas de Ar Honeycomb',
      dropProtectionRatingMeters: 3.8,
      militaryStandard: 'MIL-STD-810G 516.6 (Testada contra 26 quedas consecutivas de 3.8 metros)',
      magSafeCompatible: true,
      magnetStrengthGauss: 1600,
      thicknessMm: 1.9,
      raisedLipCameraMm: 2.2,
      raisedLipScreenMm: 1.8,
      innerLining: 'Estrutura alveolar colmeia de dissipação de impacto multidirecional',
      finishTexture: 'Textura antiderrapante militar com ranhuras táteis de empunhadura nas laterais',
      compatibleModels: ['Samsung Galaxy S24 Ultra (SM-S928B)'],
      wirelessChargingPassThrough: true,
      weightGrams: 48.0,
      specialFeatures: [
        'Anel Kickstand de liga de zinco embutido com rotação de 360° e inclinação de 150°',
        'Bisel de tela elevado e proteção total individual das lentes de câmera',
        'Acesso desobstruído com chanfro ergonômico para extração rápida da caneta S Pen',
        'Compatibilidade com suportes veiculares magnéticos sem necessidade de chapas extras',
      ],
    },
    copy: {
      marketplaceTitle: 'Capa Anti-Impacto Galaxy S24 Ultra Militar 3.8m c/ Kickstand 360° MagSafe',
      seoMetaTitle: 'Capa Galaxy S24 Ultra Blindada Militar com Kickstand e MagSafe',
      seoMetaDescription: 'Capa de proteção extrema para Samsung Galaxy S24 Ultra. Testada contra quedas de 3.8m (MIL-STD-810G), anel kickstand 360° e ímã MagSafe integrado.',
      shortPitch: 'Blindagem de grau militar contra quedas de até 3.8 metros com amortecimento colmeia e anel de zinco kickstand rotativo de 360° compatível com MagSafe.',
      technicalMarkdownDescription: `## Engenharia de Blindagem Estrutural & Absorção de Choque

A **Capa ArmorX Defense Rugged Kickstand** foi desenvolvida para ambientes de alta severidade mecânica, combinando uma exoestrutura rígida em policarbonato Bayer® com um núcleo flexível em termoplástico de poliuretano (TPU) absorvedor de energia de deformação.

### Tecnologia de Dispersão de Impacto Air-Cushion
* **Padrão Hexagonal Honeycomb:** A face interna canaliza as ondas de choque cinético para fora do chassi do Galaxy S24 Ultra, dissipando até 93% da força de compressão em quedas de quina.
* **Bordas Reforçadas nos 4 Cantos:** Colunas de ar seladas atuam como airbags mecânicos para impactos frontais e oblíquos.

### Anel Multifuncional Kickstand 360°
* **Material:** Usinado em liga de zinco fundida de alta densidade com mola de retenção testada para mais de 10.000 ciclos de abertura e fechamento sem afrouxamento.
* **Ajuste Angular:** Rotação horizontal de 360° e basculamento vertical de 0° a 150°, servindo como suporte para chamadas de vídeo, consumo de mídia e anel de segurança para os dedos.
* **Atração Magnética:** Anel embutido compatível com o ecossistema magnético MagSafe e suportes de painel automotivos.`,
      keyBenefitsBullets: [
        'Certificação militar MIL-STD-810G contra quedas severas de até 3.8 metros de altura em concreto',
        'Anel kickstand rotativo 360° em liga de zinco ultra-resistente para apoio em modo retrato e paisagem',
        'Recorte chanfrado desenhado com tolerância de 0.2mm para fácil extração da caneta S Pen',
        'Compatível com carregadores Qi sem fio e acessórios magnéticos MagSafe',
        'Bordas elevadas de 2.2mm para proteção absoluta do módulo óptico quádruplo',
      ],
      targetAudienceProfile: 'Profissionais de campo, praticantes de esportes ao ar livre, trabalhadores da construção civil e usuários propensos a acidentes com seus dispositivos.',
      boxContents: [
        'Capa ArmorX Defense Rugged com Kickstand 360°',
        'Certificado de conformidade de teste de queda militar',
      ],
      compatibilityNotes: 'Exclusiva para Samsung Galaxy S24 Ultra (6.8"). O recorte da S Pen permite remoção instantânea sem interferência de espessura.',
    },
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80',
      imgKevlarCase,
    ],
    tags: ['Rugged', 'Shockproof 3.8m', 'Kickstand 360', 'MagSafe', 'S24 Ultra', 'Militar MIL-STD-810G'],
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2025-01-28T10:00:00Z',
  },
  {
    id: 'prod-hp-001',
    sku: 'HP-SNY-WH1000XM5-BLK',
    ean: '4548736132566',
    name: 'Headphone Bluetooth Sony WH-1000XM5 Noise Cancelling Hi-Res LDAC',
    brand: 'Sony',
    category: 'headphones',
    model: 'WH-1000XM5/B',
    color: 'Preto Fosco (Black)',
    releaseYear: 2023,
    status: 'active',
    pricing: {
      costPrice: 1450.0,
      regularPrice: 2499.0,
      promotionalPrice: 2199.0,
      marginPercent: 34.0,
      taxRatePercent: 12.0,
      currency: 'BRL',
    },
    stock: {
      physical: 42,
      reserved: 6,
      available: 36,
      minSafetyStock: 12,
      reorderPoint: 18,
      leadTimeDays: 8,
      warehouseLocation: 'Galpão Áudio & Periféricos - Setor B1 - Prateleira 03',
      batchNumber: 'LOTE-SNY-2405-BR',
      lastRestockedDate: '2025-01-20',
    },
    headphoneSpecs: {
      formFactor: 'over-ear',
      acousticDesign: 'closed-back',
      driverSizeMm: 30,
      driverType: 'Domos de composto de fibra de carbono leve e rígido com borda de poliuretano macio (TPU)',
      frequencyResponse: '4 Hz - 40.000 Hz (Hi-Res Audio Wireless)',
      impedanceOhms: 48,
      sensitivityDb: 102,
      ancType: 'adaptive_hybrid',
      ancAttenuationDb: 38,
      transparencyMode: true,
      codecs: ['LDAC (990 kbps / 24-bit 96kHz)', 'AAC', 'SBC', 'LC3 (via firmware)'],
      bluetoothVer: '5.2 com Google Fast Pair e Microsoft Swift Pair',
      batteryWithAncHours: 30,
      batteryTotalWithCaseHours: 40,
      fastChargeSpecs: '3 minutos de carga USB-PD = 3 horas de reprodução contínua',
      latencyMs: 65,
      microphonesCount: 8,
      micNoiseSuppression: 'Sistema de 8 microfones com duplo processador integrado (V1 + QN1 HD Noise Cancelling) e algoritmo de IA com redução de ruído de vento',
      multipointSupport: true,
      ipRating: 'Não classificado (Uso indoor / urbano)',
      weightGrams: 250,
      connectionTypes: ['Bluetooth 5.2', 'Cabo de áudio P2 banhado a ouro 3.5mm destacável (1.2m)', 'USB-C'],
    },
    copy: {
      marketplaceTitle: 'Headphone Sony WH-1000XM5 Cancelamento Ruído ANC 8 Mics LDAC Hi-Res 30h',
      seoMetaTitle: 'Sony WH-1000XM5 Headphone com Cancelamento de Ruído ANC e Hi-Res LDAC',
      seoMetaDescription: 'Compre o Sony WH-1000XM5 com dois processadores de ruído (V1 e QN1), drivers de fibra de carbono, codec LDAC e até 30h de bateria. Envio rápido.',
      shortPitch: 'A referência absoluta em cancelamento de ruído com 8 microfones, processadores duplos V1/QN1, drivers de fibra de carbono e transmissão Hi-Res LDAC de até 990 kbps.',
      technicalMarkdownDescription: `## Arquitetura Acústica & Processamento Digital de Sinal (DSP)

O headphone **Sony WH-1000XM5** representa o ápice da engenharia eletroacústica portátil, projetado com um novo chassi acústico sem costuras que minimiza a ressonância harmônica e a turbulência de ar ao redor das conchas auriculares.

### Unidade de Driver Especializada de 30mm
* **Composição do Diafragma:** Cúpula moldada em fibra de carbono de alta rigidez combinada com borda flexível em poliuretano termoplástico.
* **Resposta Transitória:** A leveza do carbono permite uma aceleração instantânea na membrana, resultando em frequências agudas cristalinas de até 40.000 Hz sem distorção por intermodulação (*THD < 0.05%*).
* **Solda de Alta Fidelidade com Ouro:** Utilização de liga proprietária sem chumbo contendo micro-partículas de ouro para otimizar o fluxo de sinal de áudio e a relação sinal-ruído (SNR).

### Sistema ANC de Dupla Unidade de Controle
* **Processadores:** Integração do **HD Noise Cancelling Processor QN1** com o **Integrated Processor V1** da Sony.
* **Matriz de 8 Microfones:** Quatro microfones em cada concha capturam ruídos de alta frequência (vozes humanas, ruídos urbanos de tráfego) com amostragem contínua para cancelamento em fase invertida em tempo real.
* **Auto NC Optimizer:** Ajusta a pressão acústica de atenuação dinamicamente de acordo com as condições de uso e a altitude barométrica em voos.

### Conectividade Hi-Res & Codec LDAC
* **Transmissão sem Perdas:** Suporte ao codec **Sony LDAC**, transmitindo aproximadamente 3x mais dados (990 kbps) que o Bluetooth SBC convencional a 24-bit / 96 kHz.
* **Multipoint:** Permite conexão simultânea e comutação instantânea entre dois dispositivos (ex: Notebook corporativo e Smartphone).`,
      keyBenefitsBullets: [
        'Cancelamento de ruído líder da indústria com 8 microfones e processadores dedicados Sony QN1 + V1',
        'Drivers de 30mm com cúpula em fibra de carbono para fidelidade sonora Hi-Res de 4Hz a 40kHz',
        'Codec LDAC de 990 kbps para reprodução de áudio sem perdas (Lossless) em alta resolução',
        'Autonomia de até 30 horas com ANC ligado e recarga rápida Power Delivery (3 min = 3 horas)',
        'Conexão Multiponto inteligente com pareamento e troca contínua entre dois dispositivos',
      ],
      targetAudienceProfile: 'Audiófilos urbanos, profissionais em regime home office/escritório barulhento, viajantes frequentes e desenvolvedores que buscam isolamento acústico absoluto e conforto.',
      boxContents: [
        'Headphone Sony WH-1000XM5 Preto',
        'Estojo de transporte rígido e colapsável em tecido premium',
        'Cabo de áudio P2 para P2 de 3.5mm (1.2m)',
        'Cabo de recarga USB-A para USB-C',
        'Manual de instruções e certificado de garantia oficial Sony Brasil',
      ],
      compatibilityNotes: 'Compatível com Android (suporte nativo LDAC e Fast Pair), iOS/iPadOS/macOS (via AAC) e Windows 10/11 (Swift Pair). Otimizado para Apple Music Lossless e Tidal Masters.',
    },
    images: [
      imgSonyXM5,
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['ANC', 'Sony', 'LDAC', 'Hi-Res Audio', '30 Horas', 'Processador QN1', 'Multipoint', '8 Microfones'],
    createdAt: '2023-11-10T10:00:00Z',
    updatedAt: '2025-01-20T17:00:00Z',
  },
  {
    id: 'prod-hp-002',
    sku: 'HP-APL-APP2-USBC',
    ean: '0195949052520',
    name: 'Fone de Ouvido Apple AirPods Pro 2ª Geração MagSafe USB-C',
    brand: 'Apple',
    category: 'headphones',
    model: 'MTJV3AM/A',
    color: 'Branco Brilhante (White)',
    releaseYear: 2023,
    status: 'active',
    pricing: {
      costPrice: 1100.0,
      regularPrice: 1899.0,
      promotionalPrice: 1699.0,
      marginPercent: 35.2,
      taxRatePercent: 12.0,
      currency: 'BRL',
    },
    stock: {
      physical: 54,
      reserved: 9,
      available: 45,
      minSafetyStock: 15,
      reorderPoint: 20,
      leadTimeDays: 7,
      warehouseLocation: 'Galpão Principal - Corredor A2 - Cofre Áudio Apple',
      batchNumber: 'LOTE-APP-2406-BR',
      lastRestockedDate: '2025-02-05',
    },
    headphoneSpecs: {
      formFactor: 'in-ear',
      acousticDesign: 'closed-back',
      driverSizeMm: 11,
      driverType: 'Driver de alta amplitude exclusivo Apple com amplificador de alto alcance dinâmico sob medida',
      frequencyResponse: '20 Hz - 20.000 Hz c/ Equalização Adaptativa em tempo real',
      impedanceOhms: 32,
      sensitivityDb: 104,
      ancType: 'adaptive_hybrid',
      ancAttenuationDb: 35,
      transparencyMode: true,
      codecs: ['AAC-ELD', 'AAC', 'SBC', 'Apple Lossless 20-bit 48kHz (p/ Apple Vision Pro)'],
      bluetoothVer: '5.3',
      batteryWithAncHours: 6,
      batteryTotalWithCaseHours: 30,
      fastChargeSpecs: '5 minutos no estojo fornecem aproximadamente 1 hora de áudio ou conversa',
      latencyMs: 50,
      microphonesCount: 6,
      micNoiseSuppression: 'Dois microfones com filtragem espacial + microfone voltado para dentro + sensor de detecção de voz óptico e acelerômetro',
      multipointSupport: true,
      ipRating: 'IP54 (fones e estojo resistentes a poeira, suor e água)',
      weightGrams: 5.3,
      connectionTypes: ['Bluetooth 5.3', 'Estojo MagSafe USB-C com alto-falante integrado para Busca Precisa'],
    },
    copy: {
      marketplaceTitle: 'Apple AirPods Pro 2ª Geração MagSafe USB-C Cancelamento Ativo Ruído Chip H2',
      seoMetaTitle: 'AirPods Pro 2ª Geração USB-C - Cancelamento Ativo de Ruído e Áudio Espacial',
      seoMetaDescription: 'AirPods Pro 2 com estojo USB-C MagSafe, chip Apple H2, cancelamento de ruído até 2x mais potente e Áudio Espacial Personalizado com rastreamento da cabeça.',
      shortPitch: 'Alimentados pelo avançado silício Apple H2, com Cancelamento Ativo de Ruído 2x mais potente, Áudio Espacial Personalizado dinâmico e novo estojo de recarga USB-C com classificação IP54.',
      technicalMarkdownDescription: `## Arquitetura Eletroacústica & Processamento de Áudio Computacional

Os **AirPods Pro (2ª geração) com estojo USB-C** integram o chip proprietário **Apple H2**, que executa algoritmos avançados de áudio computacional para ajuste acústico em tempo real de até 48.000 vezes por segundo.

### Silício Apple H2 & Transdutor Acústico
* **Driver Customizado:** Transdutor de baixa distorção projetado pela Apple com amplificador de alcance dinâmico sob medida, entregando graves profundos e detalhamento nítido em todas as faixas de volume.
* **Equalização Adaptativa (Adaptive EQ):** O microfone interno mede a pressão acústica no canal auditivo do usuário e calibra as frequências médias e baixas para compensar variações anatômicas de encaixe.

### Cancelamento Ativo de Ruído & Áudio Adaptativo
* **Cancelamento Ativo (ANC):** Atenua até o dobro de ruído em comparação com os AirPods Pro originais através de microfones acústicos com malha de ventilação acústica redesenhada.
* **Áudio Adaptativo:** Combina dinamicamente o Cancelamento Ativo e a Transparência de acordo com a poluição sonora do ambiente.
* **Reconhecimento de Conversa:** Reduz o volume do áudio automaticamente e amplifica as vozes de interlocutores à frente quando o usuário começa a falar.

### Estojo MagSafe USB-C & Localização
* **Chip U1 / Busca Precisa:** O estojo possui alto-falante embutido para emissão de alertas sonoros de localização e compatibilidade com a rede Buscar (Find My).`,
      keyBenefitsBullets: [
        'Processador Apple H2 com algoritmos de áudio computacional e cancelamento ativo 2x mais eficiente',
        'Áudio Espacial Personalizado com rastreamento dinâmico dos movimentos da cabeça para imersão total',
        'Estojo de recarga atualizado com porta universal USB-C e classificação IP54 resistente a água e poeira',
        'Áudio Adaptativo e Reconhecimento de Conversa automático para transição fluida entre isolamento e diálogo',
        'Até 6 horas de áudio contínuo por carga (30 horas totais com o estojo MagSafe)',
      ],
      targetAudienceProfile: 'Usuários do ecossistema Apple (iPhone, Mac, iPad, Apple Watch) que priorizam integração perfeita, cancelamento de ruído em trânsito e qualidade em chamadas.',
      boxContents: [
        'AirPods Pro 2ª Geração',
        'Estojo de recarga MagSafe (USB-C) com alto-falante e cordão de transporte',
        'Pontas de silicone em 4 tamanhos (XS, S, M, L)',
        'Cabo trançado USB-C de recarga (1m)',
        'Documentação oficial Apple Brasil',
      ],
      compatibilityNotes: 'Integração instantânea com iOS 17+, iPadOS 17+, macOS Sonoma e watchOS 10+. Funciona como fone Bluetooth padrão com Android e Windows.',
    },
    images: [
      imgAirPodsPro,
      'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80',
    ],
    tags: ['Chip H2', 'AirPods Pro 2', 'USB-C', 'MagSafe', 'Áudio Espacial', 'IP54', 'Apple', 'ANC'],
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2025-02-05T14:00:00Z',
  },
];

export const INITIAL_CATALOG = INITIAL_PRODUCTS;
