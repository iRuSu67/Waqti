import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const QueueContext = createContext();

export const useQueue = () => useContext(QueueContext);

export const QueueProvider = ({ children }) => {
  // State Variables
  const [currentServingNumber, setCurrentServingNumber] = useState(1);
  const [totalWaiting, setTotalWaiting] = useState(0);
  const [averageServiceTime, setAverageServiceTime] = useState(3.5); // 3.5 minutes per person
  const [citizenTicket, setCitizenTicket] = useState(null);
  
  // Real-time Mock History array (for admin view)
  const [recentHistory, setRecentHistory] = useState([]);

  // Socket instance (Replace URL with backend when ready)
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Attempt connection
    const newSocket = io('http://localhost:3000', { autoConnect: false }); 
    setSocket(newSocket);
    
    // Fallback Mock Logic: if we aren't using a real backend, we just rely on local state updates.
    return () => newSocket.close();
  }, []);

  // Action: Take Ticket
  const takeTicket = () => {
    // 1. Increment waiting
    const newTotalWaiting = totalWaiting + 1;
    setTotalWaiting(newTotalWaiting);
    
    // 2. Assign Number (Simplistic logic: current + waiting + 1)
    // Actually, normally this is handled by backend.
    const myNumber = currentServingNumber + newTotalWaiting;
    
    // 3. Calculate Estimated Wait
    const waitTime = Math.ceil(newTotalWaiting * averageServiceTime);
    
    // 4. Set state
    setCitizenTicket({
      number: myNumber,
      estimatedWaitTime: waitTime,
      status: 'waiting'
    });
    
    // Emit to real backend if connected
    if (socket && socket.connected) {
      socket.emit('queue:new_ticket', { number: myNumber });
    }
  };

  // Action: Cancel Ticket
  const cancelTicket = () => {
    if (totalWaiting > 0) setTotalWaiting(w => w - 1);
    setCitizenTicket(null);
  };

  // Action: Admin Next Number
  const callNext = () => {
    setCurrentServingNumber(curr => curr + 1);
    setTotalWaiting(curr => Math.max(0, curr - 1));
    
    // Add to history
    setRecentHistory(prev => [
      { number: currentServingNumber, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9) // Keep last 10
    ]);

    // Emit to real backend if connected
    if (socket && socket.connected) {
      socket.emit('admin:next', { nextNumber: currentServingNumber + 1 });
    }
  };

  return (
    <QueueContext.Provider value={{
      currentServingNumber,
      totalWaiting,
      averageServiceTime,
      citizenTicket,
      recentHistory,
      takeTicket,
      cancelTicket,
      callNext
    }}>
      {children}
    </QueueContext.Provider>
  );
};
