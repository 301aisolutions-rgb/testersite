import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Listing, Agent } from '../lib/supabase';
import { Bed, Bath, Maximize2, Phone, Mail } from 'lucide-react';

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
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
    async function fetchData() {
      const [featuredRes, allRes, agentsRes] = await Promise.all([
        supabase.from('listings').select('*').eq('featured', true).eq('status', 'active'),
        supabase.from('listings').select('*').eq('status', 'active').order('price', { ascending: false }),
        supabase.from('agents').select('*').order('created_at', { ascending: true })
      ]);

      if (featuredRes.data) setFeaturedListings(featuredRes.data);
      if (allRes.data) setAllListings(allRes.data);
      if (agentsRes.data) setAgents(agentsRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);

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
      message: formData.message
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
          message: ''
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

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="https://videos.pexels.com/video-files/18700635/18700635-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8">
          <div className="text-2xl font-light tracking-[0.3em] uppercase">
            Seattle Luxury Group
          </div>
          <nav className="hidden gap-8 text-sm uppercase tracking-[0.2em] md:flex">
            <a href="#featured" className="hover:text-white/80 transition-colors">Featured</a>
            <a href="#listings" className="hover:text-white/80 transition-colors">Listings</a>
            <a href="#team" className="hover:text-white/80 transition-colors">Team</a>
            <a href="#contact" className="hover:text-white/80 transition-colors">Contact</a>
          </nav>
        </header>

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-6 pb-20">
          <div className="max-w-4xl">
            <p className="mb-6 text-sm uppercase tracking-[0.35em] text-white/80">
              Exclusive Properties • Seattle, Washington
            </p>

            <h1 className="mb-8 text-5xl font-light leading-tight md:text-7xl lg:text-8xl">
              Luxury<br />
              <span className="font-normal">Redefined</span>
            </h1>

            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
              Representing Seattle's most distinguished properties and discerning clients
              with unparalleled expertise and service.
            </p>

            <a
              href="#featured"
              className="inline-flex items-center justify-center rounded-none border border-white bg-white/10 px-8 py-4 text-sm uppercase tracking-[0.2em] backdrop-blur-sm transition-all hover:bg-white hover:text-black"
            >
              View Collection
            </a>
          </div>
        </div>
      </section>

      <section id="featured" className="border-t border-white/10 bg-black py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Featured Properties</p>
            <h2 className="text-4xl font-light md:text-5xl">Exceptional Estates</h2>
          </div>

          {loading ? (
            <div className="text-center text-white/60">Loading properties...</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className="group overflow-hidden border border-white/10 bg-white/5 transition-all hover:border-white/30"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/80">{listing.city}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 text-2xl font-light">{listing.title}</h3>
                    <p className="mb-4 text-sm text-white/60">{listing.address}</p>

                    <div className="mb-4 flex gap-6 text-sm text-white/70">
                      <span className="flex items-center gap-1.5">
                        <Bed className="h-4 w-4" />
                        {listing.bedrooms}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Bath className="h-4 w-4" />
                        {listing.bathrooms}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Maximize2 className="h-4 w-4" />
                        {listing.sqft.toLocaleString()} sqft
                      </span>
                    </div>

                    <p className="text-2xl font-light">{formatPrice(listing.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="listings" className="border-t border-white/10 bg-zinc-950 py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Complete Portfolio</p>
            <h2 className="text-4xl font-light md:text-5xl">All Properties</h2>
          </div>

          {loading ? (
            <div className="text-center text-white/60">Loading properties...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/listing/${listing.id}`}
                  className="group overflow-hidden border border-white/10 bg-black/50 transition-all hover:border-white/30"
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={listing.image_url}
                      alt={listing.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="mb-1 text-xl font-light">{listing.title}</h3>
                    <p className="mb-3 text-xs text-white/50">{listing.address}</p>

                    <div className="mb-3 flex gap-4 text-xs text-white/60">
                      <span>{listing.bedrooms} bd</span>
                      <span>{listing.bathrooms} ba</span>
                      <span>{listing.sqft.toLocaleString()} sqft</span>
                    </div>

                    <p className="text-xl font-light">{formatPrice(listing.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="team" className="border-t border-white/10 bg-black py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mb-12">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Our Experts</p>
            <h2 className="mb-4 text-4xl font-light md:text-5xl">Meet The Team</h2>
            <p className="max-w-2xl text-white/70">
              Award-winning brokers specializing in Seattle's luxury market with decades of combined experience.
            </p>
          </div>

          {loading ? (
            <div className="text-center text-white/60">Loading team...</div>
          ) : (
            <div className="grid gap-8 md:grid-cols-3">
              {agents.map((agent) => (
                <div key={agent.id} className="group">
                  <div className="relative mb-4 aspect-[3/4] overflow-hidden border border-white/10">
                    {agent.image_url ? (
                      <img
                        src={agent.image_url}
                        alt={agent.name}
                        className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-white/5">
                        <span className="text-4xl text-white/20">{agent.name[0]}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="mb-1 text-xl font-light">{agent.name}</h3>
                  <p className="mb-4 text-sm text-white/60">{agent.title}</p>

                  <div className="space-y-2 text-sm text-white/70">
                    {agent.phone && (
                      <a href={`tel:${agent.phone}`} className="flex items-center gap-2 hover:text-white">
                        <Phone className="h-4 w-4" />
                        {agent.phone}
                      </a>
                    )}
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-2 hover:text-white">
                      <Mail className="h-4 w-4" />
                      {agent.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 bg-zinc-950 py-20">
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-12 text-center">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/60">Get In Touch</p>
              <h2 className="mb-4 text-4xl font-light md:text-5xl">Schedule A Private Viewing</h2>
              <p className="text-white/70">
                Experience these exceptional properties in person. Our team is available for private showings.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
                />
              </div>

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
                <div className="rounded bg-green-500/10 border border-green-500/30 px-4 py-3 text-green-400">
                  Thank you! Your inquiry has been submitted successfully.
                </div>
              )}

              {formStatus === 'error' && (
                <div className="rounded bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400">
                  There was an error submitting your inquiry. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={formStatus === 'submitting'}
                className="w-full border border-white bg-white/10 px-8 py-4 text-sm uppercase tracking-[0.2em] backdrop-blur-sm transition-all hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black py-10">
        <div className="mx-auto w-full max-w-7xl px-6 text-center">
          <p className="text-sm text-white/50">
            © 2019 Seattle Luxury Group. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
