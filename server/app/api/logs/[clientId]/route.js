
import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/socket';

export async function GET(request, { params }) {
  const { clientId } = params;
  const logs = getLogs(clientId);
  return NextResponse.json(logs);
}
