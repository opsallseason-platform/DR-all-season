/**
 * SEED SCRIPT - Uses Supabase JS client (no Prisma dependency)
 *
 * Run with: npx tsx scripts/seed.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env
 */

import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (order matters for FK constraints)
  console.log('🗑️  Clearing existing data...');
  await supabase.from('reviews').delete().neq('id', '');
  await supabase.from('pricing_tiers').delete().neq('id', '');
  await supabase.from('services').delete().neq('id', '');
  await supabase.from('admin_users').delete().neq('id', '');

  // Create admin users
  console.log('👤 Creating admin users...');
  const hashedPassword = await hash('admin123', 10);

  const { error: adminError } = await supabase.from('admin_users').insert([
    {
      email: 'admin@drallseasontravel.com',
      password_hash: hashedPassword,
      full_name: 'System Administrator',
    },
    {
      email: 'manager@drallseasontravel.com',
      password_hash: hashedPassword,
      full_name: 'Operations Manager',
    },
    {
      email: 'support@drallseasontravel.com',
      password_hash: hashedPassword,
      full_name: 'Customer Support',
    },
    {
      email: 'guide@drallseasontravel.com',
      password_hash: hashedPassword,
      full_name: 'Tour Guide Lead',
    },
  ]);

  if (adminError) throw adminError;

  // Create tours
  console.log('🌴 Creating tours...');

  const tours = [
    {
      title_en: 'Samaná Waterfalls Adventure',
      title_es: 'Aventura Cascadas de Samaná',
      slug_en: 'samana-waterfalls',
      slug_es: 'cascadas-samana',
      description_en: 'Experience the breathtaking El Limón waterfall with expert guides. Includes horseback riding through tropical forests, swimming in natural pools, and traditional Dominican lunch.',
      description_es: 'Experimenta la impresionante cascada El Limón con guías expertos. Incluye paseo a caballo por bosques tropicales, natación en piscinas naturales y almuerzo tradicional dominicano.',
      category: 'tour',
      duration_minutes: 480,
      base_capacity: 15,
      featured: true,
      status: 'active',
      featured_image: '/images/excursions/Samana.png',
      gallery_images: ['/images/excursions/Samana.png'],
      inclusions_en: ['Round-trip transportation', 'Professional guide', 'Horseback riding', 'Lunch', 'Entrance fees', 'Water'],
      inclusions_es: ['Transporte ida y vuelta', 'Guía profesional', 'Paseo a caballo', 'Almuerzo', 'Entradas', 'Agua'],
      exclusions_en: ['Gratuities', 'Photos', 'Personal expenses'],
      exclusions_es: ['Propinas', 'Fotos', 'Gastos personales'],
      requirements_en: ['Comfortable clothing', 'Swimsuit', 'Towel', 'Sunscreen'],
      requirements_es: ['Ropa cómoda', 'Traje de baño', 'Toalla', 'Protector solar'],
    },
    {
      title_en: 'Santo Domingo City Tour',
      title_es: 'Tour Ciudad Colonial Santo Domingo',
      slug_en: 'santo-domingo-city',
      slug_es: 'tour-santo-domingo',
      description_en: 'Explore the historic colonial zone, museums, and landmarks of the oldest city in the Americas.',
      description_es: 'Explora la zona colonial histórica, museos y monumentos de la ciudad más antigua de las Américas.',
      category: 'tour',
      duration_minutes: 300,
      base_capacity: 20,
      featured: true,
      status: 'active',
      featured_image: '/images/excursions/santo_domingo.jpg',
      gallery_images: ['/images/excursions/santo_domingo.jpg'],
      inclusions_en: ['Transportation', 'Guide', 'Entrance fees', 'Lunch'],
      inclusions_es: ['Transporte', 'Guía', 'Entradas', 'Almuerzo'],
      exclusions_en: ['Gratuities', 'Shopping'],
      exclusions_es: ['Propinas', 'Compras'],
      requirements_en: ['Comfortable shoes', 'Sun protection', 'Camera'],
      requirements_es: ['Zapatos cómodos', 'Protección solar', 'Cámara'],
    },
    {
      title_en: 'Cayo Levantado Beach Escape',
      title_es: 'Escapada Playa Cayo Levantado',
      slug_en: 'cayo-levantado-beach',
      slug_es: 'playa-cayo-levantado',
      description_en: 'Relax on the pristine white sands of Bacardi Island. Enjoy crystal-clear waters and buffet lunch.',
      description_es: 'Relájate en las arenas blancas de la Isla Bacardi. Disfruta de aguas cristalinas y almuerzo buffet.',
      category: 'tour',
      duration_minutes: 360,
      base_capacity: 25,
      featured: false,
      status: 'active',
      featured_image: '/images/excursions/cayo-levantado.jpg',
      gallery_images: ['/images/excursions/cayo-levantado.jpg'],
      inclusions_en: ['Boat transfer', 'Beach access', 'Lunch', 'Drinks'],
      inclusions_es: ['Traslado en bote', 'Acceso a playa', 'Almuerzo', 'Bebidas'],
      exclusions_en: ['Water sports', 'Gratuities'],
      exclusions_es: ['Deportes acuáticos', 'Propinas'],
      requirements_en: ['Swimsuit', 'Towel', 'Sunscreen'],
      requirements_es: ['Traje de baño', 'Toalla', 'Protector solar'],
    },
    {
      title_en: 'Los Haitises National Park',
      title_es: 'Parque Nacional Los Haitises',
      slug_en: 'los-haitises-national-park',
      slug_es: 'parque-los-haitises',
      description_en: 'Navigate through mangrove forests and limestone caves. Discover ancient Taino petroglyphs.',
      description_es: 'Navega por bosques de manglares y cuevas de piedra caliza. Descubre petroglifos taínos antiguos.',
      category: 'tour',
      duration_minutes: 420,
      base_capacity: 18,
      featured: false,
      status: 'active',
      featured_image: '/images/excursions/los-haitises.webp',
      gallery_images: ['/images/excursions/los-haitises.webp'],
      inclusions_en: ['Boat tour', 'Guide', 'Entrance fees', 'Snacks'],
      inclusions_es: ['Tour en bote', 'Guía', 'Entradas', 'Meriendas'],
      exclusions_en: ['Lunch', 'Gratuities'],
      exclusions_es: ['Almuerzo', 'Propinas'],
      requirements_en: ['Comfortable clothing', 'Water shoes', 'Camera'],
      requirements_es: ['Ropa cómoda', 'Zapatos acuáticos', 'Cámara'],
    },
    {
      title_en: 'Whale Watching Experience',
      title_es: 'Experiencia Avistamiento Ballenas',
      slug_en: 'whale-watching',
      slug_es: 'avistamiento-ballenas',
      description_en: 'Witness majestic humpback whales in Samaná Bay (January-March).',
      description_es: 'Observa majestuosas ballenas jorobadas en la Bahía de Samaná (enero-marzo).',
      category: 'tour',
      duration_minutes: 240,
      base_capacity: 12,
      featured: true,
      status: 'active',
      featured_image: '/images/excursions/whale.jpeg',
      gallery_images: ['/images/excursions/whale.jpeg'],
      inclusions_en: ['Boat tour', 'Marine biologist', 'Drinks', 'Snacks'],
      inclusions_es: ['Tour en bote', 'Biólogo marino', 'Bebidas', 'Meriendas'],
      exclusions_en: ['Lunch', 'Photos'],
      exclusions_es: ['Almuerzo', 'Fotos'],
      requirements_en: ['Camera', 'Sunscreen', 'Light jacket'],
      requirements_es: ['Cámara', 'Protector solar', 'Chaqueta ligera'],
    },
  ];

  const { data: insertedTours, error: toursError } = await supabase
    .from('services')
    .insert(tours)
    .select();

  if (toursError) throw toursError;

  // Add pricing tiers for tours
  const tourPrices = [85, 75, 95, 90, 120];
  const tourPricingTiers = (insertedTours || []).map((tour, i) => ({
    service_id: tour.id,
    min_passengers: 1,
    max_passengers: 10,
    price_per_person: tourPrices[i],
    child_price: Math.round(tourPrices[i] * 0.7), // Child price is 70% of adult
  }));

  const { error: tourPricingError } = await supabase.from('pricing_tiers').insert(tourPricingTiers);
  if (tourPricingError) throw tourPricingError;

  // Create excursions
  console.log('🏖️  Creating excursions...');

  const excursions = [
    {
      title_en: 'Punta Cana Beach Day',
      title_es: 'Día de Playa Punta Cana',
      slug_en: 'punta-cana-beach',
      slug_es: 'playa-punta-cana',
      description_en: 'Relax on pristine beaches with lunch, drinks, and water sports.',
      description_es: 'Relájate en playas prístinas con almuerzo, bebidas y deportes acuáticos.',
      category: 'excursion',
      duration_minutes: 360,
      base_capacity: 30,
      featured: true,
      status: 'active',
      featured_image: '/images/excursions/puntacana-beachday.jpeg',
      gallery_images: ['/images/excursions/puntacana-beachday.jpeg'],
      inclusions_en: ['Beach access', 'Lunch', 'Drinks', 'Water sports'],
      inclusions_es: ['Acceso a playa', 'Almuerzo', 'Bebidas', 'Deportes acuáticos'],
      exclusions_en: ['Motorized sports', 'Gratuities'],
      exclusions_es: ['Deportes motorizados', 'Propinas'],
      requirements_en: ['Swimsuit', 'Towel', 'Sunscreen'],
      requirements_es: ['Traje de baño', 'Toalla', 'Protector solar'],
    },
    {
      title_en: 'Zip-lining Adventure',
      title_es: 'Aventura Tirolesa',
      slug_en: 'zipline-adventure',
      slug_es: 'aventura-tirolesa',
      description_en: 'Soar through the jungle canopy on 8 different zip lines.',
      description_es: 'Vuela por el dosel de la selva en 8 tirolesas diferentes.',
      category: 'excursion',
      duration_minutes: 180,
      base_capacity: 10,
      featured: false,
      status: 'active',
      featured_image: '/images/excursions/scape.png',
      gallery_images: ['/images/excursions/scape.png'],
      inclusions_en: ['Equipment', 'Instructors', 'Training', 'Photos'],
      inclusions_es: ['Equipo', 'Instructores', 'Entrenamiento', 'Fotos'],
      exclusions_en: ['Food', 'Gratuities'],
      exclusions_es: ['Comida', 'Propinas'],
      requirements_en: ['Closed-toe shoes', 'Athletic clothing', 'Min age 8'],
      requirements_es: ['Zapatos cerrados', 'Ropa deportiva', 'Edad mín 8'],
    },
    {
      title_en: 'Snorkeling Paradise',
      title_es: 'Paraíso Snorkel',
      slug_en: 'snorkeling-paradise',
      slug_es: 'paraiso-snorkel',
      description_en: 'Explore vibrant coral reefs with all equipment provided.',
      description_es: 'Explora arrecifes de coral vibrantes con todo el equipo incluido.',
      category: 'excursion',
      duration_minutes: 240,
      base_capacity: 15,
      featured: false,
      status: 'active',
      featured_image: '/images/excursions/snorkeling.jpeg',
      gallery_images: ['/images/excursions/snorkeling.jpeg'],
      inclusions_en: ['Equipment', 'Guide', 'Instruction', 'Snacks'],
      inclusions_es: ['Equipo', 'Guía', 'Instrucción', 'Meriendas'],
      exclusions_en: ['Lunch', 'Photos'],
      exclusions_es: ['Almuerzo', 'Fotos'],
      requirements_en: ['Swimsuit', 'Towel', 'Basic swimming'],
      requirements_es: ['Traje de baño', 'Toalla', 'Natación básica'],
    },
    {
      title_en: 'ATV Jungle Ride',
      title_es: 'Paseo ATV en la Selva',
      slug_en: 'atv-jungle-ride',
      slug_es: 'paseo-atv-selva',
      description_en: 'Navigate rugged terrain and swim in a natural cenote.',
      description_es: 'Navega terreno accidentado y nada en un cenote natural.',
      category: 'excursion',
      duration_minutes: 180,
      base_capacity: 12,
      featured: false,
      status: 'active',
      featured_image: '/images/excursions/atv.avif',
      gallery_images: ['/images/excursions/atv.avif'],
      inclusions_en: ['ATV rental', 'Helmet', 'Guide', 'Safety briefing'],
      inclusions_es: ['Renta ATV', 'Casco', 'Guía', 'Instrucciones seguridad'],
      exclusions_en: ['Lunch', 'Photos'],
      exclusions_es: ['Almuerzo', 'Fotos'],
      requirements_en: ['Valid license', 'Closed shoes', 'Min age 16'],
      requirements_es: ['Licencia válida', 'Zapatos cerrados', 'Edad mín 16'],
    },
    {
      title_en: 'Catamaran Sunset Cruise',
      title_es: 'Crucero Catamarán Atardecer',
      slug_en: 'catamaran-sunset',
      slug_es: 'catamaran-atardecer',
      description_en: 'Sail along the coast at sunset with drinks and snacks.',
      description_es: 'Navega por la costa al atardecer con bebidas y aperitivos.',
      category: 'excursion',
      duration_minutes: 240,
      base_capacity: 20,
      featured: false,
      status: 'active',
      featured_image: '/images/excursions/catamaran.jpeg',
      gallery_images: ['/images/excursions/catamaran.jpeg'],
      inclusions_en: ['Catamaran cruise', 'Drinks', 'Snacks', 'Snorkeling stop'],
      inclusions_es: ['Crucero catamarán', 'Bebidas', 'Aperitivos', 'Parada snorkel'],
      exclusions_en: ['Dinner', 'Photos'],
      exclusions_es: ['Cena', 'Fotos'],
      requirements_en: ['Swimsuit', 'Towel', 'Sunscreen'],
      requirements_es: ['Traje de baño', 'Toalla', 'Protector solar'],
    },
  ];

  const { data: insertedExcursions, error: excursionsError } = await supabase
    .from('services')
    .insert(excursions)
    .select();

  if (excursionsError) throw excursionsError;

  // Add pricing tiers for excursions
  const excursionPrices = [65, 55, 70, 80, 85];
  const excursionPricingTiers = (insertedExcursions || []).map((exc, i) => ({
    service_id: exc.id,
    min_passengers: 1,
    max_passengers: 10,
    price_per_person: excursionPrices[i],
    child_price: Math.round(excursionPrices[i] * 0.7), // Child price is 70% of adult
  }));

  const { error: excPricingError } = await supabase.from('pricing_tiers').insert(excursionPricingTiers);
  if (excPricingError) throw excPricingError;

  // Create transfers
  console.log('🚗 Creating transfers...');

  const transfers = [
    {
      title_en: 'Punta Cana Airport → Bávaro / Punta Cana Zone',
      title_es: 'Aeropuerto Punta Cana → Zona Bávaro / Punta Cana',
      slug_en: 'airport-bavaro-punta-cana',
      slug_es: 'aeropuerto-bavaro-punta-cana',
      description_en: 'Direct transportation from PUJ Airport with professional driver, WiFi, and water.',
      description_es: 'Transporte directo desde el Aeropuerto PUJ con chofer profesional, WiFi y agua.',
      category: 'transfer',
      duration_minutes: 30,
      base_capacity: 6,
      featured: true,
      status: 'active',
      featured_image: '/images/van-timeline.png',
      gallery_images: ['/images/van-timeline.png'],
      inclusions_en: ['Meet & greet', 'Driver', 'WiFi', 'Water'],
      inclusions_es: ['Recepción', 'Chofer', 'WiFi', 'Agua'],
      exclusions_en: ['Gratuities'],
      exclusions_es: ['Propinas'],
      requirements_en: ['Flight info', 'Hotel name'],
      requirements_es: ['Info vuelo', 'Nombre hotel'],
    },
    {
      title_en: 'Punta Cana Airport → Uvero Alto',
      title_es: 'Aeropuerto Punta Cana → Uvero Alto',
      slug_en: 'airport-uvero-alto',
      slug_es: 'aeropuerto-uvero-alto',
      description_en: 'Comfortable ride to Uvero Alto with meet & greet service.',
      description_es: 'Viaje cómodo a Uvero Alto con servicio de recepción.',
      category: 'transfer',
      duration_minutes: 45,
      base_capacity: 6,
      featured: true,
      status: 'active',
      featured_image: '/images/van-timeline.png',
      gallery_images: ['/images/van-timeline.png'],
      inclusions_en: ['Meet & greet', 'Driver', 'WiFi', 'Water'],
      inclusions_es: ['Recepción', 'Chofer', 'WiFi', 'Agua'],
      exclusions_en: ['Gratuities'],
      exclusions_es: ['Propinas'],
      requirements_en: ['Flight info', 'Hotel name'],
      requirements_es: ['Info vuelo', 'Nombre hotel'],
    },
    {
      title_en: 'Punta Cana Airport → Bayahibe / La Romana',
      title_es: 'Aeropuerto Punta Cana → Bayahibe / La Romana',
      slug_en: 'airport-bayahibe-la-romana',
      slug_es: 'aeropuerto-bayahibe-la-romana',
      description_en: 'Safe transfer to Bayahibe and La Romana area.',
      description_es: 'Traslado seguro a la zona de Bayahibe y La Romana.',
      category: 'transfer',
      duration_minutes: 60,
      base_capacity: 6,
      featured: true,
      status: 'active',
      featured_image: '/images/van-timeline.png',
      gallery_images: ['/images/van-timeline.png'],
      inclusions_en: ['Meet & greet', 'Driver', 'WiFi', 'Water'],
      inclusions_es: ['Recepción', 'Chofer', 'WiFi', 'Agua'],
      exclusions_en: ['Gratuities'],
      exclusions_es: ['Propinas'],
      requirements_en: ['Flight info', 'Hotel name'],
      requirements_es: ['Info vuelo', 'Nombre hotel'],
    },
    {
      title_en: 'Punta Cana Airport → Cabeza de Toro / Av. Barceló',
      title_es: 'Aeropuerto Punta Cana → Cabeza de Toro / Av. Barceló',
      slug_en: 'airport-cabeza-de-toro',
      slug_es: 'aeropuerto-cabeza-de-toro',
      description_en: 'Quick and comfortable transfer to the Cabeza de Toro / Avenida Barceló hotel zone. Promo: $18 for 1-4 passengers!',
      description_es: 'Traslado rápido y cómodo a la zona hotelera de Cabeza de Toro / Avenida Barceló. ¡Promo: $18 para 1-4 pasajeros!',
      category: 'transfer',
      duration_minutes: 25,
      base_capacity: 4,
      featured: true,
      status: 'active',
      featured_image: '/images/van-timeline.png',
      gallery_images: ['/images/van-timeline.png'],
      inclusions_en: ['Meet & greet', 'Driver', 'WiFi', 'Water'],
      inclusions_es: ['Recepción', 'Chofer', 'WiFi', 'Agua'],
      exclusions_en: ['Gratuities'],
      exclusions_es: ['Propinas'],
      requirements_en: ['Flight info', 'Hotel name'],
      requirements_es: ['Info vuelo', 'Nombre hotel'],
    },
    {
      title_en: 'Punta Cana Airport → Cap Cana',
      title_es: 'Aeropuerto Punta Cana → Cap Cana',
      slug_en: 'airport-cap-cana',
      slug_es: 'aeropuerto-cap-cana',
      description_en: 'Luxury transfer to the exclusive Cap Cana resort area.',
      description_es: 'Traslado de lujo a la exclusiva zona de Cap Cana.',
      category: 'transfer',
      duration_minutes: 20,
      base_capacity: 6,
      featured: true,
      status: 'active',
      featured_image: '/images/van-timeline.png',
      gallery_images: ['/images/van-timeline.png'],
      inclusions_en: ['Meet & greet', 'Driver', 'WiFi', 'Water'],
      inclusions_es: ['Recepción', 'Chofer', 'WiFi', 'Agua'],
      exclusions_en: ['Gratuities'],
      exclusions_es: ['Propinas'],
      requirements_en: ['Flight info', 'Hotel name'],
      requirements_es: ['Info vuelo', 'Nombre hotel'],
    },
    {
      title_en: 'Punta Cana Airport → Santo Domingo',
      title_es: 'Aeropuerto Punta Cana → Santo Domingo',
      slug_en: 'airport-santo-domingo',
      slug_es: 'aeropuerto-santo-domingo',
      description_en: 'Premium long-distance transfer to the capital.',
      description_es: 'Traslado premium de larga distancia a la capital.',
      category: 'transfer',
      duration_minutes: 150,
      base_capacity: 6,
      featured: true,
      status: 'active',
      featured_image: '/images/van-timeline.png',
      gallery_images: ['/images/van-timeline.png'],
      inclusions_en: ['Meet & greet', 'Driver', 'WiFi', 'Water'],
      inclusions_es: ['Recepción', 'Chofer', 'WiFi', 'Agua'],
      exclusions_en: ['Gratuities'],
      exclusions_es: ['Propinas'],
      requirements_en: ['Flight info', 'Hotel name'],
      requirements_es: ['Info vuelo', 'Nombre hotel'],
    },
  ];

  const { data: insertedTransfers, error: transfersError } = await supabase
    .from('services')
    .insert(transfers)
    .select();

  if (transfersError) throw transfersError;

  // Add pricing tiers for transfers
  const transferPriceMap: Record<string, number> = {
    'airport-bavaro-punta-cana': 33,
    'airport-cabeza-de-toro': 18,
    'airport-cap-cana': 40,
    'airport-uvero-alto': 58,
    'airport-bayahibe-la-romana': 87,
    'airport-santo-domingo': 190,
  };

  const transferPricingTiers = (insertedTransfers || []).map((t) => ({
    service_id: t.id,
    min_passengers: 1,
    max_passengers: 6,
    price_per_person: transferPriceMap[t.slug_en] || 50,
  }));

  const { error: transferPricingError } = await supabase.from('pricing_tiers').insert(transferPricingTiers);
  if (transferPricingError) throw transferPricingError;

  console.log('✅ Database seeded successfully!');
  console.log('📊 Created:');
  console.log('   - 4 admin users');
  console.log('   - 16 services (5 tours, 5 excursions, 6 transfers)');
  console.log('   - Pricing tiers for all services');
}

main().catch((e) => {
  console.error('❌ Error seeding database:', e);
  process.exit(1);
});
