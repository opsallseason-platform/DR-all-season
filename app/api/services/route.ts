import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedServices, getAllServices, getServiceBySlug } from '@/lib/data/services';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const featured = searchParams.get('featured');
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale') === 'es' ? 'es' : 'en';
  
  try {
    // Get single service by slug
    if (slug) {
      const service = await getServiceBySlug(slug, locale);
      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' }, 
          { status: 404 }
        );
      }
      return NextResponse.json(service, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }
    
    // Get featured services
    if (featured === 'true') {
      const services = await getFeaturedServices(locale);
      return NextResponse.json(services, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }
    
    // Default: return all services
    const services = await getAllServices(locale);
    return NextResponse.json(services, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' }, 
      { status: 500 }
    );
  }
}
