import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../constants";

const WebSocketContext = createContext();

export const useWebSocket = () => {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket must be used within a WebSocketProvider");
  return ctx;
};

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    console.log("🌐 Connecting to websocket:", API_BASE_URL);

    const socketInstance = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1500,
    });

    socketInstance.on("connect", () => {
      console.log("✅ WebSocket Connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("⚠️ WebSocket Disconnected");
      setIsConnected(false);
    });

    socketInstance.on("notification", (notif) => {
      const enriched = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...notif,
      };
      setNotifications((prev) => [enriched, ...prev]);

      if (notif.type === "success") toast.success(notif.title);
      else if (notif.type === "error") toast.error(notif.title);
      else toast.info(notif.title);
    });

    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, []);

  const emitEvent = (event, data) => {
    if (socket && isConnected) socket.emit(event, data);
  };

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        emitEvent,
        clearNotifications: () => setNotifications([]),
        removeNotification: (id) =>
          setNotifications((prev) => prev.filter((n) => n.id !== id)),
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};
