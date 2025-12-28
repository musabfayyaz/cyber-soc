
import { NextResponse } from 'next/server';
import { getSocketIO, getClients } from '@/lib/socket';

export async function POST(request) {
  const { clientId, command, args } = await request.json();
  const io = getSocketIO();
  
  // Send the command to the specific Python client
  io.to(clientId).emit('command', { command, args });

  // --- Notify the UI that a command was sent ---
  const clients = getClients();
  const client = clients.find(c => c.id === clientId);
  const clientName = client ? `${client.clientData.user}@${client.clientData.hostname}` : clientId;

  let alertMessage = `Command '${command}' sent to ${clientName}.`;
  let alertType = 'info';

  if (command === 'alert') {
    alertMessage = `Alert sent to ${clientName}: "${args.message}"`;
    alertType = 'success';
  }

  io.emit('ui-alert', {
    message: alertMessage,
    type: alertType,
  });
  // -----------------------------------------

  return NextResponse.json({ success: true, message: `Command '${command}' sent to ${clientId}` });
}
