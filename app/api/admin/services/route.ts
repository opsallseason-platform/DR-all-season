import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/supabase/db';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

function revalidateServicePages() {
  for (const locale of ['en', 'es']) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/tours`, 'layout');
    revalidatePath(`/${locale}/transfers`, 'layout');
    revalidatePath(`/${locale}/booking`);
  }
}

// GET all services with full details for admin
export async function GET() {
  try {
    const { data, error } = await supabaseDb
      .from('services')
      .select('*, pricing_tiers(*)')
      .order('category')
      .order('title_en');

    if (error) throw error;
    return NextResponse.json(data || [], {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST create a new service
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const { data, error } = await supabaseDb
      .from('services')
      .insert({
        id,
        title_en: body.title_en,
        title_es: body.title_es || body.title_en,
        slug_en: body.slug_en || body.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        slug_es: body.slug_es || body.slug_en || body.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description_en: body.description_en || '',
        description_es: body.description_es || '',
        category: body.category || 'excursion',
        status: body.status || 'active',
        featured: body.featured || false,
        is_per_person: body.is_per_person ?? body.category !== 'transfer',
        child_price_enabled: body.child_price_enabled ?? body.category !== 'transfer',
        has_open_bar: body.has_open_bar || false,
        featured_image: body.featured_image || '/images/placeholder.svg',
        gallery_images: body.gallery_images || [],
        duration_minutes: body.duration_minutes || 240,
        base_capacity: body.base_capacity || 20,
        extra_person_price: body.extra_person_price ? Number(body.extra_person_price) : null,
        inclusions_en: body.inclusions_en || [],
        inclusions_es: body.inclusions_es || [],
        exclusions_en: body.exclusions_en || [],
        exclusions_es: body.exclusions_es || [],
        updated_at: now,
      })
      .select('id')
      .single();

    if (error) throw error;

    // Create pricing tiers
    if (body.pricing_packages && body.pricing_packages.length > 0) {
      const tiers = body.pricing_packages.map((pkg: any) => ({
        id: crypto.randomUUID(),
        service_id: id,
        min_passengers: 1,
        max_passengers: body.base_capacity || 20,
        price_per_person: Number(pkg.price_per_person) || 0,
        child_price: pkg.child_price != null ? Number(pkg.child_price) : null,
        label: pkg.label || null,
      }));
      const { error: tierError } = await supabaseDb
        .from('pricing_tiers')
        .insert(tiers);
      if (tierError) throw tierError;
    } else if (body.price_per_person) {
      const { error: tierError } = await supabaseDb
        .from('pricing_tiers')
        .insert({
          id: crypto.randomUUID(),
          service_id: id,
          min_passengers: 1,
          max_passengers: body.base_capacity || 20,
          price_per_person: Number(body.price_per_person),
          child_price: body.child_price_enabled ? (Number(body.child_price) || Math.round(Number(body.price_per_person) * 0.7)) : null,
          label: null,
        });
      if (tierError) throw tierError;
    }

    revalidateServicePages();
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH update an existing service
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, price_per_person, child_price, child_price_enabled, pricing_packages, extra_person_price, ...updateFields } = body;

    if (!id) {
      return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
    }

    // Update service fields
    const now = new Date().toISOString();
    const serviceUpdates = child_price_enabled === undefined
      ? updateFields
      : { ...updateFields, child_price_enabled };
    // Include extra_person_price if provided
    if (extra_person_price !== undefined) {
      (serviceUpdates as any).extra_person_price = extra_person_price === '' || extra_person_price === null ? null : Number(extra_person_price);
    }
    const { error } = await supabaseDb
      .from('services')
      .update({ ...serviceUpdates, updated_at: now })
      .eq('id', id);

    if (error) throw error;

    // Update pricing tiers
    if (pricing_packages && pricing_packages.length > 0) {
      // Delete existing tiers and re-create
      await supabaseDb
        .from('pricing_tiers')
        .delete()
        .eq('service_id', id);

      const tiers = pricing_packages.map((pkg: any) => ({
        id: crypto.randomUUID(),
        service_id: id,
        min_passengers: 1,
        max_passengers: 20,
        price_per_person: Number(pkg.price_per_person) || 0,
        child_price: pkg.child_price != null ? Number(pkg.child_price) : null,
        label: pkg.label || null,
      }));
      await supabaseDb
        .from('pricing_tiers')
        .insert(tiers);
    } else if (price_per_person !== undefined) {
      // Single pricing tier (backward compat)
      // Check if tier exists
      const { data: existingTier } = await supabaseDb
        .from('pricing_tiers')
        .select('id')
        .eq('service_id', id)
        .limit(1)
        .maybeSingle();

      const childPricingEnabled = child_price_enabled ?? updateFields.category !== 'transfer';
      const adultPrice = Number(price_per_person) || 0;
      const calculatedChildPrice = childPricingEnabled ? (Number(child_price) || Math.round(adultPrice * 0.7)) : null;

      if (existingTier) {
        await supabaseDb
          .from('pricing_tiers')
          .update({ 
            price_per_person: adultPrice,
            child_price: calculatedChildPrice
          })
          .eq('id', existingTier.id);
      } else {
        await supabaseDb
          .from('pricing_tiers')
          .insert({
            id: crypto.randomUUID(),
            service_id: id,
            min_passengers: 1,
            max_passengers: 20,
            price_per_person: adultPrice,
            child_price: calculatedChildPrice,
          });
      }
    }

    revalidateServicePages();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE a service (sets status to inactive)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID required' }, { status: 400 });
    }

    const { error } = await supabaseDb
      .from('services')
      .update({ status: 'inactive', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    revalidateServicePages();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
