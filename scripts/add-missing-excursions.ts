/**
 * ADD MISSING EXCURSIONS SCRIPT
 * 
 * This script adds the 8 missing excursions to your database:
 * 1. Altos de Chavón
 * 2. Dolphin Island Park
 * 3. Isla Catalina Adventure
 * 4. Monkey Land
 * 5. Party Boat Experience
 * 6. Safari Truck Adventure
 * 7. Scuba Doo Underwater Adventure
 * 8. Toku Ranch Horseback Riding
 * 
 * Run with: npx tsx scripts/add-missing-excursions.ts
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const missingExcursions = [
  {
    title_en: 'Altos de Chavón',
    title_es: 'Altos de Chavón',
    slug_en: 'altos-de-chavon',
    slug_es: 'altos-de-chavon',
    description_en: 'Visit this recreated 16th-century Mediterranean village with artisan workshops, an amphitheater, and stunning views of the Chavón River.',
    description_es: 'Visita esta aldea mediterránea recreada del siglo XVI con talleres artesanales, un anfiteatro y vistas impresionantes del río Chavón.',
    category: 'excursion',
    duration_minutes: 240,
    base_capacity: 20,
    featured: false,
    status: 'active',
    featured_image: '/images/excursions/altos_chavon.png',
    gallery_images: ['/images/excursions/altos_chavon.png'],
    inclusions_en: ['Transportation', 'Guide', 'Entrance fees', 'Free time for shopping'],
    inclusions_es: ['Transporte', 'Guía', 'Entradas', 'Tiempo libre para compras'],
    exclusions_en: ['Lunch', 'Gratuities', 'Personal expenses'],
    exclusions_es: ['Almuerzo', 'Propinas', 'Gastos personales'],
    requirements_en: ['Comfortable shoes', 'Camera', 'Sunscreen'],
    requirements_es: ['Zapatos cómodos', 'Cámara', 'Protector solar'],
  },
  {
    title_en: 'Dolphin Island Park',
    title_es: 'Parque Isla Delfines',
    slug_en: 'dolphin-island-park',
    slug_es: 'parque-isla-delfines',
    description_en: 'Swim with dolphins in their natural habitat. Includes sea lion encounter, manatee viewing, and beach access.',
    description_es: 'Nada con delfines en su hábitat natural. Incluye encuentro con leones marinos, vista de manatíes y acceso a playa.',
    category: 'excursion',
    duration_minutes: 300,
    base_capacity: 15,
    featured: true,
    status: 'active',
    featured_image: '/images/excursions/dolphins.png',
    gallery_images: ['/images/excursions/dolphins.png'],
    inclusions_en: ['Transportation', 'Dolphin swim', 'Sea lion encounter', 'Lunch', 'Drinks', 'Beach access'],
    inclusions_es: ['Transporte', 'Nado con delfines', 'Encuentro con leones marinos', 'Almuerzo', 'Bebidas', 'Acceso a playa'],
    exclusions_en: ['Photos', 'Videos', 'Gratuities'],
    exclusions_es: ['Fotos', 'Videos', 'Propinas'],
    requirements_en: ['Swimsuit', 'Towel', 'Basic swimming skills'],
    requirements_es: ['Traje de baño', 'Toalla', 'Habilidades básicas de natación'],
  },
  {
    title_en: 'Isla Catalina Adventure',
    title_es: 'Aventura Isla Catalina',
    slug_en: 'isla-catalina-adventure',
    slug_es: 'aventura-isla-catalina',
    description_en: 'Full-day catamaran trip to pristine Isla Catalina. Includes snorkeling, beach time, and buffet lunch.',
    description_es: 'Excursión de día completo en catamarán a la prístina Isla Catalina. Incluye snorkel, tiempo en playa y almuerzo buffet.',
    category: 'excursion',
    duration_minutes: 480,
    base_capacity: 25,
    featured: true,
    status: 'active',
    featured_image: '/images/excursions/isla_catalina.png',
    gallery_images: ['/images/excursions/isla_catalina.png'],
    inclusions_en: ['Catamaran transfer', 'Snorkeling equipment', 'Buffet lunch', 'Open bar', 'Beach access'],
    inclusions_es: ['Traslado en catamarán', 'Equipo de snorkel', 'Almuerzo buffet', 'Barra libre', 'Acceso a playa'],
    exclusions_en: ['Photos', 'Water sports', 'Gratuities'],
    exclusions_es: ['Fotos', 'Deportes acuáticos', 'Propinas'],
    requirements_en: ['Swimsuit', 'Towel', 'Sunscreen'],
    requirements_es: ['Traje de baño', 'Toalla', 'Protector solar'],
  },
  {
    title_en: 'Monkey Land',
    title_es: 'Monkey Land',
    slug_en: 'monkey-land',
    slug_es: 'monkey-land',
    description_en: 'Interact with friendly spider monkeys in their natural habitat. Includes jungle walk and traditional Dominican snacks.',
    description_es: 'Interactúa con amigables monos araña en su hábitat natural. Incluye caminata por la selva y meriendas tradicionales dominicanas.',
    category: 'excursion',
    duration_minutes: 180,
    base_capacity: 20,
    featured: false,
    status: 'active',
    featured_image: '/images/excursions/monkey_land.png',
    gallery_images: ['/images/excursions/monkey_land.png'],
    inclusions_en: ['Transportation', 'Monkey interaction', 'Guide', 'Snacks', 'Drinks'],
    inclusions_es: ['Transporte', 'Interacción con monos', 'Guía', 'Meriendas', 'Bebidas'],
    exclusions_en: ['Lunch', 'Photos', 'Gratuities'],
    exclusions_es: ['Almuerzo', 'Fotos', 'Propinas'],
    requirements_en: ['Comfortable clothing', 'Closed-toe shoes'],
    requirements_es: ['Ropa cómoda', 'Zapatos cerrados'],
  },
  {
    title_en: 'Party Boat Experience',
    title_es: 'Experiencia Fiesta en Barco',
    slug_en: 'party-boat-experience',
    slug_es: 'experiencia-fiesta-barco',
    description_en: 'Dance, drink, and snorkel on the ultimate party boat cruise. Features DJ, open bar, and tropical music.',
    description_es: 'Baila, bebe y haz snorkel en el crucero de fiesta definitivo. Incluye DJ, barra libre y música tropical.',
    category: 'excursion',
    duration_minutes: 240,
    base_capacity: 30,
    featured: true,
    status: 'active',
    featured_image: '/images/excursions/party_boat.png',
    gallery_images: ['/images/excursions/party_boat.png'],
    inclusions_en: ['Party boat cruise', 'Open bar', 'DJ', 'Snorkeling stop', 'Snacks'],
    inclusions_es: ['Crucero fiesta', 'Barra libre', 'DJ', 'Parada snorkel', 'Aperitivos'],
    exclusions_en: ['Lunch', 'Photos', 'Gratuities'],
    exclusions_es: ['Almuerzo', 'Fotos', 'Propinas'],
    requirements_en: ['Swimsuit', 'Towel', 'Must be 18+ for alcohol'],
    requirements_es: ['Traje de baño', 'Toalla', 'Debe ser mayor de 18 años para alcohol'],
  },
  {
    title_en: 'Safari Truck Adventure',
    title_es: 'Aventura Camión Safari',
    slug_en: 'safari-truck-adventure',
    slug_es: 'aventura-camion-safari',
    description_en: 'Ride through the countryside in an open-air safari truck. Visit local families, coffee/cacao plantations, and swim in a natural river.',
    description_es: 'Recorre el campo en un camión safari al aire libre. Visita familias locales, plantaciones de café/cacao y nada en un río natural.',
    category: 'excursion',
    duration_minutes: 300,
    base_capacity: 20,
    featured: false,
    status: 'active',
    featured_image: '/images/excursions/safari_truck.png',
    gallery_images: ['/images/excursions/safari_truck.png'],
    inclusions_en: ['Safari truck ride', 'Guide', 'Local family visit', 'Lunch', 'Drinks', 'River swim'],
    inclusions_es: ['Paseo en camión safari', 'Guía', 'Visita familia local', 'Almuerzo', 'Bebidas', 'Nado en río'],
    exclusions_en: ['Gratuities', 'Personal expenses'],
    exclusions_es: ['Propinas', 'Gastos personales'],
    requirements_en: ['Comfortable clothing', 'Swimsuit', 'Towel', 'Sunscreen'],
    requirements_es: ['Ropa cómoda', 'Traje de baño', 'Toalla', 'Protector solar'],
  },
  {
    title_en: 'Scuba Doo Underwater Adventure',
    title_es: 'Aventura Submarina Scuba Doo',
    slug_en: 'scuba-doo-underwater',
    slug_es: 'aventura-submarina-scuba-doo',
    description_en: 'Explore underwater sculptures and coral reefs on this unique semi-submarine tour. No diving certification required.',
    description_es: 'Explora esculturas submarinas y arrecifes de coral en este tour único en semi-submarino. No se requiere certificación de buceo.',
    category: 'excursion',
    duration_minutes: 240,
    base_capacity: 10,
    featured: true,
    status: 'active',
    featured_image: '/images/excursions/scuba_doo.png',
    gallery_images: ['/images/excursions/scuba_doo.png'],
    inclusions_en: ['Scuba Doo ride', 'Equipment', 'Instructor', 'Photos', 'Drinks'],
    inclusions_es: ['Paseo Scuba Doo', 'Equipo', 'Instructor', 'Fotos', 'Bebidas'],
    exclusions_en: ['Gratuities', 'Personal expenses'],
    exclusions_es: ['Propinas', 'Gastos personales'],
    requirements_en: ['Swimsuit', 'Basic swimming skills'],
    requirements_es: ['Traje de baño', 'Habilidades básicas de natación'],
  },
  {
    title_en: 'Toku Ranch Horseback Riding',
    title_es: 'Paseo a Caballo Toku Ranch',
    slug_en: 'toku-ranch-horseback',
    slug_es: 'paseo-caballo-toku-ranch',
    description_en: 'Horseback ride through tropical trails, Macao Beach, and cenotes. Includes helmets and experienced guides.',
    description_es: 'Paseo a caballo por senderos tropicales, Playa Macao y cenotes. Incluye cascos y guías experimentados.',
    category: 'excursion',
    duration_minutes: 180,
    base_capacity: 15,
    featured: false,
    status: 'active',
    featured_image: '/images/excursions/toku_ranch.png',
    gallery_images: ['/images/excursions/toku_ranch.png'],
    inclusions_en: ['Horseback riding', 'Helmet', 'Guide', 'Beach stop', 'Cenote swim', 'Water'],
    inclusions_es: ['Paseo a caballo', 'Casco', 'Guía', 'Parada en playa', 'Nado en cenote', 'Agua'],
    exclusions_en: ['Lunch', 'Photos', 'Gratuities'],
    exclusions_es: ['Almuerzo', 'Fotos', 'Propinas'],
    requirements_en: ['Comfortable clothing', 'Closed-toe shoes'],
    requirements_es: ['Ropa cómoda', 'Zapatos cerrados'],
  },
];

// Pricing for each excursion
const excursionPrices = [75, 110, 95, 65, 89, 70, 95, 75];

async function main() {
  console.log('🌴 Adding 8 missing excursions to database...\n');

  // Insert excursions
  const { data: insertedExcursions, error: insertError } = await supabase
    .from('services')
    .insert(missingExcursions)
    .select();

  if (insertError) {
    console.error('❌ Error inserting excursions:', insertError);
    process.exit(1);
  }

  console.log(`✅ Successfully inserted ${insertedExcursions?.length || 0} excursions\n`);

  // Create pricing tiers
  const pricingTiers = (insertedExcursions || []).map((exc, i) => ({
    service_id: exc.id,
    min_passengers: 1,
    max_passengers: 10,
    price_per_person: excursionPrices[i],
    child_price: Math.round(excursionPrices[i] * 0.7), // Child price is 70% of adult
  }));

  const { error: pricingError } = await supabase
    .from('pricing_tiers')
    .insert(pricingTiers);

  if (pricingError) {
    console.error('❌ Error creating pricing tiers:', pricingError);
    process.exit(1);
  }

  console.log('✅ Successfully created pricing tiers\n');
  console.log('📊 Added excursions:');
  insertedExcursions?.forEach((exc, i) => {
    console.log(`   ${i + 1}. ${exc.title_en} - $${excursionPrices[i]}`);
  });

  console.log('\n✨ All done! Visit http://localhost:3000/en/tours to see the new excursions.');
}

main().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
