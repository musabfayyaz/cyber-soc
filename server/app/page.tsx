'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Chip,
} from '@mui/material';
import { Computer, Shield, Send, PowerSettingsNew, NotificationsActive } from '@mui/icons-material';

import { signOut } from 'next-auth/react';
import { Logout } from '@mui/icons-material';

interface ClientData {
  user: string;
  hostname: string;
  os: string;
}

interface Client {
  id: string;
  clientData: ClientData;
}

interface ClientListProps {
  clients: Client[];
  selectedClient: Client | null;
  onSelectClient: (client: Client) => void;
}

const ClientList = ({ clients, selectedClient, onSelectClient }: ClientListProps) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title="Connected Clients" avatar={<Computer />} />
    <CardContent>
      <List>
        {clients.map((client) => (
          <ListItem key={client.id} disablePadding>
            <ListItemButton
              selected={selectedClient?.id === client.id}
              onClick={() => onSelectClient(client)}
            >
              <ListItemText
                primary={`${client.clientData.user}@${client.clientData.hostname}`}
                secondary={client.clientData.os}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

import { Charts } from './charts';

interface LogEntry {
  level: string;
  type: string;
  message: string;
  timestamp: string;
}

const LogView = ({ logs }: { logs: LogEntry[] }) => {
    const getChipColor = (level: string) => {
        if (level === 'error') return 'error';
        if (level === 'warn') return 'warning';
        return 'info';
      };

    return (
  <Card sx={{ height: '100%' }}>
    <CardHeader title="Activity Log" avatar={<Shield />} />
    <CardContent sx={{ height: 'calc(100% - 72px)', overflowY: 'auto' }}>
        {logs.map((log, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mr: 2 }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                </Typography>
                <Chip label={log.type} color={getChipColor(log.level)} size="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{log.message}</Typography>
            </Box>
        ))}
    </CardContent>
  </Card>
)};

import { ThreatIntel } from './threat-intel';

import { Block, Security } from '@mui/icons-material';

interface ActionBarProps {
  selectedClient: Client | null;
}

const ActionBar = ({ selectedClient }: ActionBarProps) => {
  const sendCommand = async (command: string, args: Record<string, any> = {}) => {
    if (!selectedClient) {
      alert('No client selected!');
      return;
    }
    await fetch('/api/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: selectedClient.id, command, args }),
    });
  };

  const handleSendAlert = () => {
    const message = prompt('Enter the alert message:');
    if (message) {
      sendCommand('alert', { message });
    }
  };

  const handleBlockUrl = () => {
    const url = prompt('Enter the URL to block:');
    if (url) {
      sendCommand('block-url', { url });
    }
  };

  return (
    <Card>
      <CardHeader title="Remote Actions" avatar={<Send />} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<NotificationsActive />}
              onClick={handleSendAlert}
              disabled={!selectedClient}
            >
              Send Alert
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="error"
              startIcon={<PowerSettingsNew />}
              onClick={() => sendCommand('shutdown')}
              disabled={!selectedClient}
            >
              Shutdown (Demo)
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="warning"
              startIcon={<Security />}
              onClick={() => sendCommand('isolate')}
              disabled={!selectedClient}
            >
              Isolate (Demo)
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Block />}
              onClick={handleBlockUrl}
              disabled={!selectedClient}
            >
              Block URL (Demo)
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// --- Alert Functions and Styles ---
function addAlertStyles() {
  const styleId = 'custom-alert-styles';
  if (document.getElementById(styleId)) return; // Avoid adding styles multiple times

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
      .custom-alert {
          padding: 15px;
          margin-bottom: 20px;
          border: 1px solid transparent;
          border-radius: 4px;
          position: fixed;
          top: 90px; /* Adjusted to be below the AppBar */
          right: 20px;
          z-index: 1050;
          display: none; /* Initially hidden */
          color: #fff;
          min-width: 300px;
      }
      .custom-alert-info {
          background-color: #2196F3; /* Material UI Blue */
      }
      .custom-alert-success {
          background-color: #4CAF50; /* Material UI Green */
      }
      .custom-alert-warning {
          background-color: #FFC107; /* Material UI Amber */
      }
      .custom-alert-error {
          background-color: #F44336; /* Material UI Red */
      }
  `;
  document.head.appendChild(style);
}

function showAlert(message: string, type = 'info') {
  const alertContainer = document.getElementById('soc-alert-container');
  if (alertContainer) {
    alertContainer.textContent = message;
    alertContainer.className = `custom-alert custom-alert-${type}`;
    alertContainer.style.display = 'block';

    // Hide after 5 seconds
    setTimeout(() => {
        alertContainer.style.display = 'none';
    }, 5000);
  }
}
// ------------------------------------


export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Effect for socket connection and listeners
  useEffect(() => {
    addAlertStyles(); // Add the alert styles to the DOM
    const socket = io();

    socket.on('connect', () => {
        console.log('Socket connected');
    });

    socket.on('clients', (clients) => {
      setClients(clients);
    });

    socket.on('logs', ({ clientId, logs: newLogs }) => {
        // Update logs for the currently selected client
        setSelectedClient((currentSelectedClient) => {
            if (currentSelectedClient && currentSelectedClient.id === clientId) {
                setLogs(newLogs);
            }
            return currentSelectedClient;
        });
    });

    socket.on('ui-alert', ({ message, type }) => {
      showAlert(message, type);
    });

    return () => {
        console.log('Socket disconnected');
        socket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    fetch(`/api/logs/${client.id}`)
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
      });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div id="soc-alert-container" style={{ display: 'none' }}></div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            Mini SOC Dashboard
          </Typography>
          <Button
            color="inherit"
            startIcon={<Logout />}
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <ClientList
              clients={clients}
              selectedClient={selectedClient}
              onSelectClient={handleSelectClient}
            />
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Charts logs={logs} />
              </Grid>
              <Grid item xs={12} sx={{ height: '45vh' }}>
                <LogView logs={logs} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ActionBar selectedClient={selectedClient} />
              </Grid>
              <Grid item xs={12} md={6}>
                <ThreatIntel />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

