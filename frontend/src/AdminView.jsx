import React from 'react';
import { useQueue } from './QueueContext';
import { Users, Clock, ArrowRightCircle, List } from 'lucide-react';

export default function AdminView() {
  const { currentServingNumber, totalWaiting, averageServiceTime, callNext, recentHistory } = useQueue();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex" dir="ltr">
      {/* Simple Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Waqti Admin</h2>
          <p className="text-xs text-slate-500 mt-1">Guichet 1</p>
        </div>
        <nav className="flex-1 p-4">
          <a href="#" className="flex items-center gap-3 bg-blue-600/10 text-blue-400 px-4 py-3 rounded-lg font-medium">
            <List size={20} />
            File d'Attente
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 flex flex-col h-screen overflow-hidden">
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
             <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400">
                <Users size={24} />
             </div>
             <div>
                <p className="text-slate-400 text-sm">En Attente</p>
                <p className="text-3xl font-bold text-white">{totalWaiting}</p>
             </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
             <div className="bg-green-500/20 p-3 rounded-xl text-green-400">
                <ArrowRightCircle size={24} />
             </div>
             <div>
                <p className="text-slate-400 text-sm">Actuellement Servi</p>
                <p className="text-3xl font-bold text-white">{currentServingNumber}</p>
             </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
             <div className="bg-purple-500/20 p-3 rounded-xl text-purple-400">
                <Clock size={24} />
             </div>
             <div>
                <p className="text-slate-400 text-sm">Temps Moyen</p>
                <p className="text-3xl font-bold text-white">{averageServiceTime} min</p>
             </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            {/* Action Board */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400"></div>
                
                <h3 className="text-xl text-slate-400 mb-6 font-medium">Numéro Actuel</h3>
                <div className="text-9xl font-black text-white tabular-nums tracking-tighter mb-12 shadow-sm drop-shadow-lg">
                    {currentServingNumber}
                </div>
                
                <button 
                  onClick={callNext}
                  disabled={totalWaiting === 0}
                  className="group relative inline-flex items-center justify-center gap-4 px-12 py-6 font-bold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-2xl hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_40px_rgba(37,99,235,0.3)] disabled:shadow-none"
                >
                  <span className="text-2xl tracking-wide">NUMÉRO SUIVANT</span>
                  <ArrowRightCircle size={28} className="group-hover:translate-x-1 transition-transform" />
                </button>
                {totalWaiting === 0 && (
                    <p className="text-orange-400 mt-4 text-sm font-medium">La file d'attente est vide.</p>
                )}
            </div>

            {/* Recent History Sidebar */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <List size={18} className="text-slate-400"/>
                    Historique Récent
                </h3>
                <div className="space-y-3">
                    {recentHistory.length === 0 ? (
                        <p className="text-slate-500 text-sm text-center py-4">Aucun passage enregistré.</p>
                    ) : (
                        recentHistory.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                <span className="font-bold text-slate-300">#{item.number}</span>
                                <span className="text-xs text-slate-500">{item.time}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

      </main>
    </div>
  );
}
