
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'db');
const CLIENTS_FILE = path.join(DB_DIR, 'clients.json');
const LOGS_FILE = path.join(DB_DIR, 'logs.json');

let clients = new Map();
let logs = new Map();

function saveData() {
    try {
        fs.writeFileSync(CLIENTS_FILE, JSON.stringify(Array.from(clients.entries())));
        fs.writeFileSync(LOGS_FILE, JSON.stringify(Array.from(logs.entries())));
    } catch (error) {
        console.error("Failed to save data:", error);
    }
}

function loadData() {
    try {
        if (fs.existsSync(CLIENTS_FILE)) {
            const clientsData = JSON.parse(fs.readFileSync(CLIENTS_FILE, 'utf-8'));
            clients = new Map(clientsData);
        }
        if (fs.existsSync(LOGS_FILE)) {
            const logsData = JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8'));
            logs = new Map(logsData);
        }
        console.log("Data loaded successfully.");
    } catch (error) {
        console.error("Failed to load data:", error);
    }
}


export function initSocket(io) {
  loadData();

  globalThis._io = io;

  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);
    socket.emit('clients', Array.from(clients.values()));
    
    // A client might be reconnecting, let's not add it to clients until it registers
    // and we know it's a "fresh" connection vs a page reload.

    socket.on('register', (data) => {
      const incomingClient = data.clientData;

      if (!incomingClient) {
        console.error("Invalid register event: clientData is missing");
        return;
      }

      // De-duplicate: Find and remove any existing client with the same user/hostname
      for (const [id, existingClient] of clients.entries()) {
        if (
          existingClient.clientData &&
          existingClient.clientData.user === incomingClient.user &&
          existingClient.clientData.hostname === incomingClient.hostname
        ) {
          console.log(`Duplicate client detected. Old ID: ${id}, New ID: ${socket.id}. Removing old entry.`);
          clients.delete(id);
        }
      }

      // Add the new client
      clients.set(socket.id, { clientData: incomingClient, id: socket.id });

      // If logs for this client don't exist, initialize them.
      if (!logs.has(socket.id)) {
        logs.set(socket.id, []);
      }
      console.log('Client registered:', socket.id, incomingClient);
      io.emit('clients', Array.from(clients.values()));
      saveData();
    });

    socket.on('log', (logData) => {
      if (logs.has(socket.id)) {
        const clientLogs = logs.get(socket.id);
        const newLog = { ...logData, timestamp: new Date().toISOString() };
        clientLogs.push(newLog);
        logs.set(socket.id, clientLogs);
        io.emit('logs', { clientId: socket.id, logs: clientLogs });
        saveData();
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      clients.delete(socket.id);
      // We can choose to keep the logs, or delete them.
      // For a SOC, keeping them makes sense. Let's comment out the deletion.
      // logs.delete(socket.id); 
      io.emit('clients', Array.from(clients.values()));
      saveData();
    });
  });
}

export function getSocketIO() {
  const io = globalThis._io;
  if (!io) {
    throw new Error('Socket.IO not initialized!');
  }
  return io;
}

export function getClients() {
    return Array.from(clients.values());
}

export function getLogs(clientId) {
    return logs.get(clientId) || [];
}
