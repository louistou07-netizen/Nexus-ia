
import React, { useState } from 'react';
import { NexusModule, User } from '../types';
import { 
  Zap, 
  MessageSquare, 
  Palette, 
  Mic2, 
  ScanSearch, 
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
  language: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, user, language }) => {
  const [showPayment, setShowPayment] = useState(false);
  const PAYPAL_EMAIL = 'louis.toupin@icloud.com';
  const CREATOR_EMAILS = ['louistou07@gmail.com', 'louis.toupin@icloud.com'];

  const translations: any = {
    fr: {
      title: "Console Nexus",
      welcome: "Bienvenue",
      status: "Statut du système : Optimal",
      elite: "Activer Elite",
      credits: "Crédits",
      usage: "Utilisation",
      latency: "Latence Nexus",
      grade: "Grade Actuel",
      master: "Accès Master",
      activity: "Activité du Réseau",
      activeSub: "ABONNEMENT ACTIF",
      unlock: "Débloquer Elite",
      benefits: [
        "Expérience sans publicité",
        "Crédits illimités (Protocol ∞)",
        "Priorité Gemini Ultra",
        "Outils de création avancés"
      ],
      creator: "Créateur",
      yes: "OUI",
      no: "NON",
      totalToPay: "Total à payer",
      month: "/ mois",
      secure: "Paiement sécurisé via PayPal",
      foundsSent: "Les fonds seront transférés au compte :",
      payBtn: "Payer avec PayPal",
      placeholderText: {
        chat: "Nexus Chat",
        chatDesc: "Raisonnement IA",
        canvas: "Nexus Canvas",
        canvasDesc: "Art Génératif",
        voice: "Nexus Voice",
        voiceDesc: "Synthèse Vocale HD",
        lens: "Nexus Lens",
        lensDesc: "Vision par Ordinateur"
      }
    },
    en: {
      title: "Nexus Console",
      welcome: "Welcome",
      status: "System Status: Optimal",
      elite: "Activate Elite",
      credits: "Credits",
      usage: "Usage",
      latency: "Nexus Latency",
      grade: "Current Grade",
      master: "Master Access",
      activity: "Network Activity",
      activeSub: "ACTIVE SUBSCRIPTION",
      unlock: "Unlock Elite",
      benefits: [
        "Ad-free experience",
        "Unlimited credits (Protocol ∞)",
        "Gemini Ultra priority",
        "Advanced creation tools"
      ],
      creator: "Creator",
      yes: "YES",
      no: "NO",
      totalToPay: "Total to pay",
      month: "/ month",
      secure: "Secure payment via PayPal",
      foundsSent: "Funds will be transferred to:",
      payBtn: "Pay with PayPal",
      placeholderText: {
        chat: "Nexus Chat",
        chatDesc: "AI Reasoning",
        canvas: "Nexus Canvas",
        canvasDesc: "Generative Art",
        voice: "Nexus Voice",
        voiceDesc: "HD Speech Synthesis",
        lens: "Nexus Lens",
        lensDesc: "Computer Vision"
      }
    }
  };

  const t = translations[language] || translations.fr;

  const handlePaypalClick = () => {
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(PAYPAL_EMAIL)}&item_name=Nexus+IA+Elite+Subscription&amount=9.99&currency_code=EUR`;
    window.open(paypalUrl, '_blank');
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
              {t.title}
            </h1>
            {CREATOR_EMAILS.includes(user.email.toLowerCase()) && (
              <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-500 text-[10px] font-bold rounded-full flex items-center gap-1 uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> {t.creator}
              </span>
            )}
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">{t.welcome}, {user.username}. {t.status}.</p>
        </div>
        <div className="flex gap-3">
          {user.tier === 'basic' && (
            <button 
              onClick={() => setShowPayment(true)}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full flex items-center gap-2 text-sm font-bold animate-pulse hover:scale-105 transition-all shadow-lg shadow-orange-500/20"
            >
              <Crown className="w-4 h-4" /> {t.elite}
            </button>
          )}
          <div className="px-4 py-2 glass rounded-full flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <CreditCard className="w-4 h-4 text-indigo-500" />
            {user.credits === 999999 ? '∞' : user.credits} {t.credits}
          </div>
        </div>
      </header>

      {user.tier === 'basic' && <NexusAd type="banner" />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t.usage, value: user.tier === 'elite' ? '0%' : `${50 - user.credits}/50`, icon: Activity, color: 'text-blue-500' },
          { label: t.latency, value: '18ms', icon: Cpu, color: 'text-purple-500' },
          { label: t.grade, value: user.tier.toUpperCase(), icon: TrendingUp, color: 'text-emerald-500' },
          { label: t.master, value: CREATOR_EMAILS.includes(user.email.toLowerCase()) ? t.yes : t.no, icon: Zap, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              < stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className="text-xs font-mono text-zinc-400">DATA_{i}</span>
            </div>
            <div>
              <p className="text-zinc-500 text-sm">{stat.label}</p>
              <h3 className="text-2xl font-bold font-heading">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-lg">{t.activity}</h3>
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
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between bg-indigo-500/5">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-amber-500" />
              <h3 className="font-heading font-bold text-lg italic text-amber-500 uppercase tracking-widest">Nexus Elite</h3>
            </div>
            <ul className="space-y-3">
              {t.benefits.map((benefit: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
                  <Check className="w-4 h-4 text-amber-500" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          {user.tier === 'basic' ? (
            <button 
              onClick={() => setShowPayment(true)}
              className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-white dark:text-zinc-950 font-bold rounded-xl mt-6 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {t.unlock} — 9.99€
            </button>
          ) : (
            <div className="w-full py-4 bg-zinc-100 dark:bg-zinc-800/50 text-amber-500 font-bold rounded-xl mt-6 text-center border border-amber-500/20">
              {t.activeSub}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { id: NexusModule.CHAT, label: t.placeholderText.chat, desc: t.placeholderText.chatDesc, icon: MessageSquare, color: 'bg-indigo-500' },
          { id: NexusModule.CANVAS, label: t.placeholderText.canvas, desc: t.placeholderText.canvasDesc, icon: Palette, color: 'bg-pink-500' },
          { id: NexusModule.VOICE, label: t.placeholderText.voice, desc: t.placeholderText.voiceDesc, icon: Mic2, color: 'bg-cyan-500' },
          { id: NexusModule.LENS, label: t.placeholderText.lens, desc: t.placeholderText.lensDesc, icon: ScanSearch, color: 'bg-amber-500' },
        ].map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="group relative glass p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-left hover:border-indigo-500/50 transition-all overflow-hidden"
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

      {showPayment && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-md p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 relative space-y-6 shadow-2xl">
            <button 
              onClick={() => setShowPayment(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl font-heading font-bold">Nexus Elite</h2>
              <p className="text-zinc-500 text-sm">Libérez tout le potentiel de l'IA.</p>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-zinc-500">{t.totalToPay}</span>
                <span className="text-xl font-bold">9,99€ <span className="text-xs text-zinc-500">{t.month}</span></span>
              </div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-widest">{t.secure}</div>
            </div>

            <button 
              onClick={handlePaypalClick}
              className="w-full py-4 bg-[#0070ba] hover:bg-[#005ea6] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3 shadow-xl"
            >
              <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-6 rounded" />
              {t.payBtn}
            </button>

            <p className="text-[10px] text-zinc-500 text-center">
              {t.foundsSent} {PAYPAL_EMAIL}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
