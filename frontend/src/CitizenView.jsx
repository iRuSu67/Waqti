import React, { useEffect, useState } from 'react';
import { useQueue } from './QueueContext';
import { Clock, Ticket, XCircle, BellRing, ArrowRight } from 'lucide-react';

export default function CitizenView() {
  const { currentServingNumber, averageServiceTime, citizenTicket, takeTicket, cancelTicket } = useQueue();
  const [notificationStatus, setNotificationStatus] = useState('');

  // Calculate dynamic data
  const distance = citizenTicket ? Math.max(0, citizenTicket.number - currentServingNumber) : 0;
  const remainingTime = Math.ceil(distance * averageServiceTime);

  // Monitor position for notifications
  useEffect(() => {
    if (!citizenTicket) {
      setNotificationStatus('');
      return;
    }

    if (distance === 0) {
      setNotificationStatus("C'est votre tour ! Allez au guichet.");
      // Optional: trigger browser notification here using Notification API
      if (Notification.permission === 'granted') {
          new Notification("Waqti: C'est votre tour !");
      }
    } else if (distance <= 2 && distance > 0) {
      setNotificationStatus("Votre tour approche, préparez-vous.");
    } else {
      setNotificationStatus('');
    }
  }, [distance, citizenTicket]);

  // Request Notification Permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white p-6 md:p-10" dir="ltr">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Waqti</h1>
        <p className="text-slate-400 mt-1">CNSS - Agence Tanger Centre</p>
      </header>

      {/* Main Queue Board (Glass Card) */}
      <div className="flex-1 max-w-sm mx-auto w-full flex flex-col items-center justify-center gap-8 border border-white/10 bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl mb-12">
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-slate-400 mb-2 font-medium">Actuellement au guichet</p>
          <div className="text-8xl md:text-9xl font-extrabold text-blue-400 tabular-nums">
            {currentServingNumber}
          </div>
        </div>

        {/* Dynamic Action Area */}
        <div className="w-full">
          {!citizenTicket ? (
            <button 
              onClick={takeTicket}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white font-semibold text-lg py-4 px-6 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              <Ticket size={24} />
              Prendre un ticket
            </button>
          ) : (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-slate-800/80 rounded-2xl p-6 border border-white/5 flex flex-col items-center shadow-inner">
                <p className="text-slate-400 text-sm mb-1">Votre Numéro</p>
                <p className="text-5xl font-bold mb-4">{citizenTicket.number}</p>
                
                <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000 ease-in-out" 
                    style={{ width: `${Math.max(5, 100 - (distance * 10))}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Clock size={16} className="text-blue-400"/>
                  <span>Temps estimé: <strong>{remainingTime} min</strong></span>
                </div>
              </div>

              {notificationStatus && (
                <div className="bg-blue-500/20 border border-blue-500/30 text-blue-100 p-4 rounded-xl flex items-start gap-3 text-sm">
                   <BellRing size={20} className="shrink-0 text-blue-400" />
                   <p>{notificationStatus}</p>
                </div>
              )}

              {distance > 0 && (
                 <button 
                  onClick={cancelTicket}
                  className="mt-2 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors py-3 text-sm font-medium"
                >
                  <XCircle size={18} />
                  Annuler mon ticket
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
