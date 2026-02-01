
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, X, Wrench, ShieldCheck, Clock, 
  Car, Star, Calendar, MessageCircle, MapPin, 
  ArrowRight, Smartphone, CheckCircle2, ChevronRight,
  Settings, UserCheck, Activity, BarChart3, Info,
  Search, Shield, Zap, Send, Bot, Cpu
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '', phone: '', vehicle: '', date: '', time: '', service: 'Revisão Preventiva'
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Olá! Sou ${bookingForm.name}. Vi o site da KAEN e gostaria de agendar um(a) ${bookingForm.service} para o dia ${bookingForm.date} às ${bookingForm.time} no meu ${bookingForm.vehicle}.`;
    const phone = '5511999999999'; 
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    setShowBooking(false);
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="relative flex flex-col items-center animate-pulse">
           <div className="w-24 h-24 bg-[#FF2D55] rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_100px_rgba(255,45,85,0.5)]">
              <Wrench size={48} className="text-white" />
           </div>
           <h1 className="text-6xl font-black italic tracking-tighter text-white mb-4">KAEN</h1>
           <div className="h-px w-40 bg-zinc-800 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-[#FF2D55] w-1/2 animate-[slide_1.5s_infinite_linear]"></div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.8em] text-zinc-600 mt-6 italic">ALÉM DOS LIMITES</p>
        </div>
        <style>{`@keyframes slide { from { transform: translateX(-100%); } to { transform: translateX(200%); } }`}</style>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen selection:bg-[#FF2D55] selection:text-white font-['Inter'] relative">
      
      {/* BOT WHATSAPP FLUTUANTE */}
      <div className="fixed bottom-10 right-10 z-[500] flex flex-col items-end gap-4">
         {isBotOpen && (
            <div className="w-[320px] bg-[#0a0a0b] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500 mb-4">
               <div className="bg-[#FF2D55] p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center border border-white/20">
                        <Bot size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-black uppercase italic">BOT IA KAEN</p>
                        <p className="text-[9px] font-bold text-white/60 uppercase">Assistente Online</p>
                     </div>
                  </div>
                  <button onClick={() => setIsBotOpen(false)}><X size={20}/></button>
               </div>
               <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto no-scrollbar bg-black/40">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 text-left">
                     <p className="text-[11px] text-zinc-300 font-bold leading-relaxed uppercase">
                        Olá! Sou o assistente virtual da KAEN. Posso te ajudar com orçamentos, agendamentos ou dúvidas técnicas. Como posso acelerar seu atendimento hoje?
                     </p>
                  </div>
                  <button onClick={() => { setIsBotOpen(false); setShowBooking(true); }} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl text-[10px] font-black uppercase text-left hover:border-[#FF2D55] transition-all flex justify-between items-center group">
                     <span>Agendar Revisão</span>
                     <ChevronRight size={14} className="text-[#FF2D55] group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button onClick={() => window.open('https://wa.me/5511999999999', '_blank')} className="w-full bg-zinc-900 border border-white/5 p-4 rounded-xl text-[10px] font-black uppercase text-left hover:border-[#FF2D55] transition-all flex justify-between items-center group">
                     <span>Falar com Consultor</span>
                     <MessageCircle size={14} className="text-[#FF2D55]" />
                  </button>
               </div>
               <div className="p-4 border-t border-white/5 flex gap-2">
                  <input placeholder="Digite sua dúvida..." className="flex-1 bg-white/5 border-none rounded-xl px-4 py-2 text-[11px] outline-none text-white placeholder-zinc-700"/>
                  <button className="p-2 bg-[#FF2D55] rounded-xl"><Send size={16}/></button>
               </div>
            </div>
         )}
         <button 
            onClick={() => setIsBotOpen(!isBotOpen)}
            className="w-16 h-16 bg-[#FF2D55] rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(255,45,85,0.4)] bot-bubble hover:scale-110 active:scale-95 transition-all border border-white/20"
         >
            {isBotOpen ? <X size={28}/> : <Bot size={28}/>}
         </button>
      </div>

      {/* MENU LATERAL */}
      <div className={`fixed inset-y-0 right-0 z-[600] w-[320px] glass-card border-l border-white/10 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] p-10 flex flex-col ${isMenuOpen ? 'translate-x-0 shadow-[-50px_0_100px_rgba(0,0,0,0.9)]' : 'translate-x-full'}`}>
         <button onClick={() => setIsMenuOpen(false)} className="self-end p-3 hover:text-[#FF2D55] transition-colors mb-12">
            <X size={32} />
         </button>
         <div className="space-y-12 text-left">
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 italic mb-6">SISTEMA INTERNO</p>
               <nav className="flex flex-col gap-6">
                  <button onClick={() => navigate('/login')} className="flex items-center gap-5 group text-left">
                     <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#FF2D55] transition-all">
                        <UserCheck size={24}/>
                     </div>
                     <div>
                        <p className="font-black uppercase italic tracking-tighter text-sm">Painel de Gestão</p>
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">Acesso Administrativo</p>
                     </div>
                  </button>
                  <button onClick={() => navigate('/terminal')} className="flex items-center gap-5 group text-left">
                     <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-all">
                        <Smartphone size={24}/>
                     </div>
                     <div>
                        <p className="font-black uppercase italic tracking-tighter text-sm">Terminal Mecânico</p>
                        <p className="text-[9px] text-zinc-500 uppercase font-bold">Operação de Pista</p>
                     </div>
                  </button>
               </nav>
            </div>
         </div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-8 py-6 flex justify-between items-center bg-black/60 backdrop-blur-3xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF2D55] rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <Wrench size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black italic uppercase tracking-tighter">KAEN</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-14">
          <a href="#servicos" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors italic">Serviços</a>
          <a href="#tecnologia" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors italic">Tecnologia</a>
          <a href="#sobre" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors italic">Sobre Nós</a>
        </div>

        <div className="flex items-center gap-5">
          <button onClick={() => setShowBooking(true)} className="hidden sm:block bg-white text-black px-10 py-3 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#FF2D55] hover:text-white transition-all shadow-xl">Agendar Agora</button>
          <button onClick={() => setIsMenuOpen(true)} className="w-14 h-14 glass-card rounded-2xl flex items-center justify-center text-white hover:border-[#FF2D55] transition-all"><Menu size={28} /></button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-64 pb-32 px-8 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,45,85,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="bg-white/5 border border-white/10 px-8 py-3 rounded-full mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <span className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-400 italic">ALTA PERFORMANCE & DIAGNÓSTICO BIONÉTICO</span>
        </div>
        <h1 className="text-[14vw] md:text-[11rem] font-black italic uppercase tracking-tighter leading-[0.75] mb-14">
          ALÉM DOS<br/><span className="text-[#FF2D55]">LIMITES</span>
        </h1>
        <p className="max-w-2xl text-zinc-500 font-bold uppercase tracking-widest text-sm md:text-lg italic mb-20 leading-relaxed">
          Especialistas em engenharia de precisão. Onde a tecnologia avançada encontra a paixão por máquinas de alto desempenho.
        </p>
        <div className="flex flex-col md:flex-row gap-8">
           <button onClick={() => setShowBooking(true)} className="px-24 py-9 bg-[#FF2D55] text-white rounded-[3.5rem] font-black uppercase text-xs tracking-[0.4em] italic shadow-[0_40px_100px_rgba(255,45,85,0.4)] active:scale-95 transition-all">Fazer Agendamento</button>
           <button className="px-24 py-9 bg-zinc-900 text-white rounded-[3.5rem] font-black uppercase text-xs tracking-[0.4em] italic hover:bg-white/10 border border-white/5 transition-all">Conhecer Protocolos</button>
        </div>
        
        <div className="mt-32 flex flex-wrap justify-center gap-16 md:gap-24 text-zinc-700 font-black text-[11px] uppercase tracking-[0.5em] italic opacity-50">
           <div className="flex flex-col items-center gap-5 hover:text-white transition-colors cursor-default"><Settings size={32}/> Diagnóstico Avançado</div>
           <div className="flex flex-col items-center gap-5 hover:text-white transition-colors cursor-default"><Shield size={32}/> Garantia Estendida</div>
           <div className="flex flex-col items-center gap-5 hover:text-white transition-colors cursor-default"><Clock size={32}/> Entrega Expressa</div>
           <div className="flex flex-col items-center gap-5 hover:text-white transition-colors cursor-default"><Activity size={32}/> Performance</div>
        </div>
      </section>

      {/* SEÇÃO SERVIÇOS */}
      <section id="servicos" className="py-40 px-8 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter mb-6">ENGENHARIA</h2>
            <p className="text-[11px] font-black text-zinc-600 uppercase tracking-[0.9em] italic">SOLUÇÕES DE ALTA PRECISÃO</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                title: 'Injeção Direta', 
                desc: 'Limpeza e calibração bionética de bicos injetores para máxima eficiência de torque.',
                icon: <Zap size={40}/> 
              },
              { 
                title: 'Transmissão', 
                desc: 'Troca de fluído por diálise completa, garantindo 100% de renovação do sistema.',
                icon: <Cpu size={40}/> 
              },
              { 
                title: 'Suspensão Elite', 
                desc: 'Aperto controlado e substituição de componentes com foco em dinâmica de direção.',
                icon: <Settings size={40}/> 
              },
              { 
                title: 'Frenagem Performance', 
                desc: 'Pastilhas cerâmicas e fluídos de alta temperatura para poder de parada absoluto.',
                icon: <ShieldCheck size={40}/> 
              },
              { 
                title: 'Diagnóstico Scanner', 
                desc: 'Leitura profunda de módulos e sensores com equipamentos de padrão montadora.',
                icon: <Smartphone size={40}/> 
              },
              { 
                title: 'Upgrade Motor', 
                desc: 'Otimização de hardware e software para entusiastas que buscam o além dos limites.',
                icon: <Activity size={40}/> 
              }
            ].map((s, idx) => (
              <div key={idx} className="glass-card p-14 rounded-[4rem] border border-white/5 hover:border-[#FF2D55]/40 transition-all group flex flex-col items-start text-left">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 text-[#FF2D55] group-hover:scale-110 group-hover:bg-[#FF2D55] group-hover:text-white transition-all border border-white/5 shadow-xl">
                   {s.icon}
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-5">{s.title}</h3>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed italic">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO TECNOLOGIA */}
      <section id="tecnologia" className="py-40 px-8 relative overflow-hidden border-y border-white/5">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_right,rgba(255,45,85,0.03)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
            <div className="space-y-12 text-left">
               <p className="text-[#FF2D55] font-black uppercase tracking-[0.5em] text-[11px] italic">NOSSA METODOLOGIA</p>
               <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">TECNOLOGIA<br/>BIONÉTICA</h2>
               <p className="text-zinc-500 font-bold text-sm uppercase tracking-widest leading-relaxed italic">
                  Utilizamos protocolos de manutenção baseados em dados reais, garantindo que cada componente seja monitorado e ajustado conforme as especificações originais de fábrica.
               </p>
               <div className="grid grid-cols-1 gap-10">
                  <div className="flex items-start gap-6 group">
                     <div className="p-4 bg-white/5 rounded-2xl text-[#FF2D55] border border-white/5 group-hover:bg-[#FF2D55] group-hover:text-white transition-all"><Cpu size={24}/></div>
                     <div>
                        <p className="text-sm font-black uppercase tracking-widest italic text-white mb-2">Relatório Fotográfico Digital</p>
                        <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-tight leading-relaxed">Você recebe em seu WhatsApp todas as fotos do processo, com total transparência.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                     <div className="p-4 bg-white/5 rounded-2xl text-[#FF2D55] border border-white/5 group-hover:bg-[#FF2D55] group-hover:text-white transition-all"><Shield size={24}/></div>
                     <div>
                        <p className="text-sm font-black uppercase tracking-widest italic text-white mb-2">Torque Controlado</p>
                        <p className="text-[11px] text-zinc-600 font-bold uppercase tracking-tight leading-relaxed">Cada parafuso é apertado com torquímetros digitais certificados, evitando fadiga de material.</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="relative group">
               <div className="absolute inset-0 bg-[#FF2D55]/20 rounded-[4rem] blur-[120px] pointer-events-none opacity-50 group-hover:opacity-10 transition-opacity"></div>
               <div className="relative bg-zinc-900/40 border border-white/10 p-16 rounded-[4.5rem] flex flex-col gap-12 backdrop-blur-3xl">
                  <div className="p-12 bg-black/40 rounded-[3rem] border border-white/5">
                     <p className="text-7xl font-black italic tracking-tighter text-[#FF2D55] mb-2 leading-none">100%</p>
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic text-center">Rastreabilidade Técnica</p>
                  </div>
                  <div className="p-12 bg-black/40 rounded-[3rem] border border-white/5">
                     <p className="text-7xl font-black italic tracking-tighter text-white mb-2 leading-none">24/7</p>
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic text-center">Monitoramento em Nuvem</p>
                  </div>
               </div>
            </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-32 px-8 border-t border-white/5 bg-black">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 text-left">
            <div className="col-span-1 md:col-span-2 space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#FF2D55] rounded-2xl flex items-center justify-center shadow-lg">
                     <Wrench size={28} className="text-white" />
                  </div>
                  <span className="text-3xl font-black italic uppercase tracking-tighter">KAEN</span>
               </div>
               <p className="text-zinc-600 text-xs font-black uppercase tracking-widest leading-loose italic max-w-md">
                  Líder em tecnologia automotiva de elite. Nosso compromisso é com a integridade técnica e a performance absoluta de cada máquina que entra em nosso núcleo.
               </p>
               <div className="flex gap-8">
                  <MessageCircle size={32} className="text-zinc-700 hover:text-[#25D366] cursor-pointer transition-colors" />
                  <Smartphone size={32} className="text-zinc-700 hover:text-white cursor-pointer transition-colors" />
               </div>
            </div>
            
            <div className="space-y-8">
               <p className="text-[11px] font-black uppercase tracking-widest text-[#FF2D55] italic">Navegação</p>
               <nav className="flex flex-col gap-5 text-xs font-black uppercase tracking-widest text-zinc-500">
                  <a href="#servicos" className="hover:text-white transition-colors">Serviços</a>
                  <a href="#tecnologia" className="hover:text-white transition-colors">Tecnologia</a>
                  <button onClick={() => navigate('/login')} className="text-left hover:text-[#FF2D55] transition-colors uppercase italic">Login Sistema</button>
                  <button onClick={() => navigate('/terminal')} className="text-left hover:text-blue-500 transition-colors uppercase italic">Terminal Mecânico</button>
               </nav>
            </div>

            <div className="space-y-8">
               <p className="text-[11px] font-black uppercase tracking-widest text-[#FF2D55] italic">Contato</p>
               <div className="text-xs font-black uppercase tracking-widest text-zinc-500 space-y-3 italic">
                  <p>RUA JOAQUIM MARQUES ALVES, 765</p>
                  <p>SÃO PAULO - SP • CEP 05574-000</p>
                  <p className="text-white mt-8">(11) 99999-9999</p>
               </div>
            </div>
         </div>
         <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest italic">© 2024 REDE KAEN • ALÉM DOS LIMITES V26.8</p>
            <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest italic">PRECISÃO EM CADA DETALHE</p>
         </div>
      </footer>

      {/* MODAL BOOKING */}
      {showBooking && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500">
           <div className="w-full max-w-2xl bg-[#0a0a0b] border border-white/10 p-14 rounded-[4.5rem] shadow-2xl relative">
              <button onClick={() => setShowBooking(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white transition-all"><X size={44}/></button>
              <div className="text-center mb-14">
                 <h2 className="text-5xl font-black italic uppercase tracking-tighter text-[#FF2D55] mb-3 leading-none">AGENDAMENTO</h2>
                 <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest italic">Protocolo de manutenção de elite KAEN</p>
              </div>
              <form onSubmit={handleBooking} className="space-y-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-6 italic text-left block">Nome Completo</label>
                    <input required type="text" placeholder="EX: RAFAEL ENZO" value={bookingForm.name} onChange={(e) => setBookingForm({...bookingForm, name: e.target.value.toUpperCase()})} className="w-full bg-zinc-950 border border-white/5 rounded-3xl px-10 py-6 text-white text-sm font-black uppercase outline-none focus:border-[#FF2D55] transition-all"/>
                 </div>
                 <div className="grid grid-cols-2 gap-6 text-left">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-6 italic">WhatsApp</label>
                       <input required type="tel" placeholder="(11) 99999-9999" value={bookingForm.phone} onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})} className="w-full bg-zinc-950 border border-white/5 rounded-3xl px-10 py-6 text-white text-sm font-black outline-none focus:border-[#FF2D55] transition-all"/>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-6 italic">Seu Veículo</label>
                       <input required type="text" placeholder="EX: BMW M3" value={bookingForm.vehicle} onChange={(e) => setBookingForm({...bookingForm, vehicle: e.target.value.toUpperCase()})} className="w-full bg-zinc-950 border border-white/5 rounded-3xl px-10 py-6 text-white text-sm font-black uppercase outline-none focus:border-[#FF2D55] transition-all"/>
                    </div>
                 </div>
                 <button type="submit" className="w-full bg-[#FF2D55] py-9 rounded-[3rem] font-black uppercase text-sm tracking-[0.5em] italic shadow-2xl active:scale-95 transition-all mt-6 flex items-center justify-center gap-4">
                    <MessageCircle size={24}/> Confirmar no WhatsApp
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
