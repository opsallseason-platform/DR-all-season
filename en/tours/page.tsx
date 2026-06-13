import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TourHeroClean } from '@/components/tours/TourHero';
import { ToursClient } from '@/components/tours/ToursClient';
import { getToursAndExcursions } from '@/lib/data/services';


export default async function ToursPage() {
  const services = await getToursAndExcursions();

  return (
    <div>
      <Header />
      <TourHeroClean />
      <ToursClient initialServices={services} />
      <Footer />
    </div>
  );
}