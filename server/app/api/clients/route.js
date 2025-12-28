
import { NextResponse } from 'next/server';
import { getClients } from '@/lib/socket';

export async function GET() {
  const clients = getClients();
  return NextResponse.json(clients);
}
