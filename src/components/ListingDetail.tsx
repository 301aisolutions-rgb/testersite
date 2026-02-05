import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Listing } from '../lib/supabase';
import { Bed, Bath, Maximize2, ArrowLeft, Phone, Mail, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function fetchListing() {
      if (!id) return;

      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (data) {
        setListing(data);
        setFormData(prev => ({
          ...prev,
          message: `I'm interested in the property at ${data.address}`
        }));
      }
      setLoading(false);
    }

    fetchListing();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      property_id: listing?.id,
      property_address: listing?.address
    };

    try {
      const [response1, response2] = await Promise.all([
        fetch('https://l301aisolutions.app.n8n.cloud/webhook-test/Newstyle email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }),
        fetch('https://l301aisolutions.app.n8n.cloud/form-test/25f511f1-7f2c-455e-a2d0-21568427d04d', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
      ]);

      if (response1.ok && response2.ok) {
        setFormStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: listing ? `I'm interested in the property at ${listing.address}` : ''
        });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      }
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => setFormStatus('idle'), 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">Loading property details...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="mb-4 text-2xl">Property not found</h2>
          <Link to="/" className="text-white/60 hover:text-white">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-b border-white/10 px-6 py-8">
        <Link to="/" className="text-2xl font-light tracking-[0.3em] uppercase">
          Seattle Luxury Group
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </header>

      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/60">{listing.city}</p>
          <h1 className="mb-4 text-4xl font-light md:text-5xl lg:text-6xl">{listing.title}</h1>
          <p className="mb-6 text-lg text-white/70">{listing.address}</p>
          <p className="text-3xl font-light md:text-4xl">{formatPrice(listing.price)}</p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-8 relative group">
              <img
                src={listing.image_url}
                alt={listing.title}
                className="w-full border border-white/10"
              />
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/20 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm border border-white/20 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-8 flex gap-8 border-b border-white/10 pb-8">
              <div className="flex items-center gap-2 text-lg">
                <Bed className="h-5 w-5 text-white/60" />
                <span className="font-light">{listing.bedrooms}</span>
                <span className="text-sm text-white/50">Bedrooms</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <Bath className="h-5 w-5 text-white/60" />
                <span className="font-light">{listing.bathrooms}</span>
                <span className="text-sm text-white/50">Bathrooms</span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <Maximize2 className="h-5 w-5 text-white/60" />
                <span className="font-light">{listing.sqft.toLocaleString()}</span>
                <span className="text-sm text-white/50">Sqft</span>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="mb-4 text-2xl font-light">Property Description</h2>
              <p className="leading-relaxed text-white/70">
                {listing.description || `Experience unparalleled luxury in this exceptional ${listing.bedrooms}-bedroom, ${listing.bathrooms}-bathroom residence
                spanning ${listing.sqft.toLocaleString()} square feet. Located in the prestigious ${listing.city} area, this property
                represents the pinnacle of sophisticated living with its thoughtful design, premium finishes, and prime location.`}
              </p>
            </div>

            <div className="mb-12 border-t border-white/10 pt-12">
              <h2 className="mb-6 text-2xl font-light">Property Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {listing.mls_number && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">MLS Number</span>
                    <span className="text-sm text-white/90">{listing.mls_number}</span>
                  </div>
                )}
                {listing.property_type && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Property Type</span>
                    <span className="text-sm text-white/90">{listing.property_type}</span>
                  </div>
                )}
                {listing.year_built && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Year Built</span>
                    <span className="text-sm text-white/90">{listing.year_built}</span>
                  </div>
                )}
                {listing.days_on_market !== undefined && listing.days_on_market !== null && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Days on Market</span>
                    <span className="text-sm text-white/90">{listing.days_on_market} days</span>
                  </div>
                )}
                {listing.lot_size && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Lot Size</span>
                    <span className="text-sm text-white/90">{listing.lot_size.toLocaleString()} sqft</span>
                  </div>
                )}
                {listing.floors && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Floors</span>
                    <span className="text-sm text-white/90">{listing.floors}</span>
                  </div>
                )}
                {listing.parking_spaces && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Parking Spaces</span>
                    <span className="text-sm text-white/90">{listing.parking_spaces}</span>
                  </div>
                )}
                {listing.garage_type && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Garage Type</span>
                    <span className="text-sm text-white/90">{listing.garage_type}</span>
                  </div>
                )}
                {listing.heating_type && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Heating</span>
                    <span className="text-sm text-white/90">{listing.heating_type}</span>
                  </div>
                )}
                {listing.cooling_type && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Cooling</span>
                    <span className="text-sm text-white/90">{listing.cooling_type}</span>
                  </div>
                )}
                {listing.hoa_fees !== undefined && listing.hoa_fees !== null && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">HOA Fees</span>
                    <span className="text-sm text-white/90">{formatPrice(listing.hoa_fees)}/month</span>
                  </div>
                )}
                {listing.annual_taxes && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Annual Taxes</span>
                    <span className="text-sm text-white/90">{formatPrice(listing.annual_taxes)} ({listing.tax_year || 'N/A'})</span>
                  </div>
                )}
                {listing.zoning && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Zoning</span>
                    <span className="text-sm text-white/90">{listing.zoning}</span>
                  </div>
                )}
                {listing.view_description && (
                  <div className="flex justify-between border-b border-white/10 pb-3 sm:col-span-2">
                    <span className="text-sm text-white/50">Views</span>
                    <span className="text-sm text-white/90">{listing.view_description}</span>
                  </div>
                )}
                {listing.listing_date && (
                  <div className="flex justify-between border-b border-white/10 pb-3">
                    <span className="text-sm text-white/50">Listed Date</span>
                    <span className="text-sm text-white/90">{new Date(listing.listing_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 border border-white/10 bg-white/5 p-8">
              <h2 className="mb-6 text-2xl font-light">Schedule A Viewing</h2>
              <p className="mb-6 text-sm text-white/60">
                Contact us to arrange a private tour of this exceptional property.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
                />
                <textarea
                  name="message"
                  placeholder="Message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
                />

                {formStatus === 'success' && (
                  <div className="rounded bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-400">
                    Thank you! We'll contact you shortly.
                  </div>
                )}

                {formStatus === 'error' && (
                  <div className="rounded bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                    Error submitting form. Please try again.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full border border-white bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.2em] backdrop-blur-sm transition-all hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formStatus === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </form>

              <div className="mt-8 border-t border-white/10 pt-8">
                <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/50">
                  Questions? Contact Us
                </p>
                <div className="space-y-3 text-sm text-white/70">
                  <a href="tel:+12065551234" className="flex items-center gap-2 hover:text-white">
                    <Phone className="h-4 w-4" />
                    (206) 555-1234
                  </a>
                  <a href="mailto:info@seattleluxurygroup.com" className="flex items-center gap-2 hover:text-white">
                    <Mail className="h-4 w-4" />
                    info@seattleluxurygroup.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/10 bg-black py-10 mt-20">
        <div className="mx-auto w-full max-w-7xl px-6 text-center">
          <p className="text-sm text-white/50">
            © 2019 Seattle Luxury Group. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
