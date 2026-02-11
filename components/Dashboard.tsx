
import React, { useState } from 'react';
import { NexusModule, User } from '../types';
import { 
  Zap, 
  MessageSquare, 
  Palette, 
  Mic2, 
  ScanSearch, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Cpu,
  Crown,
  CreditCard,
  X,
  ShieldCheck,
  Check
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import NexusAd from './NexusAd';

const dummyData = [
  { time: '00:00', value: 400 },
  { time: '04:00', value: 300 },
  { time: '08:00', value: 600 },
  { time: '12:00', value: 800 },
  { time: '16:00', value: 500 },
  { time: '20:00', value: 900 },
  { time: '23:59', value: 1000 },
];

interface DashboardProps {
  onNavigate: (module: NexusModule) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user }) => {
  const [showPayment, setShowPayment] = useState(false);
  const PAYPAL_EMAIL = 'louis.toupin@icloud.com';
  const CREATOR_EMAILS = ['louistou07@gmail.com', 'louis.toupin@icloud.com'];

  const handlePaypalClick = () => {
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(PAYPAL_EMAIL)}&item_name=Nexus+IA+Elite+Subscription&amount=9.99&currency_code=EUR`;
    window.open(paypalUrl, '_blank');
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
              Nexus Console
            </h1>
            {CREATOR_EMAILS.includes(user.email.toLowerCase()) && (
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-500 text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Creator
              </span>
            )}
          </div>
          <p className="text-zinc-400 mt-2">Bienvenue, {user.username}. Statut du système : Optimal.</p>
        </div>
        <div className="flex gap-3">
          {user.tier === 'basic' && (
            <button 
              onClick={() => setShowPayment(true)}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full flex items-center gap-2 text-sm font-bold animate-pulse hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
            >
              <Crown className="w-4 h-4" /> Activer Elite
            </button>
          )}
          <div className="px-4 py-2 glass rounded-full flex items-center gap-2 text-sm text-zinc-300">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            {user.credits === 999999 ? '∞' : user.credits} Crédits
          </div>
        </div>
      </header>

      {user.tier === 'basic' && <NexusAd type="banner" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Utilisation', value: user.tier === 'elite' ? '0%' : `${50 - user.credits}/50`, icon: Activity, color: 'text-blue-400' },
          { label: 'Latence Nexus', value: '18ms', icon: Cpu, color: 'text-purple-400' },
          { label: 'Grade Actuel', value: user.tier.toUpperCase(), icon: TrendingUp, color: 'text-emerald-400' },
          { label: 'Accès Master', value: CREATOR_EMAILS.includes(user.email.toLowerCase()) ? 'OUI' : 'NON', icon: Zap, color: 'text-amber-400' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-zinc-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className="text-xs font-mono text-zinc-500">DATA_{i}</span>
            </div>
            <div>
              <p className="text-zinc-500 text-sm">{stat.label}</p>
              <h3 className="text-2xl font-bold font-heading">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-lg">Activité du Réseau</h3>
          </div>
          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dummyData}>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={false}
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-zinc-800 flex flex-col justify-between bg-indigo-600/5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              <h3 className="font-heading font-bold text-lg italic text-amber-500 uppercase tracking-widest">Nexus Elite</h3>
            </div>
            <ul className="space-y-3">
              {[
                "Expérience sans publicité",
                "Crédits illimités (Protocol ∞)",
                "Priorité Gemini Ultra",
                "Outils de création avancés"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                  <Check className="w-4 h-4 text-amber-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          {user.tier === 'basic' ? (
            <button 
              onClick={() => setShowPayment(true)}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl mt-6 transition-all flex items-center justify-center gap-2"
            >
              Débloquer Elite — 9.99€
            </button>
          ) : (
            <div className="w-full py-4 bg-zinc-800/50 text-amber-500 font-bold rounded-xl mt-6 text-center border border-amber-500/20">
              ABONNEMENT ACTIF
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { id: NexusModule.CHAT, label: 'Nexus Chat', desc: 'Raisonnement IA', icon: MessageSquare, color: 'bg-indigo-500' },
          { id: NexusModule.CANVAS, label: 'Nexus Canvas', desc: 'Art Génératif', icon: Palette, color: 'bg-pink-500' },
          { id: NexusModule.VOICE, label: 'Nexus Voice', desc: 'Synthèse Vocale HD', icon: Mic2, color: 'bg-cyan-500' },
          { id: NexusModule.LENS, label: 'Nexus Lens', desc: 'Vision par Ordinateur', icon: ScanSearch, color: 'bg-amber-500' },
        ].map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="group relative glass p-6 rounded-3xl border border-zinc-800 text-left hover:border-zinc-700 transition-all overflow-hidden"
          >
             <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
               <card.icon className="w-24 h-24" />
             </div>
            <div className={`w-12 h-12 ${card.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-heading font-bold text-lg mb-1">{card.label}</h4>
            <p className="text-zinc-500 text-sm">{card.desc}</p>
          </button>
        ))}
      </div>

      {/* Modal de Paiement PayPal */}
      {showPayment && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass w-full max-w-md p-8 rounded-3xl border border-zinc-800 relative space-y-6">
            <button 
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-heading font-bold">Passer à Nexus Elite</h2>
              <p className="text-zinc-500 text-sm">Libérez tout le potentiel de l'IA.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-400">Total à payer</span>
                <span className="text-xl font-bold text-white">9,99€ <span className="text-xs text-zinc-500">/ mois</span></span>
              </div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest">Paiement sécurisé via PayPal</div>
            </div>

            <button 
              onClick={handlePaypalClick}
              className="w-full py-4 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-6 rounded" />
              Payer avec PayPal
            </button>

            <p className="text-[10px] text-zinc-600 text-center">
              Les fonds seront transférés au compte : {PAYPAL_EMAIL}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
