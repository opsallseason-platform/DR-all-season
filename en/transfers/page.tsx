import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TransferCard } from '@/components/transfers/TransferCard';
import { getTransfers } from '@/lib/data/services';

export default async function TransfersPage() {
  const transfers = await getTransfers();

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-caribbean-teal/5 to-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-deep-navy mb-4">Airport Transfers</h1>
            <p className="text-xl text-slate-gray max-w-2xl mx-auto">
              Reliable and comfortable transportation to and from Punta Cana Airport
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {transfers.map((transfer) => (
              <TransferCard key={transfer.id} service={transfer} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}