import { NextRequest, NextResponse } from 'next/server';
import { getTransfers } from '@/lib/data/services';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const locale = request.nextUrl.searchParams.get('locale') === 'es' ? 'es' : 'en';
    const transfers = await getTransfers(locale);
    return NextResponse.json(transfers, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
}
