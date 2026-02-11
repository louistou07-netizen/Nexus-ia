
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Palette, 
  Mic2, 
  ScanSearch, 
  User as UserIcon, 
  Zap,
  Menu,
  X,
  CreditCard,
  Crown,
  LogOut
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import NexusChat from './components/NexusChat';
import NexusCanvas from './components/NexusCanvas';
import NexusVoice from './components/NexusVoice';
import NexusLens from './components/NexusLens';
import Auth from './components/Auth';
import NexusAd from './components/NexusAd';
import { NexusModule, User } from './types';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<NexusModule>(NexusModule.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nexus_user');
    setUser(null);
    setActiveModule(NexusModule.DASHBOARD);
  };

  const navItems = [
    { id: NexusModule.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: NexusModule.CHAT, label: 'Nexus Chat', icon: MessageSquare },
    { id: NexusModule.CANVAS, label: 'Nexus Canvas', icon: Palette },
    { id: NexusModule.VOICE, label: 'Nexus Voice', icon: Mic2 },
    { id: NexusModule.LENS, label: 'Nexus Lens', icon: ScanSearch },
  ];

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const renderContent = () => {
    switch (activeModule) {
      case NexusModule.DASHBOARD: return <Dashboard onNavigate={setActiveModule} user={user} />;
      case NexusModule.CHAT: return <NexusChat />;
      case NexusModule.CANVAS: return <NexusCanvas />;
      case NexusModule.VOICE: return <NexusVoice />;
      case NexusModule.LENS: return <NexusLens />;
      default: return <Dashboard onNavigate={setActiveModule} user={user} />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 border-r border-zinc-800 bg-zinc-950 flex flex-col z-50`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center neon-border">
            <Zap className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && <span className="font-heading font-bold text-xl tracking-tight">NEXUS IA</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                activeModule === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}

          {/* Ad Slot in Sidebar */}
          {user.tier === 'basic' && isSidebarOpen && <NexusAd type="sidebar" />}
        </nav>

        {/* User Profile Section in Sidebar */}
        <div className="p-4 border-t border-zinc-900 space-y-2">
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-zinc-900/50 ${!isSidebarOpen && 'justify-center'}`}>
            <img src={user.avatar} className="w-8 h-8 rounded-full border border-indigo-500/30" alt="Avatar" />
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate">{user.username}</p>
                <p className="text-[10px] text-indigo-400 flex items-center gap-1">
                  {user.tier === 'elite' ? <Crown className="w-3 h-3" /> : null}
                  {user.credits} Crédits
                </p>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_#09090b_70%)]">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
