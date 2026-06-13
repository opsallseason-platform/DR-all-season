/**
 * ABOUT US PAGE
 * Company information, mission, values
 */

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-caribbean-teal to-golden-sand py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-8xl font-heading font-bold text-white mb-6">
            About D.R All Season Travel
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Your trusted partner for unforgettable experiences in the Dominican Republic
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Our Story */}
        <div className="max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl font-heading font-bold text-deep-navy mb-6 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none text-slate-gray">
            <p className="mb-4">
              Founded with a deep passion for sharing the real beauty and culture of the Dominican Republic, D.R All Season Travel has been creating unforgettable experiences for travelers from all over the world for more than 12 years.
            </p>
            <p className="mb-4">
Based in Punta Cana, we’re not just another ride, we’re a team of professional drivers who know every road, every shortcut, and every hidden gem of this country like the back of our hand. To us, a transfer isn’t about just getting you from the airport to the hotel; it’s about making you feel the Dominican vibe the second you step off the plane, arriving relaxed, safe, and already wearing a smile that lasts the whole trip.            </p>
            <p>
              We offer everything from private airport transfers to full-day adventures, always with the same goal: let you experience the most authentic side of our island, stress-free and with all the warmth we’ve got to give.
            </p>
            <p className="mb-4"></p>
            <p>And there’s one little thing we always ask our guests (it’s kind of our tradition): when you make it home safe and sound, just shoot us a quick message saying “I’m home.” That tiny note makes our whole team ridiculously happy and lets us know we did our job right.

</p>
<p className="mb-4"></p>
        <p>So whether you’re here for the beaches, the culture, or just to soak up the sun, D.R All Season Travel is here to make sure your trip starts and ends with a big dose of Dominican hospitality.
        </p>
        <p className="mb-4"></p>
        <p>Because for everyone at D.R All Season Travel, nothing matters more than you having the best vacation possible, falling in love with the Dominican Republic 🇩🇴, and heading home already planning your next trip back.</p>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mb-20">
          <h2 className="text-4xl font-heading font-bold text-deep-navy mb-12 text-center">
            Our Mission & Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-heading font-bold text-deep-navy mb-3">
                  Our Mission
                </h3>
                <p className="text-slate-gray">
                  To provide exceptional travel experiences that showcase the authentic beauty, 
                  culture, and warmth of the Dominican Republic while exceeding every guest's expectations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">💚</div>
                <h3 className="text-xl font-heading font-bold text-deep-navy mb-3">
                  Sustainability
                </h3>
                <p className="text-slate-gray">
                  We're committed to responsible tourism that protects our environment and supports 
                  local communities, ensuring the Dominican Republic remains beautiful for generations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-5xl mb-4">⭐</div>
                <h3 className="text-xl font-heading font-bold text-deep-navy mb-3">
                  Excellence
                </h3>
                <p className="text-slate-gray">
                  From professional guides to modern vehicles, we maintain the highest standards in 
                  every aspect of our service to deliver experiences that exceed expectations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-cloud-white rounded-2xl p-12 mb-20">
          <h2 className="text-4xl font-heading font-bold text-deep-navy mb-12 text-center">
            Why Travelers Choose Us
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="text-3xl text-caribbean-teal">✓</div>
              <div>
                <h3 className="font-semibold text-deep-navy mb-2">Local Expertise</h3>
                <p className="text-slate-gray text-sm">
                  Our guides are born and raised in the Dominican Republic, offering authentic insights 
                  and access to hidden gems tourists rarely see.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl text-caribbean-teal">✓</div>
              <div>
                <h3 className="font-semibold text-deep-navy mb-2">Safety First</h3>
                <p className="text-slate-gray text-sm">
                  Fully licensed, insured, and compliant with all safety regulations. Your security 
                  and wellbeing are our top priorities.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl text-caribbean-teal">✓</div>
              <div>
                <h3 className="font-semibold text-deep-navy mb-2">Transparent Pricing</h3>
                <p className="text-slate-gray text-sm">
                  No hidden fees, no surprises. What you see is what you pay—all-inclusive, 
                  straightforward pricing.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl text-caribbean-teal">✓</div>
              <div>
                <h3 className="font-semibold text-deep-navy mb-2">24/7 Support</h3>
                <p className="text-slate-gray text-sm">
                  Our team is available around the clock to assist you before, during, and after 
                  your experience.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl text-caribbean-teal">✓</div>
              <div>
                <h3 className="font-semibold text-deep-navy mb-2">Small Groups</h3>
                <p className="text-slate-gray text-sm">
                  We keep group sizes manageable to ensure personalized attention and a more 
                  intimate experience.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl text-caribbean-teal">✓</div>
              <div>
                <h3 className="font-semibold text-deep-navy mb-2">Flexibility</h3>
                <p className="text-slate-gray text-sm">
                  Free cancellation, easy rescheduling, and customizable itineraries to fit your 
                  travel plans.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          <div className="text-center">
            <div className="text-4xl font-bold text-caribbean-teal mb-2">10+</div>
            <p className="text-slate-gray">Years Experience</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-caribbean-teal mb-2">10,000+</div>
            <p className="text-slate-gray">Happy Travelers</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-caribbean-teal mb-2">15+</div>
            <p className="text-slate-gray">Tours & Excursions</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-caribbean-teal mb-2">4.9</div>
            <p className="text-slate-gray">Average Rating</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-caribbean-teal to-golden-sand rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Ready to Experience the Dominican Republic?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Let us show you the magic of our beautiful island
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button variant="primary" size="lg" className="bg-white text-caribbean-teal hover:bg-white/90">
                Browse Tours
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-caribbean-teal">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}