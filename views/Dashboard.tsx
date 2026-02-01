
import React, { useState, useEffect, useMemo } from 'react';
import { 
  PlusCircle, Sparkles, Loader2, Calendar, 
  TrendingUp, Activity, AlertTriangle, CheckCircle2,
  DollarSign, Wrench, Package, ArrowRight, Smartphone, MessageCircle,
  Clock, Bot, Send, Users, ShieldCheck, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceOrder, OSStatus, UserSession, Appointment } from '../types';

const Dashboard: React.FC<{ session?: UserSession }> = ({ session }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [groupConnected, setGroupConnected] = useState(true);

  useEffect(() => {
    if (session) {
      const savedOrders = JSON.parse(localStorage.getItem(`kaen_${session.username}_orders`) || '[]');
      const savedApps = JSON.parse(localStorage.getItem(`kaen_${session.username}_appointments`) || '[]');
      setOrders(savedOrders);
      setAppointments(savedApps);
    }
  }, [session]);

  const financialStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const calculateTotals = (data: ServiceOrder[]) => {
      const labor = data.reduce((acc, curr) => acc + curr.laborValue, 0);
      const total = data.reduce((acc, curr) => acc + curr.totalValue, 0);
      return { labor, parts: total - labor, total };
    };
    const daily = calculateTotals(orders.filter(o => o.createdAt.startsWith(today)));
    const all = calculateTotals(orders);
    const estimatedGain = appointments.filter(a => a.status === 'Agendado' || a.status === 'Pendente').length * 550;
    return { daily, all, estimatedGain };
  }, [orders, appointments]);

  const robotInsights = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const insights = [];
    const pendingApps = appointments.filter(a => a.date === today && a.status === 'Pendente');
    if (pendingApps.length > 0) {
      insights.push({ type: 'warning', text: `IA sugere confirmar ${pendingApps.length} agendamentos de hoje no grupo da oficina.`, icon: <Users size={18}/> });
    }
    if (financialStats.daily.total === 0 && appointments.length < 3) {
      insights.push({ type: 'danger', text: "Fluxo diário reduzido. IA recomenda disparar gatilhos de revisão.", icon: <Bot size={18}/> });
    }
    const lateOrders = orders.filter(o => o.status === OSStatus.EM_ANDAMENTO && new Date(o.createdAt) < new Date(Date.now() - 86400000));
    if (lateOrders.length > 0) {
      insights.push({ type: 'info', text: `${lateOrders.length} ordens de serviço estão em atraso técnico (24h+).`, icon: <Activity size={18}/> });
    }
    return insights;
  }, [appointments, financialStats, orders]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 p-6 md:p-14 pb-48 w-full max-w-[1400px]">
      
      {/* CENTRAL BIONÉTICA E COMANDO DE GRUPO */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* BOT PRINCIPAL */}
         <div className="xl:col-span-2 glass-card p-12 rounded-[4rem] border border-[#FF2D55]/20 relative overflow-hidden group shadow-[0_50px_120px_rgba(255,45,85,0.12)]">
            <div className="absolute top-0 right-0 p-16 text-[#FF2D55] opacity-5 group-hover:opacity-10 transition-opacity">
               <Bot size={220} />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 relative z-10">
               <div className="text-left">
                  <div className="flex items-center gap-5 mb-5">
                     <div className="w-14 h-14 bg-zinc-900 border border-[#FF2D55]/30 rounded-2xl flex items-center justify-center text-[#FF2D55] shadow-xl animate-pulse">
                        <Bot size={28} />
                     </div>
                     <h2 className="text-4xl font-black italic uppercase tracking-tighter">CENTRAL <span className="text-[#FF2D55]">BIONÉTICA</span></h2>
                  </div>
                  <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] italic">Monitoramento Neuronal Ativo • Núcleo V26.8</p>
               </div>
               <div className="flex gap-4">
                  <button onClick={() => navigate('/orders/new')} className="bg-[#FF2D55] px-10 py-5 rounded-full font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all">Emitir Nova Nota</button>
               </div>
            </div>

            {/* Insights */}
            <div className="mt-14 border-t border-white/5 pt-12 space-y-4">
               <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-6 italic">Relatório de Insights da IA:</p>
               {robotInsights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-5 bg-black/50 p-6 rounded-[2.5rem] border border-white/5 hover:border-[#FF2D55]/40 transition-all max-w-2xl group cursor-pointer">
                     <div className={`p-4 rounded-2xl shrink-0 transition-all group-hover:scale-110 ${insight.type === 'danger' ? 'bg-red-500/10 text-red-500' : insight.type === 'warning' ? 'bg-[#25D366]/10 text-[#25D366]' : 'bg-blue-500/10 text-blue-500'}`}>
                        {insight.icon}
                     </div>
                     <div className="text-left">
                        <p className="text-[12px] font-black text-zinc-300 uppercase italic leading-relaxed mb-3">{insight.text}</p>
                        <button className="text-[9px] font-black text-[#FF2D55] uppercase tracking-widest border border-[#FF2D55]/30 px-6 py-2 rounded-full hover:bg-[#FF2D55] hover:text-white transition-all italic">Executar Protocolo</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* CARD DE COMANDO DE GRUPO */}
         <div className="glass-card p-10 rounded-[4rem] border border-[#25D366]/20 bg-[#25D366]/5 relative flex flex-col justify-between">
            <div>
               <div className="flex justify-between items-start mb-10">
                  <div className="p-4 bg-[#25D366] text-white rounded-2xl shadow-lg">
                     <Users size={24} />
                  </div>
                  <div className="flex items-center gap-2">
                     <div className={`w-2 h-2 rounded-full ${groupConnected ? 'bg-[#25D366] animate-pulse' : 'bg-zinc-700'}`}></div>
                     <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{groupConnected ? 'CONECTADO AO GRUPO' : 'OFFLINE'}</span>
                  </div>
               </div>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-white">CONTROLE DE <span className="text-[#25D366]">EQUIPE</span></h3>
               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed mb-8">
                  O bot está integrado ao grupo: <br/>
                  <span className="text-white italic">"EQUIPE TÉCNICA KAEN - MATRIZ"</span>
               </p>

               <div className="space-y-4">
                  <div className="p-5 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between">
                     <span className="text-[10px] font-black text-zinc-400 uppercase italic">Avisos de Nova OS</span>
                     <div className="w-10 h-6 bg-[#25D366] rounded-full p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full translate-x-4"></div>
                     </div>
                  </div>
                  <div className="p-5 bg-black/40 rounded-3xl border border-white/5 flex items-center justify-between">
                     <span className="text-[10px] font-black text-zinc-400 uppercase italic">Alerta de Estoque Baixo</span>
                     <div className="w-10 h-6 bg-[#25D366] rounded-full p-1 cursor-pointer">
                        <div className="w-4 h-4 bg-white rounded-full translate-x-4"></div>
                     </div>
                  </div>
               </div>
            </div>

            <button 
               className="w-full bg-[#25D366] text-black py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-widest mt-10 hover:bg-[#1da851] transition-all flex items-center justify-center gap-3 active:scale-95"
               onClick={() => alert("Sincronizando logs com o grupo da equipe...")}
            >
               <Zap size={18} /> Disparar Resumo Diário
            </button>
         </div>
      </div>

      {/* FINANCE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
         <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
            <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic">MOVIMENTAÇÃO HOJE</p>
            <div className="space-y-8">
               <div className="flex justify-between items-center p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem] shadow-inner">
                  <div>
                     <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-2 italic">MÃO DE OBRA</p>
                     <p className="text-3xl font-black italic text-white leading-none tracking-tighter">R$ {financialStats.daily.labor.toLocaleString('pt-BR')}</p>
                  </div>
                  <Wrench className="text-blue-500/30" size={40} />
               </div>
               <div className="flex justify-between items-center p-8 bg-[#FF2D55]/5 border border-[#FF2D55]/10 rounded-[2.5rem] shadow-inner">
                  <div>
                     <p className="text-[9px] font-black text-[#FF2D55] uppercase tracking-widest mb-2 italic">PEÇAS & PRODUTOS</p>
                     <p className="text-3xl font-black italic text-white leading-none tracking-tighter">R$ {financialStats.daily.parts.toLocaleString('pt-BR')}</p>
                  </div>
                  <Package className="text-[#FF2D55]/30" size={40} />
               </div>
            </div>
         </div>

         <div className="glass-card p-12 rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-zinc-900/50 to-transparent shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-white"><Activity size={100}/></div>
            <p className="text-zinc-600 font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic">PERFORMANCE ACUMULADA</p>
            <div className="space-y-4 mb-14">
               <p className="text-6xl font-black italic text-white tracking-tighter leading-none">R$ {financialStats.all.total.toLocaleString('pt-BR')}</p>
               <p className="text-[11px] font-black text-emerald-500 uppercase tracking-widest italic flex items-center gap-3 bg-emerald-500/5 py-2 px-4 rounded-full w-fit border border-emerald-500/10">
                  <TrendingUp size={16}/> CRESCIMENTO DE 14.5% 
               </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
               <div className="p-7 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                  <p className="text-[9px] font-black text-zinc-500 uppercase mb-2 italic">Peças</p>
                  <p className="text-lg font-black italic text-white">R$ {financialStats.all.parts.toLocaleString('pt-BR')}</p>
               </div>
               <div className="p-7 bg-white/5 rounded-3xl border border-white/5 shadow-inner">
                  <p className="text-[9px] font-black text-zinc-500 uppercase mb-2 italic">Serviços</p>
                  <p className="text-lg font-black italic text-white">R$ {financialStats.all.labor.toLocaleString('pt-BR')}</p>
               </div>
            </div>
         </div>

         <div className="glass-card p-12 rounded-[3.5rem] border border-emerald-500/20 bg-emerald-500/5 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
               <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-[10px] italic">PREVISÃO (INTELIGÊNCIA IA)</p>
               <Sparkles className="text-emerald-500/40" size={24} />
            </div>
            <div className="space-y-4">
               <p className="text-5xl font-black italic text-white tracking-tighter leading-none">~R$ {financialStats.estimatedGain.toLocaleString('pt-BR')}</p>
               <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest italic leading-relaxed">
                  Projeção automática baseada em agendamentos futuros e fluxo histórico de clientes.
               </p>
            </div>
            <div className="mt-14 pt-14 border-t border-emerald-500/10">
               <button onClick={() => navigate('/calendar')} className="w-full bg-emerald-500 text-black py-6 rounded-3xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-4 active:scale-95 transition-all italic shadow-xl hover:bg-emerald-400">
                  Otimizar Agenda de Pista <ArrowRight size={20}/>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
