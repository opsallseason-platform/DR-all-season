import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ConfirmationEmails() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-deep-navy">Confirmation Email Templates</h2>
        <Button variant="primary">
          <Link href="/admin/emails/confirmations/create">Create Template</Link>
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-deep-navy mb-4">Active Templates</h3>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-deep-navy">Booking Confirmation</h4>
                <p className="text-sm text-slate-gray mt-1">Sent immediately after successful booking</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Link href="/admin/emails/confirmations/1/edit">Edit</Link>
                </Button>
                <Button variant="primary" size="sm">
                  <Link href="/admin/emails/confirmations/1/test">Test</Link>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-deep-navy">Booking Reminder</h4>
                <p className="text-sm text-slate-gray mt-1">Sent 24 hours before booking date</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Link href="/admin/emails/confirmations/2/edit">Edit</Link>
                </Button>
                <Button variant="primary" size="sm">
                  <Link href="/admin/emails/confirmations/2/test">Test</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-deep-navy mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span>Booking #12345 confirmed</span>
            <span className="text-sm text-slate-gray">2023-01-15 10:30 AM</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Booking #12346 confirmed</span>
            <span className="text-sm text-slate-gray">2023-01-15 09:15 AM</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Booking #12344 confirmed</span>
            <span className="text-sm text-slate-gray">2023-01-14 04:20 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}