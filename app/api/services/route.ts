import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedServices, getAllServices, getServiceBySlug } from '@/lib/data/services';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const featured = searchParams.get('featured');
  const slug = searchParams.get('slug');
  
  try {
    // Get single service by slug
    if (slug) {
      const service = await getServiceBySlug(slug);
      if (!service) {
        return NextResponse.json(
          { error: 'Service not found' }, 
          { status: 404 }
        );
      }
      return NextResponse.json(service);
    }
    
    // Get featured services
    if (featured === 'true') {
      const services = await getFeaturedServices();
      return NextResponse.json(services);
    }
    
    // Default: return all services
    const services = await getAllServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' }, 
      { status: 500 }
    );
  }
}
