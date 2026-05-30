import {useState, useRef, useEffect} from 'react';
import {Link, useLoaderData} from 'react-router';
import {CartForm} from '@shopify/hydrogen';
import {EyeReviewsSection} from '~/components/EyeReviews';
import {useAside} from '~/components/Aside';

export const meta = () => [
  {title: 'The Lumive Under-Eye Therapy — LumiVe'},
  {name: 'description', content: 'Advanced LED therapy for dark circles, puffiness and fine lines. Clinically developed for the most delicate area of the face.'},
];

export async function loader({context}) {
  const {storefront} = context;
  const {products} = await storefront.query(PRODUCT_QUERY);
  const variantId = products?.nodes?.[0]?.variants?.nodes?.[0]?.id ?? null;
  return {variantId};
}

const PRODUCT_QUERY = `#graphql
  query UnderEyeProduct {
    products(first: 1, query: "title:*Under-Eye*") {
      nodes { variants(first: 1) { nodes { id } } }
    }
  }
`;

const galleryImages = [
  {id: '1', url: '/images/eye-therapy-1.png', alt: 'Lumive Under-Eye Therapy — front view'},
  {id: '2', url: '/images/eye-therapy-2.png', alt: 'Lumive Under-Eye Therapy — side angle'},
  {id: '3', url: '/images/eye-therapy-3.png', alt: 'Lumive Under-Eye Therapy — LED interior'},
  {id: '4', url: '/images/eye-therapy-4.png', alt: 'Lumive Under-Eye Therapy — lifestyle'},
  {id: '5', url: '/images/eye-therapy-5.png', alt: 'Lumive Under-Eye Therapy — detail close-up'},
];

function StarRating({rating}) {
  return (
    <span className="lm-stars">
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= Math.floor(rating)) return <span key={i} className="lm-star lm-star--full">★</span>;
        if (i - 0.5 <= rating) return <span key={i} className="lm-star lm-star--half">★</span>;
        return <span key={i} className="lm-star lm-star--empty">★</span>;
      })}
    </span>
  );
}

export default function UnderEyeTherapy() {
  const {variantId} = useLoaderData();
  const {open} = useAside();
  const [activeThumb, setActiveThumb] = useState(0);
  const [fading, setFading] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const atcRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!atcRef.current) return;
      setStickyVisible(atcRef.current.getBoundingClientRect().bottom < 0);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="lm-page">

      {/* Breadcrumb */}
      <div className="lm-breadcrumb-bar">
        <nav className="lm-breadcrumb">
          <Link to="/">Home</Link>
          <span className="lm-bc-sep">▶</span>
          <Link to="/products">All Products</Link>
          <span className="lm-bc-sep">▶</span>
          <span>Under-Eye Therapy</span>
        </nav>
      </div>

      {/* ── Product — exact same layout as mask page ── */}
      <div className="w-full bg-[#f8f3ec] md:grid md:grid-cols-[1.05fr_1fr] md:gap-16 md:px-16 md:pt-6 md:pb-16">

        {/* IMAGE COLUMN */}
        <section className="w-full px-3 pt-4 md:px-0 md:pt-0">
          <div className="lm-hero-img-wrap">
            <img
              src={galleryImages[activeThumb].url}
              alt={galleryImages[activeThumb].alt}
              className={`lm-hero-img${fading ? ' lm-hero-img--fading' : ''}`}
            />
          </div>
          <div className="lm-thumbs-row" style={{marginTop: '14px'}}>
            {galleryImages.map((img, i) => (
              <button
                key={i}
                aria-label={`View image ${i + 1}`}
                onClick={() => {
                  if (i === activeThumb) return;
                  setFading(true);
                  setTimeout(() => { setActiveThumb(i); setFading(false); }, 210);
                }}
                className={`lm-thumb${activeThumb === i ? ' lm-thumb--active' : ''}`}
              >
                <img src={img.url} alt={img.alt} />
              </button>
            ))}
          </div>
        </section>

        {/* INFO COLUMN */}
        <div className="lm-info" style={{padding: '1.5rem 1.25rem 3rem'}}>
          <p className="lm-category">LED Eye Therapy</p>
          <h1 className="lm-title">The Lumive<br />Under-Eye Therapy</h1>
          <p className="lm-desc">
            Designed for the delicate under-eye area, The Lumive Under-Eye Therapy uses targeted red light technology to help reduce the appearance of dark circles and puffiness in just 10 minutes a day.
          </p>

          <div className="lm-badges">
            <div className="lm-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
              Clinically Tested
            </div>
            <div className="lm-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              30-Day Returns
            </div>
            <div className="lm-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Ophthalmologist Safe
            </div>
          </div>

          <div className="lm-rating-row">
            <StarRating rating={5} />
            <span className="lm-review-count">42 Reviews</span>
          </div>

          <div className="lm-options">
            <p className="lm-options-label">DEVICE OPTIONS</p>
            <div className="lm-option-card lm-option-card--selected">
              <div className="lm-option-thumb">
                <img src="/images/eye-therapy-1.png" alt="Under-Eye Therapy" />
              </div>
              <div className="lm-option-name">Lumive Under-Eye Therapy</div>
              <div className="lm-option-prices">
                <span className="lm-price-compare">$49.99</span>
                <span className="lm-price-sale">$39.99</span>
              </div>
            </div>
          </div>

          <p className="lm-social-proof">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span className="lm-popular">Popular</span> — 7 people added to bag in 24 hours
          </p>

          <div className="lm-atc-wrap" ref={atcRef}>
            {variantId ? (
              <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines: [{merchandiseId: variantId, quantity: 1}]}}>
                <button type="submit" onClick={() => setTimeout(() => open('cart'), 300)}>
                  Add to Bag
                </button>
              </CartForm>
            ) : (
              <button disabled>Unavailable</button>
            )}
          </div>
        </div>

      </div>


      {/* Contact */}
      <EyeReviewsSection />
      <ContactSection />

      {/* Sticky ATC */}
      <div className={`lm-sticky-atc${stickyVisible ? ' lm-sticky-atc--visible' : ''}`}>
        <div className="lm-sticky-atc-inner">
          <div className="lm-sticky-atc-info">
            <span className="lm-sticky-atc-name">Under-Eye Therapy</span>
            <span className="lm-sticky-atc-price">$39.99</span>
          </div>
          {variantId ? (
            <CartForm route="/cart" action={CartForm.ACTIONS.LinesAdd} inputs={{lines: [{merchandiseId: variantId, quantity: 1}]}}>
              <button type="submit" onClick={() => setTimeout(() => open('cart'), 300)}>
                Add to Bag
              </button>
            </CartForm>
          ) : (
            <button disabled>Unavailable</button>
          )}
        </div>
      </div>

    </div>
  );
}

/* ── Benefits ── */
function EyeBenefits() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      {threshold: 0.15}
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const items = [
    {icon: '◎', stat: '78%', label: 'reduction in dark circles', sub: 'Visible improvement after 4 weeks of daily use'},
    {icon: '◉', stat: '82%', label: 'reduction in puffiness', sub: 'Infrared wavelengths stimulate lymphatic drainage'},
    {icon: '◌', stat: '91%', label: 'of users saw smoother skin', sub: 'Collagen synthesis in the periorbital zone'},
    {icon: '⏱', stat: '10 min', label: 'per session', sub: 'Hands-free. Lightweight. Built for your daily ritual'},
  ];

  return (
    <section ref={ref} className={`lm-eye-benefits${visible ? ' lm-eye-benefits--visible' : ''}`}>
      <div className="lm-eye-benefits-inner">
        {items.map((item, i) => (
          <div key={i} className="lm-eye-benefit" style={{'--delay': `${i * 0.1}s`}}>
            <span className="lm-eye-benefit-stat">{item.stat}</span>
            <p className="lm-eye-benefit-label">{item.label}</p>
            <p className="lm-eye-benefit-sub">{item.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Reviews ── */
const EYE_REVIEWS = [
  {name: 'Isabelle M.', rating: 5, location: 'Paris, FR', text: 'I\'ve tried every eye cream on the market. Nothing has come close to what this device has done for my dark circles in three weeks. My under-eyes look genuinely rested for the first time in years.'},
  {name: 'Sofia A.', rating: 5, location: 'Milan, IT', text: 'The puffiness I used to wake up with every morning has almost completely disappeared. I use it while reading in the evening. Ten minutes, and I wake up looking like I slept for nine hours.'},
  {name: 'Camille R.', rating: 5, location: 'London, UK', text: 'Very elegant product. Feels premium, works like a professional treatment. The fine lines around my outer eye area are noticeably softer. I ordered one for my mother as well.'},
  {name: 'Hana S.', rating: 4, location: 'Stockholm, SE', text: 'Beautiful design and it actually works. I was skeptical at first but after two weeks I can clearly see my under-eyes are brighter and less hollow-looking. Very happy with the purchase.'},
  {name: 'Valentina G.', rating: 5, location: 'Barcelona, ES', text: 'I asked my dermatologist about LED eye therapy and she confirmed the science is solid. This device is the most affordable professional-grade option I\'ve found. Results show.'},
  {name: 'Nora E.', rating: 5, location: 'Amsterdam, NL', text: 'Discreet, lightweight and works seamlessly into my nighttime routine. My partner noticed my under-eye area looked different before I even mentioned I was using it. That says everything.'},
];

/* ── Contact (same as on mask page) ── */
function ContactSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({name: '', email: '', subject: '', message: ''});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      {threshold: 0.12}
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = (e) => {
    e.preventDefault();
    const subj = encodeURIComponent(form.subject || 'Contact from LumiVe Website');
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:support.lumive@gmail.com?subject=${subj}&body=${body}`;
    setSent(true);
  };

  return (
    <section ref={sectionRef} className={`lm-ct-section${visible ? ' lm-ct-visible' : ''}`}>
      <div className="lm-ct-orb lm-ct-orb--1" />
      <div className="lm-ct-orb lm-ct-orb--2" />
      <div className="lm-ct-inner">
        <div className="lm-ct-left">
          <span className="lm-ct-eyebrow">Contact Us</span>
          <h2 className="lm-ct-headline">Let's Talk<br />Skin Technology.</h2>
          <p className="lm-ct-sub">Have a question about LumiVe, your order, or your LED therapy ritual? Our support team is here to help.</p>
          <a href="mailto:support.lumive@gmail.com" className="lm-ct-email-card">
            <div className="lm-ct-email-info">
              <span className="lm-ct-email-addr">support.lumive@gmail.com</span>
            </div>
          </a>
          <p className="lm-ct-response"><span className="lm-ct-dot" />Response time: within 24 hours</p>
        </div>
        <div className="lm-ct-right">
          <div className="lm-ct-card">
            <p className="lm-ct-card-title">Send a Message</p>
            {sent ? (
              <div className="lm-ct-sent">
                <div className="lm-ct-sent-icon">✦</div>
                <p>Thank you. We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form className="lm-ct-form" onSubmit={handleSubmit}>
                <div className="lm-ct-field"><label>Name</label><input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required /></div>
                <div className="lm-ct-field"><label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required /></div>
                <div className="lm-ct-field"><label>Subject</label><input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" /></div>
                <div className="lm-ct-field"><label>Message</label><textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us more…" required /></div>
                <button type="submit" className="lm-ct-submit">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
