import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PromotionalEmails() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-deep-navy">Send Promotional Email</h2>
        <Button variant="primary">
          <Link href="/admin/emails/promotions/templates">Manage Templates</Link>
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-gray mb-1">
              Recipients
            </label>
            <select className="w-full border rounded-lg px-3 py-2">
              <option>All Customers</option>
              <option>Customers with bookings in last 30 days</option>
              <option>Customers without recent bookings</option>
              <option>Specific customer segment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-gray mb-1">
              Subject
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter email subject"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-gray mb-1">
              Content
            </label>
            <textarea
              rows={8}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter email content (HTML supported)"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" type="button">
              Save as Draft
            </Button>
            <Button variant="primary" type="submit">
              Send Email
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-deep-navy mb-4">Recent Promotional Campaigns</h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-deep-navy">New Year Special Offer</h4>
                <p className="text-sm text-slate-gray mt-1">Sent to 150 customers</p>
                <div className="flex space-x-4 mt-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Sent</span>
                  <span className="text-xs">25% open rate</span>
                  <span className="text-xs">5% click rate</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Link href="/admin/emails/promotions/1/edit">Edit</Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Link href="/admin/emails/promotions/1/analytics">Analytics</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-deep-navy">Summer Beach Deals</h4>
                <p className="text-sm text-slate-gray mt-1">Sent to 200 customers</p>
                <div className="flex space-x-4 mt-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Sent</span>
                  <span className="text-xs">30% open rate</span>
                  <span className="text-xs">8% click rate</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Link href="/admin/emails/promotions/2/edit">Edit</Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Link href="/admin/emails/promotions/2/analytics">Analytics</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}