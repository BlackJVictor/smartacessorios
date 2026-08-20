export type ProductCategory = 'smartphones' | 'cases' | 'headphones';

export type StoreNavCategory = ProductCategory | 'repairs' | 'all';

export type ProductStatus = 'active' | 'draft' | 'archived';

export type NavTab = 'catalog' | 'copywriter' | 'inventory' | 'repairs' | 'payloads' | 'copilot';

export type AppMode = 'storefront' | 'admin';

export type RepairDeviceType = 'smartphone' | 'notebook';

export type RepairStatus = 'pending' | 'analyzing' | 'waiting_parts' | 'repairing' | 'completed' | 'delivered';

export interface RepairOrder {
  id: string;
  protocol: string;
  deviceType: RepairDeviceType;
  brand: string;
  model: string;
  year: string | number;
  problemDescription: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  estimatedDays: number; // 3 days for phone, 15 days for notebook
  status: RepairStatus;
  quotedPrice?: number;
  technicianNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface UserChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export type UserItemType = 'note' | 'checklist' | 'event' | 'reminder';

export interface UserNoteChecklist {
  id: string;
  userId?: string;
  type: UserItemType;
  title: string;
  content?: string;
  isCompleted?: boolean;
  checklistItems?: UserChecklistItem[];
  dueDate?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address?: CustomerAddress;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerUser;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    cardLast4?: string;
    cardHolderName?: string;
    installments?: number;
    pixQrCode?: string;
    pixCopyPaste?: string;
    boletoBarcode?: string;
    boletoDueDate?: string;
  };
  paymentStatus: 'pending' | 'paid' | 'processing';
  createdAt: string;
}

export interface SmartphoneSpecs {
  chipset: string;
  cpuArchitecture: string;
  gpu: string;
  ramGb: number;
  ramType: string; // LPDDR5X, etc.
  storageGb: number;
  storageType: string; // UFS 4.0, NVMe, etc.
  expandableStorage: boolean;
  displayType: string; // Dynamic AMOLED 2X, Super Retina XDR OLED, etc.
  displaySizeInches: number;
  refreshRateHz: number;
  resolution: string; // 3120 x 1440, etc.
  peakBrightnessNits: number;
  batteryMah: number;
  chargingSpeedWatts: number;
  wirelessChargingWatts: number;
  reverseWirelessCharging: boolean;
  cameraMainMp: number;
  cameraMainSensor: string;
  cameraUltraWideMp: number;
  cameraTelephotoMp: number;
  opticalZoom: string;
  cameraFrontMp: number;
  videoRecordingMax: string;
  network5G: boolean;
  simType: string; // Dual SIM (nano-SIM e eSIM)
  wifiGen: string; // Wi-Fi 7 (802.11be), Wi-Fi 6E
  bluetoothVer: string; // 5.4, 5.3
  nfc: boolean;
  ipRating: string; // IP68
  os: string;
  weightGrams: number;
  dimensionsMm: string;
  biometrics: string[]; // Leitor ultrassônico sob a tela, Face ID, etc.
}

export interface CaseSpecs {
  material: string; // Fibra de Aramida Kevlar 1500D, Policarbonato + TPU, Silicone Líquido
  dropProtectionRatingMeters: number; // 3.5m, 4.0m
  militaryStandard: string; // MIL-STD-810G, MIL-STD-810H
  magSafeCompatible: boolean;
  magnetStrengthGauss: number; // 1500 Gauss, Neodímio N52
  thicknessMm: number; // 0.6mm, 1.2mm
  raisedLipCameraMm: number; // 1.5mm
  raisedLipScreenMm: number; // 1.2mm
  innerLining: string; // Microfibra macia, dissipação térmica grafeno
  finishTexture: string; // Matte Soft-Touch, Carbon Fiber Woven, Transparente Anti-Amarelamento
  compatibleModels: string[];
  wirelessChargingPassThrough: boolean;
  weightGrams: number;
  specialFeatures: string[]; // Botão de Ação tátil em alumínio, Kickstand magnético 360°, etc.
}

export interface HeadphoneSpecs {
  formFactor: 'over-ear' | 'in-ear' | 'on-ear';
  acousticDesign: 'closed-back' | 'open-back' | 'hybrid';
  driverSizeMm: number;
  driverType: string; // Dinâmico com diafragma de fibra de carbono, Planar Magnético, Armadura Balanceada
  frequencyResponse: string; // 4Hz - 40.000Hz (Hi-Res Audio)
  impedanceOhms: number;
  sensitivityDb: number;
  ancType: 'adaptive_hybrid' | 'active' | 'passive';
  ancAttenuationDb: number; // até -38dB
  transparencyMode: boolean;
  codecs: string[]; // LDAC, aptX Adaptive, aptX Lossless, AAC, SBC, LC3
  bluetoothVer: string; // 5.3, 5.4 LE Audio
  batteryWithAncHours: number;
  batteryTotalWithCaseHours: number;
  fastChargeSpecs: string; // 10 min de carga = 5 horas de reprodução
  latencyMs: number; // 40ms Gaming Mode
  microphonesCount: number;
  micNoiseSuppression: string; // Formação de feixes AI com sensor de condução óssea
  multipointSupport: boolean;
  ipRating: string; // IPX4, IP55
  weightGrams: number;
  connectionTypes: string[]; // Bluetooth, USB-C Audio Lossless, P2 3.5mm
}

export interface ProductStock {
  physical: number;
  reserved: number;
  available: number;
  minSafetyStock: number;
  reorderPoint: number;
  leadTimeDays: number;
  warehouseLocation: string; // Rua 04 - Prateleira B - Nível 2
  batchNumber: string;
  lastRestockedDate: string;
}

export interface ProductPricing {
  costPrice: number;
  regularPrice: number;
  promotionalPrice?: number;
  marginPercent: number;
  taxRatePercent?: number;
  currency: string;
}

export interface ProductCopy {
  marketplaceTitle: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
  shortPitch: string;
  technicalMarkdownDescription: string;
  keyBenefitsBullets: string[];
  targetAudienceProfile: string;
  boxContents: string[];
  compatibilityNotes?: string;
}

export interface Product {
  id: string;
  sku: string;
  ean: string;
  name: string;
  brand: string;
  category: ProductCategory;
  model: string;
  color: string;
  releaseYear: number;
  status: ProductStatus;
  pricing: ProductPricing;
  stock: ProductStock;
  smartphoneSpecs?: SmartphoneSpecs;
  caseSpecs?: CaseSpecs;
  headphoneSpecs?: HeadphoneSpecs;
  copy: ProductCopy;
  images?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type PayloadSchemaType = 
  | 'rest_catalog_ingest'
  | 'stock_sync_webhook'
  | 'marketplace_feed'
  | 'schema_org_json_ld'
  | 'vtex_product_payload';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    codeBlock?: string;
    schemaType?: string;
    suggestedActions?: string[];
  };
}
