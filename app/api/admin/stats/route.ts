import { NextRequest } from 'next/server';
import { supabaseDb } from '@/lib/supabase/db';

// GET /api/admin/stats - Fetch dashboard KPIs from real data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';

  // Calculate date range
  const now = new Date();
  let daysBack = 30;
  switch (range) {
    case '7d': daysBack = 7; break;
    case '30d': daysBack = 30; break;
    case '90d': daysBack = 90; break;
    case '1y': daysBack = 365; break;
  }

  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - daysBack);
  const startDateStr = startDate.toISOString();

  try {
    // Fetch bookings in range
    const { data: bookings, error: bookingsError } = await supabaseDb
      .from('bookings')
      .select('total_amount, booking_status, payment_status, service_id, customer_id, created_at, services(category)')
      .gte('created_at', startDateStr)
      .neq('booking_status', 'cancelled');

    if (bookingsError) throw bookingsError;

    const allBookings = bookings || [];

    // Calculate KPIs
    const totalRevenue = allBookings
      .filter((b: any) => b.payment_status === 'paid')
      .reduce((sum: number, b: any) => sum + Number(b.total_amount || 0), 0);

    const totalBookings = allBookings.length;

    // Unique customers
    const uniqueCustomerIds = new Set(allBookings.map((b: any) => b.customer_id));
    const totalCustomers = uniqueCustomerIds.size;

    // Average order value
    const avgOrderValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Revenue by category
    const categoryMap: Record<string, { revenue: number; bookings: number }> = {};
    allBookings.forEach((b: any) => {
      const cat = b.services?.category || 'other';
      if (!categoryMap[cat]) categoryMap[cat] = { revenue: 0, bookings: 0 };
      categoryMap[cat].bookings += 1;
      if (b.payment_status === 'paid') {
        categoryMap[cat].revenue += Number(b.total_amount || 0);
      }
    });

    const totalCategoryRevenue = Object.values(categoryMap).reduce((s, c) => s + c.revenue, 0);
    const revenueByCategory = Object.entries(categoryMap).map(([category, data]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      revenue: data.revenue,
      bookings: data.bookings,
      percentage: totalCategoryRevenue > 0 ? Math.round((data.revenue / totalCategoryRevenue) * 100) : 0,
    }));

    // Repeat customers (customers with 2+ bookings in range)
    const customerBookingCount: Record<string, number> = {};
    allBookings.forEach((b: any) => {
      customerBookingCount[b.customer_id] = (customerBookingCount[b.customer_id] || 0) + 1;
    });
    const repeatCustomerCount = Object.values(customerBookingCount).filter(c => c >= 2).length;

    // Leads count
    const { count: leadsCount } = await supabaseDb
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    return Response.json({
      success: true,
      stats: {
        totalRevenue,
        totalBookings,
        totalCustomers,
        repeatCustomers: repeatCustomerCount,
        avgOrderValue,
        revenueByCategory,
        pendingLeads: leadsCount || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
