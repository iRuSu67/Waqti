import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueueProvider } from './QueueContext';
import CitizenView from './CitizenView';
import AdminView from './AdminView';

function App() {
  return (
    <QueueProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CitizenView />} />
          <Route path="/admin" element={<AdminView />} />
        </Routes>
        
        {/* Development Navigation Overlay (Removable for Production) */}
        <div className="fixed bottom-4 right-4 bg-slate-800/80 backdrop-blur-md border border-slate-700 p-2 rounded-xl text-xs flex gap-2 shadow-2xl z-50">
           <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium px-2 py-1">Citizen View</Link>
           <div className="w-px bg-slate-700"></div>
           <Link to="/admin" className="text-purple-400 hover:text-purple-300 font-medium px-2 py-1">Admin Demo</Link>
        </div>
      </Router>
    </QueueProvider>
  );
}

export default App;
