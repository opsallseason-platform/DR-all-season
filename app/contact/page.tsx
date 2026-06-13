/**
 * CONTACT PAGE
 * Contact form and company information
 */
'use client';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { ContactForm } from '@/components/contact/ContactForm';


export default function ContactPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-caribbean-teal to-golden-sand py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions? We're here to help you plan the perfect Dominican adventure
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-heading font-bold text-deep-navy mb-6">
              Send Us a Message
            </h2>
            <p className="text-slate-gray mb-8">
              Fill out the form below and we'll get back to you within 24 hours. For urgent 
              inquiries, please call us directly.
            </p>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-heading font-bold text-deep-navy mb-6">
                Contact Information
              </h2>
            </div>

            {/* Phone */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📞</div>
                  <div>
                    <h3 className="font-semibold text-deep-navy mb-2">Phone</h3>
                    <p className="text-slate-gray mb-1">+1 (888) 599-8728</p>
                    <p className="text-sm text-slate-gray">Available 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">✉️</div>
                  <div>
                    <h3 className="font-semibold text-deep-navy mb-2">Email</h3>
                    <p className="text-slate-gray mb-1">info@drallseasontravel.com</p>
                    <p className="text-sm text-slate-gray">We reply within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📍</div>
                  <div>
                    <h3 className="font-semibold text-deep-navy mb-2">Location</h3>
                    <p className="text-slate-gray mb-1">Punta Cana</p>
                    <p className="text-slate-gray">Dominican Republic</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">⏰</div>
                  <div>
                    <h3 className="font-semibold text-deep-navy mb-2">Business Hours</h3>
                    <p className="text-slate-gray text-sm mb-1">Monday - Friday: 8:00 AM - 8:00 PM</p>
                    <p className="text-slate-gray text-sm mb-1">Saturday: 9:00 AM - 6:00 PM</p>
                    <p className="text-slate-gray text-sm">Sunday: 10:00 AM - 4:00 PM</p>
                    <p className="text-sm text-caribbean-teal mt-2">Emergency support: 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp */}
            <Card className="bg-caribbean-teal/10 border-caribbean-teal/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💬</div>
                  <div>
                    <h3 className="font-semibold text-deep-navy mb-2">WhatsApp</h3>
                    <a href="https://wa.me/18096973315" className="text-slate-gray hover:text-caribbean-teal transition-colors block mb-2">
                      +1 (809) 697-3315
                    </a>
                    <p className="text-sm text-slate-gray">
                      Quick responses, perfect for on-the-go inquiries
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Maps Section */}
        <section className="mt-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-deep-navy text-center mb-10">
            Our Locations
          </h2>

          {/* Grid: 1 column on mobile, 2 columns on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Location 1 - Bávaro / Main Office */}
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-deep-navy mb-3 text-center md:text-left">
                Bávaro - Main Office
              </h3>
              <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d483907.8191076416!2d-69.06337234385873!3d18.64020543018859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa1a1fb47a7b67835%3A0x89fca451a8caa0e8!2sRd%20all%20season%20travel!5e0!3m2!1sen!2smx!4v1765342540929!5m2!1sen!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RD All Season Travel - Bávaro"
                  className="absolute inset-0"
                />
              </div>
              <p className="text-center text-slate-gray mt-3 text-sm">
                Punta Cana / Bávaro Area
              </p>
            </div>

            {/* Location 2 - Closer to Airport / Punta Cana Bay */}
            <div className="flex flex-col">
              <h3 className="text-xl font-semibold text-deep-navy mb-3 text-center md:text-left">
                Punta Cana - Near Airport
              </h3>
              <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.3694059507084!2d-68.43785842506045!3d18.602447282507093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea8952f7395e80f%3A0x1ca298dda33674b6!2sRD%20ALL%20SEASON%20TRAVEL!5e0!3m2!1sen!2smx!4v1765342646181!5m2!1sen!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RD All Season Travel - Punta Cana Airport Area"
                  className="absolute inset-0"
                />
              </div>
              <p className="text-center text-slate-gray mt-3 text-sm">
                Downtown Punta Cana (close to PUJ Airport)
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}