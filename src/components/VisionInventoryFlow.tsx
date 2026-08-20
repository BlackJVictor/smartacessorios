import React, { useState, useEffect, useRef } from 'react';
import { Product, ProductCategory } from '../types';
import {
  Camera,
  Video,
  Play,
  Pause,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  CheckCircle2,
  ScanLine,
  Zap,
  Activity,
  Layers,
  Smartphone,
  Shield,
  Headphones,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Volume2,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export interface StockMovementEvent {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  productSku: string;
  category: ProductCategory;
  type: 'inbound' | 'outbound';
  quantity: number;
  confidenceScore: number;
  dockZone: string;
  reason: 'RECEBIMENTO_FORNECEDOR' | 'EXPEDICAO_PEDIDO' | 'ASSISTENCIA_ENTRADA' | 'ASSISTENCIA_SAIDA' | 'AUDITORIA_INVENTARIO';
  verifiedByAi: boolean;
  boxDimensions?: string;
}

interface VisionInventoryFlowProps {
  products: Product[];
  onUpdateStock: (productId: string, newStock: Partial<Product['stock']>) => void;
}

// Initial realistic timeline data for charts
const INITIAL_TIMELINE_DATA = [
  { time: '08:00', inbound: 14, outbound: 2, netFlow: 12 },
  { time: '09:00', inbound: 22, outbound: 8, netFlow: 14 },
  { time: '10:00', inbound: 18, outbound: 15, netFlow: 3 },
  { time: '11:00', inbound: 35, outbound: 24, netFlow: 11 },
  { time: '12:00', inbound: 8, outbound: 12, netFlow: -4 },
  { time: '13:00', inbound: 12, outbound: 28, netFlow: -16 },
  { time: '14:00', inbound: 40, outbound: 32, netFlow: 8 },
  { time: '15:00', inbound: 25, outbound: 38, netFlow: -13 },
  { time: '16:00', inbound: 19, outbound: 29, netFlow: -10 },
  { time: '17:00', inbound: 15, outbound: 21, netFlow: -6 },
];

const INITIAL_CATEGORY_DATA = [
  { category: 'Smartphones', inbound: 48, outbound: 56, accuracy: 99.2 },
  { category: 'Capinhas Proteção', inbound: 95, outbound: 84, accuracy: 98.4 },
  { category: 'Fones de Ouvido', inbound: 65, outbound: 49, accuracy: 98.9 },
];

const REASON_DISTRIBUTION = [
  { name: 'Expedição E-commerce', value: 52, color: '#06b6d4' },
  { name: 'Recebimento Fornecedor', value: 30, color: '#10b981' },
  { name: 'Assistência Técnica', value: 12, color: '#f59e0b' },
  { name: 'Troca & Garantia', value: 6, color: '#8b5cf6' },
];

export const VisionInventoryFlow: React.FC<VisionInventoryFlowProps> = ({
  products,
  onUpdateStock,
}) => {
  // Live Camera states
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraStreamActive, setCameraStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Vision AI Engine states
  const [isAiScanning, setIsAiScanning] = useState(true);
  const [detectionThreshold, setDetectionThreshold] = useState(85); // 85%
  const [dockZone, setDockZone] = useState('Doca 01 - Recebimento & Triagem Tech');
  const [autoRegister, setAutoRegister] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);

  // Real-time events & charts state
  const [timelineData, setTimelineData] = useState(INITIAL_TIMELINE_DATA);
  const [movements, setMovements] = useState<StockMovementEvent[]>([
    {
      id: 'mov-001',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString('pt-BR'),
      productId: products[0]?.id || '1',
      productName: products[0]?.name || 'Samsung Galaxy S24 Ultra Titanium 512GB',
      productSku: products[0]?.sku || 'S24U-512-TI',
      category: 'smartphones',
      type: 'inbound',
      quantity: 5,
      confidenceScore: 98.7,
      dockZone: 'Doca 01 - Recebimento & Triagem Tech',
      reason: 'RECEBIMENTO_FORNECEDOR',
      verifiedByAi: true,
      boxDimensions: '16.5 x 8.2 x 2.8 cm',
    },
    {
      id: 'mov-002',
      timestamp: new Date(Date.now() - 1000 * 60 * 6).toLocaleTimeString('pt-BR'),
      productId: products[1]?.id || '2',
      productName: products[1]?.name || 'Capinha Anti-Impacto Militar ArmorShield',
      productSku: products[1]?.sku || 'CASE-ARM-PRO',
      category: 'cases',
      type: 'outbound',
      quantity: 2,
      confidenceScore: 99.4,
      dockZone: 'Doca 02 - Expedição E-commerce',
      reason: 'EXPEDICAO_PEDIDO',
      verifiedByAi: true,
      boxDimensions: '18.0 x 9.5 x 1.5 cm',
    },
    {
      id: 'mov-003',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toLocaleTimeString('pt-BR'),
      productId: products[2]?.id || '3',
      productName: products[2]?.name || 'Sony WH-1000XM5 Noise Cancelling',
      productSku: products[2]?.sku || 'SONY-WH5-BLK',
      category: 'headphones',
      type: 'outbound',
      quantity: 1,
      confidenceScore: 97.9,
      dockZone: 'Doca 02 - Expedição E-commerce',
      reason: 'EXPEDICAO_PEDIDO',
      verifiedByAi: true,
      boxDimensions: '22.0 x 20.5 x 7.5 cm',
    },
  ]);

  // Current detected object in optical laser frame
  const [currentDetection, setCurrentDetection] = useState<{
    product: Product;
    type: 'inbound' | 'outbound';
    confidence: number;
    bbox: { x: number; y: number; width: number; height: number };
    detectedAt: number;
  } | null>(null);

  // Aggregated totals
  const totalInboundToday = movements
    .filter((m) => m.type === 'inbound')
    .reduce((acc, m) => acc + m.quantity, 0);
  const totalOutboundToday = movements
    .filter((m) => m.type === 'outbound')
    .reduce((acc, m) => acc + m.quantity, 0);
  const netBalance = totalInboundToday - totalOutboundToday;
  const averageConfidence =
    movements.length > 0
      ? (movements.reduce((acc, m) => acc + m.confidenceScore, 0) / movements.length).toFixed(1)
      : '98.5';

  // Handle Real Camera Activation
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (useRealCamera) {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
            setCameraStreamActive(true);
            setCameraError(null);
          }
        })
        .catch((err) => {
          console.warn('Erro ao acessar webcam:', err);
          setCameraError('Permissão da câmera não concedida ou dispositivo não encontrado. Alternando para o Simulador de Doca.');
          setUseRealCamera(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const activeStream = videoRef.current.srcObject as MediaStream;
        activeStream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraStreamActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useRealCamera]);

  // AI Detection Loop Simulation (runs realistic machine learning classification frames)
  useEffect(() => {
    if (!isAiScanning || products.length === 0) return;

    const interval = setInterval(() => {
      // Pick a random product from inventory
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const flowType: 'inbound' | 'outbound' = Math.random() > 0.45 ? 'outbound' : 'inbound';
      const confidence = Number((96.5 + Math.random() * 3.3).toFixed(1));

      // Bounding box simulation
      const bbox = {
        x: Math.floor(15 + Math.random() * 45),
        y: Math.floor(20 + Math.random() * 40),
        width: Math.floor(25 + Math.random() * 15),
        height: Math.floor(25 + Math.random() * 15),
      };

      setCurrentDetection({
        product: randomProduct,
        type: flowType,
        confidence,
        bbox,
        detectedAt: Date.now(),
      });

      // If auto-register is active and confidence is above threshold, register the movement!
      if (autoRegister && confidence >= detectionThreshold) {
        registerMovement(
          randomProduct,
          flowType,
          1,
          confidence,
          flowType === 'inbound' ? 'RECEBIMENTO_FORNECEDOR' : 'EXPEDICAO_PEDIDO'
        );
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isAiScanning, products, autoRegister, detectionThreshold]);

  // Register Movement in state and ERP Stock
  const registerMovement = (
    product: Product,
    type: 'inbound' | 'outbound',
    quantity: number,
    confidenceScore: number,
    reason: StockMovementEvent['reason']
  ) => {
    const newEvent: StockMovementEvent = {
      id: `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      category: product.category,
      type,
      quantity,
      confidenceScore,
      dockZone,
      reason,
      verifiedByAi: true,
      boxDimensions:
        product.category === 'smartphones'
          ? '16.5 x 8.0 x 3.0 cm'
          : product.category === 'cases'
          ? '18.0 x 9.0 x 1.2 cm'
          : '22.0 x 20.0 x 7.0 cm',
    };

    // Update movements log
    setMovements((prev) => [newEvent, ...prev.slice(0, 30)]);

    // Update real product stock
    const currentStock = product.stock;
    const delta = type === 'inbound' ? quantity : -quantity;
    const newPhysical = Math.max(0, currentStock.physical + delta);
    const newAvailable = Math.max(0, newPhysical - currentStock.reserved);

    onUpdateStock(product.id, {
      physical: newPhysical,
      available: newAvailable,
    });

    // Update chart timeline
    const currentHour = `${new Date().getHours()}:00`;
    setTimelineData((prev) => {
      return prev.map((item) => {
        if (item.time === currentHour || item.time.startsWith(`${new Date().getHours()}`)) {
          return {
            ...item,
            inbound: type === 'inbound' ? item.inbound + quantity : item.inbound,
            outbound: type === 'outbound' ? item.outbound + quantity : item.outbound,
            netFlow: item.netFlow + (type === 'inbound' ? quantity : -quantity),
          };
        }
        return item;
      });
    });

    // Sound effect trigger (audio chime if enabled)
    if (soundAlerts && 'speechSynthesis' in window) {
      // Optional subtle voice chime
    }
  };

  const handleManualTrigger = (product: Product, type: 'inbound' | 'outbound') => {
    registerMovement(product, type, 1, 99.8, type === 'inbound' ? 'RECEBIMENTO_FORNECEDOR' : 'EXPEDICAO_PEDIDO');
  };

  const handleExportMovements = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(movements, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `relatorio_telemetria_ia_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-5 rounded-2xl border border-cyan-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Camera className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <span>Visão Computacional & Telemetria IA de Estoque</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Ao Vivo (Real-Time)
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Reconhecimento automatizado por Machine Learning de embalagens tech, leitura volumétrica e fluxo de entrada/saída em tempo real.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setUseRealCamera(!useRealCamera)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              useRealCamera
                ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{useRealCamera ? 'Câmera Real Ativa' : 'Ativar Câmera WebCam'}</span>
          </button>

          <button
            onClick={() => setIsAiScanning(!isAiScanning)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition border ${
              isAiScanning
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-amber-600 text-white border-amber-400'
            }`}
          >
            {isAiScanning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAiScanning ? 'Pausar IA' : 'Retomar IA'}</span>
          </button>

          <button
            onClick={handleExportMovements}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium transition"
            title="Exportar Registro de Telemetria"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Dados</span>
          </button>
        </div>
      </div>

      {cameraError && (
        <div className="p-3.5 bg-amber-950/80 border border-amber-800 text-amber-200 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{cameraError}</span>
          </div>
          <button
            onClick={() => setCameraError(null)}
            className="text-[11px] font-bold text-amber-400 hover:text-white underline"
          >
            Dispensar
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Inbound Today */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Entradas Hoje (Inbound)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            +{totalInboundToday} <span className="text-xs font-normal text-slate-400">unidades</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span className="text-emerald-400 font-bold">100%</span>
            <span>reconhecidas pela IA de doca</span>
          </div>
        </div>

        {/* Outbound Today */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Saídas Hoje (Outbound)</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-2">
            -{totalOutboundToday} <span className="text-xs font-normal text-slate-400">unidades</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Expedição e-commerce & entregas
          </div>
        </div>

        {/* Net Flow Balance */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Saldo Líquido de Giro</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black mt-2 ${netBalance >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
            {netBalance >= 0 ? `+${netBalance}` : netBalance}{' '}
            <span className="text-xs font-normal text-slate-400">unidades líquidas</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Balanço dinâmico do estoque
          </div>
        </div>

        {/* IA Model Accuracy */}
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Acurácia do Modelo IA</span>
            <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-violet-400 mt-2">
            {averageConfidence}%
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>YOLOv8 Edge Vision Tech</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Camera Stream with Computer Vision Overlay (Left) + Controls & Real-time detection (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Camera Live Stream & Computer Vision HUD */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="relative flex items-center justify-center">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Feed da Câmera IA • {dockZone}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                60 FPS • 1080p
              </span>
            </div>
          </div>

          {/* Camera Viewport Canvas */}
          <div className="relative flex-1 min-h-[360px] bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* Real Webcam Video or Simulated Conveyor Background */}
            {useRealCamera ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover min-h-[360px]"
              />
            ) : (
              <div className="w-full h-full min-h-[360px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center relative p-6">
                {/* Simulated Conveyor Belt Lines */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]" />
                
                {/* Simulated Package in Center */}
                {currentDetection && (
                  <div
                    className="absolute transition-all duration-700 ease-out flex flex-col items-center justify-center"
                    style={{
                      left: `${currentDetection.bbox.x}%`,
                      top: `${currentDetection.bbox.y}%`,
                      width: `${currentDetection.bbox.width}%`,
                      height: `${currentDetection.bbox.height}%`,
                    }}
                  >
                    <div
                      className={`w-full h-full rounded-xl border-2 border-dashed ${
                        currentDetection.type === 'inbound'
                          ? 'border-emerald-400 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                          : 'border-rose-400 bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                      } flex flex-col items-center justify-center p-2 text-center transition`}
                    >
                      {currentDetection.product.category === 'smartphones' && (
                        <Smartphone className="w-7 h-7 text-cyan-400 mb-1 animate-bounce" />
                      )}
                      {currentDetection.product.category === 'cases' && (
                        <Shield className="w-7 h-7 text-emerald-400 mb-1 animate-bounce" />
                      )}
                      {currentDetection.product.category === 'headphones' && (
                        <Headphones className="w-7 h-7 text-violet-400 mb-1 animate-bounce" />
                      )}
                      <span className="text-[10px] font-black text-white line-clamp-1">
                        {currentDetection.product.name}
                      </span>
                    </div>
                  </div>
                )}

                {/* Conveyor Guides */}
                <div className="w-full max-w-md h-28 border-y-2 border-dashed border-slate-700 relative flex items-center justify-between px-6">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                    ◀ ESTEIRA DE FLUXO LOGÍSTICO
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                    SENSOR ÓPTICO ATIVO ▶
                  </div>
                </div>
              </div>
            )}

            {/* Computer Vision HUD Overlay */}
            {/* 1. Virtual Laser Tripwire (Linha Óptica de Contabilização) */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#38bdf8] pointer-events-none z-10 opacity-80 flex flex-col justify-between py-4">
              <span className="bg-cyan-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded -translate-x-1/2">
                LINHA LASER IA (GATILHO DE ENTRADA/SAÍDA)
              </span>
              <span className="bg-cyan-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded -translate-x-1/2">
                ZONA SEGURA
              </span>
            </div>

            {/* 2. Top Vision Telemetry Badge */}
            <div className="absolute top-3 left-3 z-20 bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 text-[11px] space-y-1">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                <ScanLine className="w-3.5 h-3.5" />
                <span>YOLOv8-Edge Neural Engine</span>
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                Latência: <strong className="text-emerald-400">14ms</strong> • Resolução: 1920x1080
              </div>
            </div>

            {/* 3. Real-time Detection Tag on Object */}
            {currentDetection && (
              <div
                className="absolute z-20 pointer-events-none transition-all duration-300"
                style={{
                  left: `${Math.max(5, currentDetection.bbox.x)}%`,
                  top: `${Math.max(5, currentDetection.bbox.y - 12)}%`,
                }}
              >
                <div
                  className={`px-2.5 py-1.5 rounded-lg font-mono text-[10px] font-black uppercase flex items-center space-x-1.5 shadow-xl ${
                    currentDetection.type === 'inbound'
                      ? 'bg-emerald-600 text-white border border-emerald-400 shadow-emerald-600/40'
                      : 'bg-rose-600 text-white border border-rose-400 shadow-rose-600/40'
                  }`}
                >
                  <Zap className="w-3 h-3" />
                  <span>
                    {currentDetection.type === 'inbound' ? '🟢 ENTRADA IDENTIFICADA' : '🔴 SAÍDA IDENTIFICADA'} •{' '}
                    {currentDetection.confidence}% CONF.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Camera Footer Controls */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRegister}
                  onChange={(e) => setAutoRegister(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-slate-300 font-medium">Contabilização Automática no ERP</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <span className="text-slate-300 font-medium">Alertas Sonoros</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-400">Sensibilidade IA:</span>
              <input
                type="range"
                min="70"
                max="98"
                value={detectionThreshold}
                onChange={(e) => setDetectionThreshold(Number(e.target.value))}
                className="w-20 accent-cyan-400"
              />
              <span className="font-mono font-bold text-cyan-400 text-xs">{detectionThreshold}%</span>
            </div>
          </div>
        </div>

        {/* Quick Simulation & Live Detection Card (Right) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Detected Product Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <ScanLine className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Item sob a Câmera Agora</h3>
                  <span className="text-[10px] text-slate-400">Classificação Neural Instantânea</span>
                </div>
              </div>

              {currentDetection && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentDetection.type === 'inbound'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {currentDetection.type === 'inbound' ? 'Sentido: Recebimento' : 'Sentido: Expedição'}
                </span>
              )}
            </div>

            {currentDetection ? (
              <div className="space-y-3">
                <div className="flex items-start space-x-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  {currentDetection.product.images && currentDetection.product.images.length > 0 ? (
                    <img
                      src={currentDetection.product.images[0]}
                      alt={currentDetection.product.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      <Smartphone className="w-6 h-6 text-cyan-400" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                      {currentDetection.product.name}
                    </h4>
                    <div className="text-[11px] font-mono text-slate-400 mt-1 flex flex-wrap gap-x-2">
                      <span>SKU: {currentDetection.product.sku}</span>
                      <span>EAN: {currentDetection.product.ean}</span>
                    </div>
                    <div className="text-[10px] text-cyan-400 font-semibold mt-1">
                      Saldo em Estoque: {currentDetection.product.stock.physical} un (Disponível:{' '}
                      {currentDetection.product.stock.available})
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Score de Confiança</span>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">
                      {currentDetection.confidence}%
                    </div>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Localização WMS</span>
                    <div className="text-xs font-bold text-slate-200 mt-0.5 truncate">
                      {currentDetection.product.stock.warehouseLocation}
                    </div>
                  </div>
                </div>

                {/* Manual Force Inbound / Outbound Trigger buttons */}
                <div className="pt-1 flex items-center space-x-2">
                  <button
                    onClick={() => handleManualTrigger(currentDetection.product, 'inbound')}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-1.5"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    <span>Contabilizar Entrada (+1)</span>
                  </button>

                  <button
                    onClick={() => handleManualTrigger(currentDetection.product, 'outbound')}
                    className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center space-x-1.5"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>Contabilizar Saída (-1)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <ScanLine className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                <p>Aguardando passagem de pacote pela linha de laser da câmera...</p>
              </div>
            )}
          </div>

          {/* Quick Manual Simulator Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <span className="text-xs font-bold text-slate-300">Simular Passagem Rápida por Categoria:</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  const p = products.find((x) => x.category === 'smartphones') || products[0];
                  if (p) handleManualTrigger(p, 'inbound');
                }}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700 text-[11px] font-bold transition flex flex-col items-center justify-center space-y-1"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>+1 Smartphone</span>
              </button>

              <button
                onClick={() => {
                  const p = products.find((x) => x.category === 'cases') || products[0];
                  if (p) handleManualTrigger(p, 'outbound');
                }}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-emerald-950 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-700 text-[11px] font-bold transition flex flex-col items-center justify-center space-y-1"
              >
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>-1 Capinha</span>
              </button>

              <button
                onClick={() => {
                  const p = products.find((x) => x.category === 'headphones') || products[0];
                  if (p) handleManualTrigger(p, 'outbound');
                }}
                className="p-2.5 rounded-xl bg-slate-950 hover:bg-violet-950 text-slate-300 hover:text-violet-300 border border-slate-800 hover:border-violet-700 text-[11px] font-bold transition flex flex-col items-center justify-center space-y-1"
              >
                <Headphones className="w-4 h-4 text-violet-400" />
                <span>-1 Fone ANC</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REAL-TIME CHARTS SECTION (Recharts)                                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Hourly Flow Timeline (Inbound vs Outbound Area Chart) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Fluxo Temporal de Entradas e Saídas por Hora (Tempo Real)</span>
              </h3>
              <p className="text-xs text-slate-400">Contabilização contínua de movimentações geradas pela Câmera IA</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span>Entradas (Inbound)</span>
              </span>
              <span className="flex items-center space-x-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span>Saídas (Outbound)</span>
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="inbound"
                  name="Entradas (+un)"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorInbound)"
                />
                <Area
                  type="monotone"
                  dataKey="outbound"
                  name="Saídas (-un)"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorOutbound)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Movement Distribution by Origin / Destination (Pie / Donut Chart) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Distribuição por Motivo Logístico</h3>
            <p className="text-xs text-slate-400">Origem e destino das leituras ópticas</p>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={REASON_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {REASON_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            {REASON_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chart 3 & Category Comparison (Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">Volume por Categoria Tech (Entradas vs Saídas)</h3>
            <p className="text-xs text-slate-400">Smartphones, Capinhas e Fones de Ouvido</p>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INITIAL_CATEGORY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="inbound" name="Entradas (+un)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outbound" name="Saídas (-un)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Stream Detection Table / Events Feed */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Log em Tempo Real da Câmera IA (Stream)</span>
              </h3>
              <p className="text-xs text-slate-400">Últimos pacotes contabilizados no ERP</p>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              {movements.length} eventos registrados
            </span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[250px] space-y-2 pr-1">
            {movements.map((mov) => (
              <div
                key={mov.id}
                className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${
                      mov.type === 'inbound'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {mov.type === 'inbound' ? (
                      <ArrowDownLeft className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-white truncate max-w-[200px] sm:max-w-[280px]">
                      {mov.productName}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-2">
                      <span>{mov.timestamp}</span>
                      <span>• SKU: {mov.productSku}</span>
                      <span className="text-cyan-400">IA: {mov.confidenceScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-black text-xs ${
                      mov.type === 'inbound' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {mov.type === 'inbound' ? `+${mov.quantity}` : `-${mov.quantity}`} un
                  </span>
                  <div className="text-[9px] text-slate-500 font-mono">{mov.reason.split('_')[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
