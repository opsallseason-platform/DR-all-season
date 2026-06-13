import { NextResponse } from 'next/server';
import { getTransfers } from '@/lib/data/services';

export async function GET() {
  try {
    const transfers = await getTransfers();
    return NextResponse.json(transfers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
}
