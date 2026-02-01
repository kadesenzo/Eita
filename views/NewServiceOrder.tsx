
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, Trash2, Wrench, ChevronLeft, X,
  User, Search, Loader2, Check, ImageIcon, Car, Info, Download, Phone, Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Client, Vehicle, OSItem, OSStatus, ServiceOrder, PaymentStatus, UserSession } from '../types';
import html2canvas from 'html2canvas';

const NewServiceOrder: React.FC<{ session?: UserSession; syncData?: (key: string, data: any) => Promise<void> }> = ({ session, syncData }) => {
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [step, setStep] = useState<'CLIENTE' | 'VEICULO' | 'ITENS' | 'FINAL'>('CLIENTE');
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  
  const [items, setItems] = useState<OSItem[]>([]);
  const [labor, setLabor] = useState<string>('0');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDENTE);
  
  const [finalOs, setFinalOs] = useState<ServiceOrder | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session) {
      const savedClients = JSON.parse(localStorage.getItem(`kaen_${session.username}_clients`) || '[]');
      const savedVehicles = JSON.parse(localStorage.getItem(`kaen_${session.username}_vehicles`) || '[]');
      setClients(savedClients);
      setVehicles(savedVehicles);
    }
  }, [session]);

  const totalValue = useMemo(() => {
    const itemsTotal = items.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
    return itemsTotal + (parseFloat(labor) || 0);
  }, [items, labor]);

  const handleFinalize = async () => {
    if (!selectedClient || !selectedVehicle || !session || !syncData) return;
    setIsSaving(true);
    try {
      const osNumber = `${Math.floor(100000 + Math.random() * 899999)}`;
      const os: ServiceOrder = {
        id: Math.random().toString(36).substr(2, 9),
        osNumber,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        vehicleId: selectedVehicle.id,
        vehiclePlate: selectedVehicle.plate,
        vehicleModel: selectedVehicle.model,
        vehicleKm: selectedVehicle.km.toString(),
        problem: 'MANUTENÇÃO TÉCNICA KAEN',
        items,
        laborValue: parseFloat(labor) || 0,
        discount: 0,
        totalValue,
        status: OSStatus.FINALIZADO,
        paymentStatus,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const currentOrders = JSON.parse(localStorage.getItem(`kaen_${session.username}_orders`) || '[]');
      await syncData('orders', [...currentOrders, os]);
      setFinalOs(os);
      setStep('FINAL');
    } catch (error) {
      alert("ERRO NO PROCESSAMENTO.");
    } finally {
      setIsSaving(false);
    }
  };

  const downloadImage = async () => {
    const target = document.getElementById('render-target-hidden');
    if (!target || !finalOs || !previewRef.current) return;
    setIsSaving(true);
    const clone = previewRef.current.cloneNode(true) as HTMLDivElement;
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.borderRadius = '0'; 
    target.innerHTML = '';
    target.appendChild(clone);
    try {
      const canvas = await html2canvas(clone, { scale: 2.5, backgroundColor: "#ffffff", useCORS: true, width: 720, height: 1280 });
      const link = document.createElement('a');
      link.download = `KAEN_OS_${finalOs.osNumber}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      alert("Erro ao capturar imagem.");
    } finally {
      target.innerHTML = ''; 
      setIsSaving(false);
    }
  };

  const densityClass = useMemo(() => {
    const totalLines = items.length + (parseFloat(labor) > 0 ? 1 : 0);
    if (totalLines > 18) return 'micro-mode';
    if (totalLines > 10) return 'compact-mode';
    return '';
  }, [items, labor]);

  const InvoiceTemplate = ({ os }: { os: ServiceOrder }) => (
    <div className={`kaen-invoice-render ${densityClass}`}>
      <div className="inv-section-header">
        <div className="flex justify-between items-start h-full">
          <div className="flex flex-col gap-4">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white">
              <Wrench size={32} />
            </div>
            <div>
               <h1 className="text-2xl font-black tracking-tighter uppercase leading-none italic">KAEN</h1>
               <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic mt-1">PERFORMANCE & DIAGNÓSTICO</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1 italic">ORDEM DE SERVIÇO</p>
            <p className="text-4xl font-black leading-none mb-2 tracking-tighter">#{os.osNumber}</p>
            <p className="text-[11px] font-bold text-zinc-500 uppercase">{new Date(os.createdAt).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>

      <div className="inv-section-info">
        <div className="grid grid-cols-1 gap-4 h-full">
          <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100 flex flex-col justify-center">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 italic">PROPRIETÁRIO</p>
            <p className="text-2xl font-black uppercase leading-none tracking-tighter italic">{os.clientName}</p>
          </div>
          <div className="bg-zinc-50 p-8 rounded-[2.5rem] border border-zinc-100 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 italic">PLACA / MODELO</p>
              <p className="text-2xl font-black uppercase tracking-widest italic">{os.vehiclePlate}</p>
              <p className="text-[11px] font-bold text-zinc-400 uppercase mt-2 italic">{os.vehicleModel}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2 italic">KM ATUAL</p>
              <p className="text-2xl font-black italic tracking-tighter">{os.vehicleKm || '0'} KM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="inv-section-table">
        <table className="invoice-table">
          <thead>
            <tr>
              <th className="col-desc">DESCRIÇÃO TÉCNICA</th>
              <th className="col-qtd">QTD</th>
              <th className="col-total">TOTAL</th>
            </tr>
          </thead>
          <tbody className="font-bold">
            {os.items.map((i, idx) => (
              <tr key={idx}>
                <td className="col-desc uppercase tracking-tight italic">{i.description}</td>
                <td className="col-qtd text-zinc-300 italic">{i.quantity.toString().padStart(2, '0')}</td>
                <td className="col-total">R$ {(i.quantity * i.unitPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
            {os.laborValue > 0 && (
              <tr className="bg-zinc-50/50">
                <td className="col-desc uppercase italic font-black">MÃO DE OBRA ESPECIALIZADA</td>
                <td className="col-qtd text-zinc-300 italic">01</td>
                <td className="col-total">R$ {os.laborValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="inv-section-footer">
        <div className="flex justify-between items-end h-full pb-10">
           <div className="flex flex-col gap-8">
              <div className="inline-flex px-8 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest bg-zinc-50 border-zinc-100 text-zinc-600">SITUAÇÃO: FINALIZADO</div>
              <div className="w-40 pt-4 border-t border-zinc-200">
                 <p className="text-[8px] font-black text-zinc-300 uppercase text-center tracking-widest italic">ASSINATURA KAEN</p>
              </div>
           </div>
           <div className="bg-black px-12 py-8 rounded-[3rem] flex flex-col items-end shadow-2xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">TOTAL LÍQUIDO</p>
              <p className="text-5xl font-black text-white italic tracking-tighter leading-none">R$ {os.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-black text-white items-center w-full">
      <div className="w-full p-6 flex items-center justify-between glass-card sticky top-0 z-50 rounded-b-[2rem]">
        <button onClick={() => navigate(-1)} className="p-4 bg-white/5 rounded-full text-zinc-500 hover:text-white border border-white/10 active:scale-90 transition-all"><ChevronLeft size={24} /></button>
        <h2 className="text-[11px] font-black uppercase tracking-[0.5em] italic">CENTRAL DE NOTAS <span className="text-[#FF2D55]">KAEN</span></h2>
        <div className="w-16"></div>
      </div>
      <div className="flex-1 w-full max-w-4xl p-6 md:p-12 space-y-12 pb-40 flex flex-col items-center">
        {step === 'CLIENTE' && (
          <div className="w-full max-w-2xl space-y-10 animate-in slide-in-from-bottom-6 duration-700 flex flex-col items-center">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">CLIENTE</h1>
            <div className="relative glass-card p-2 rounded-full border-white/10 w-full shadow-2xl">
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-700" size={24} />
              <input type="text" value={clientSearch} onChange={(e) => setClientSearch(e.target.value)} placeholder="BUSCAR NOME..." className="w-full bg-transparent border-none py-6 pl-20 pr-10 text-white font-black text-xs uppercase outline-none placeholder-zinc-800 tracking-widest"/>
            </div>
            <div className="grid grid-cols-1 gap-6 w-full">
              {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())).slice(0, 5).map(c => (
                <button key={c.id} onClick={() => { setSelectedClient(c); setStep('VEICULO'); }} className="w-full p-8 glass-card border-white/5 rounded-ios flex items-center justify-between hover:border-[#FF2D55]/50 transition-all group shadow-xl">
                   <div className="text-left">
                    <p className="text-2xl font-black italic uppercase group-hover:text-[#FF2D55] tracking-tight">{c.name}</p>
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-2">{c.phone}</p>
                  </div>
                  <User size={32} className="text-zinc-800" />
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 'VEICULO' && selectedClient && (
          <div className="w-full max-w-2xl space-y-10 animate-in slide-in-from-right-6 duration-700 flex flex-col items-center">
            <h1 className="text-5xl font-black italic uppercase tracking-tighter">VEÍCULO</h1>
            <div className="grid grid-cols-1 gap-6 w-full">
              {vehicles.filter(v => v.clientId === selectedClient.id).map(v => (
                <button key={v.id} onClick={() => { setSelectedVehicle(v); setStep('ITENS'); }} className="p-10 glass-card border-white/5 rounded-ios flex items-center justify-between hover:border-[#FF2D55]/50 transition-all group shadow-2xl">
                  <div className="text-left">
                    <p className="text-3xl font-black italic uppercase text-white tracking-widest leading-none">{v.plate}</p>
                    <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-[0.4em] mt-3">{v.model}</p>
                  </div>
                  <Car size={40} className="text-zinc-800" />
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 'ITENS' && selectedVehicle && (
          <div className="w-full max-w-3xl space-y-12 animate-in slide-in-from-right-6 duration-700 flex flex-col items-center">
            <div className="glass-card p-10 rounded-ios border-white/10 space-y-12 w-full shadow-2xl">
               <div className="flex items-center justify-between border-b border-white/5 pb-8">
                 <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#FF2D55]/10 rounded-xl flex items-center justify-center text-[#FF2D55]"><Car size={24}/></div>
                    <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">{selectedVehicle.plate}</h3>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-1">{selectedVehicle.model}</p>
                    </div>
                 </div>
                 <button onClick={() => setItems([...items, { id: Math.random().toString(36).substr(2, 9), description: '', quantity: 1, unitPrice: 0, type: 'SERVICE' }])} className="px-8 py-4 bg-[#FF2D55] text-white rounded-full font-black uppercase text-[10px] tracking-widest active:scale-90 transition-all italic">NOVO ITEM</button>
               </div>
               <div className="space-y-6">
                 {items.map(item => (
                   <div key={item.id} className="bg-black/50 p-6 rounded-[2.5rem] border border-white/5 flex flex-col gap-6 shadow-inner">
                     <input type="text" placeholder="DESCRIÇÃO..." value={item.description} onChange={(e) => setItems(items.map(i => i.id === item.id ? {...i, description: e.target.value.toUpperCase()} : i))} className="w-full bg-transparent text-[14px] font-black outline-none uppercase italic text-white tracking-widest"/>
                     <div className="flex gap-6">
                        <input type="number" placeholder="QTD" value={item.quantity || ''} onChange={(e) => setItems(items.map(i => i.id === item.id ? {...i, quantity: parseFloat(e.target.value) || 0} : i))} className="w-20 bg-white/5 border border-white/5 p-5 rounded-2xl text-center text-[16px] font-black text-white outline-none"/>
                        <input type="number" placeholder="R$ UNIT" value={item.unitPrice || ''} onChange={(e) => setItems(items.map(i => i.id === item.id ? {...i, unitPrice: parseFloat(e.target.value) || 0} : i))} className="flex-1 bg-white/5 border border-white/5 p-5 rounded-2xl text-[16px] font-black text-white outline-none"/>
                        <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="p-5 text-zinc-800 hover:text-[#FF2D55] active:scale-90 transition-all"><Trash2 size={24}/></button>
                     </div>
                   </div>
                 ))}
               </div>
               <button onClick={handleFinalize} disabled={isSaving} className="w-full bg-[#FF2D55] py-8 rounded-ios font-black uppercase text-xs tracking-[0.5em] flex items-center justify-center gap-6 active:scale-95 italic transition-all shadow-[0_40px_80px_rgba(255,45,85,0.4)]">
                 {isSaving ? <Loader2 className="animate-spin" /> : 'CONCLUIR NOTA'}
               </button>
            </div>
          </div>
        )}
        {step === 'FINAL' && finalOs && (
          <div className="w-full flex flex-col items-center gap-16 animate-in fade-in duration-1000">
             <div className="invoice-preview-wrapper"><div className="invoice-container-scaled"><div ref={previewRef}><InvoiceTemplate os={finalOs} /></div></div></div>
             <div className="w-full max-w-[500px] flex flex-col gap-6 px-6 pb-24">
                <button onClick={downloadImage} disabled={isSaving} className="w-full bg-white text-black py-8 rounded-ios font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-6 shadow-2xl active:scale-95 italic transition-all disabled:opacity-50">
                   {isSaving ? <Loader2 className="animate-spin"/> : <ImageIcon size={32}/>} SALVAR COMO IMAGEM
                </button>
                <button onClick={() => navigate('/dashboard')} className="glass-card py-6 rounded-ios font-black uppercase text-[10px] tracking-[0.5em] flex items-center justify-center hover:bg-white/5 italic transition-all">VOLTAR AO PAINEL</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewServiceOrder;
