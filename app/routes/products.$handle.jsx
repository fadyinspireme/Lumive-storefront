import {useLoaderData} from 'react-router';
import {useState, useRef, useEffect, lazy, Suspense} from 'react';

const LEDMaskCanvas = lazy(() =>
  import('~/components/LEDMaskCanvas').then((m) => ({default: m.LEDMaskCanvas})),
);
import {motion, AnimatePresence} from 'framer-motion';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import {useAside} from '~/components/Aside';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta = ({data}) => {
  return [
    {title: `Lumive | ${data?.product?.title ?? ''}`},
    {rel: 'canonical', href: `/products/${data?.product?.handle}`},
  ];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  if (!handle) throw new Error('Expected product handle to be defined');
  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
  ]);
  if (!product?.id) throw new Response(null, {status: 404});
  redirectIfHandleIsLocalized(request, {handle, data: product});
  return {product};
}

function loadDeferredData() {
  return {};
}

function StarRating({rating = 4.5}) {
  return (
    <span className="lm-stars-wrap">
      {[1, 2, 3, 4, 5].map((i) => {
        if (i <= Math.floor(rating)) {
          return <span key={i} className="lm-star lm-star--full">★</span>;
        } else if (i === Math.ceil(rating) && rating % 1 >= 0.5) {
          return (
            <span key={i} className="lm-star lm-star--half">
              <span className="lm-star-bg">★</span>
              <span className="lm-star-fill">★</span>
            </span>
          );
        }
        return <span key={i} className="lm-star lm-star--empty">★</span>;
      })}
    </span>
  );
}

export default function Product() {
  const {product} = useLoaderData();
  const {open} = useAside();
  const [activeThumb, setActiveThumb] = useState(0);
  const [fading, setFading] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const atcRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!atcRef.current) return;
      const bottom = atcRef.current.getBoundingClientRect().bottom;
      setStickyVisible(bottom < 0);
    };
    window.addEventListener('scroll', onScroll, {passive: true});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const galleryImages = [
    {id: '1', url: '/images/faceglow-mask-1.png', altText: 'Lumive FaceGlow Mask'},
    {id: '2', url: '/images/faceglow-mask-2.png', altText: 'Lumive FaceGlow Mask — Lifestyle'},
    {id: '3', url: '/images/faceglow-mask-3.png', altText: 'Lumive FaceGlow Mask — Angle'},
    {id: '4', url: '/images/faceglow-mask-4.png', altText: 'Lumive FaceGlow Mask — Blue Light'},
    {id: '5', url: '/images/faceglow-mask-5.png', altText: 'Lumive FaceGlow Mask — Red LED'},
  ];

  const currentImage = galleryImages[activeThumb] || galleryImages[0];

  const currentPrice = '$119.99';
  const comparePrice = '$249.99';


  return (
    <div className="lm-page">

      {/* Breadcrumb */}
      <div className="lm-breadcrumb-bar">
        <nav className="lm-breadcrumb">
          <a href="/">Home</a>
          <span className="lm-bc-sep">▶</span>
          <span>{product.title}</span>
        </nav>
      </div>

      {/* ── Product — mobile first, desktop 2-col ── */}
      <div className="w-full bg-[#f8f3ec] md:grid md:grid-cols-[1.05fr_1fr] md:gap-16 md:px-16 md:pt-6 md:pb-16">

        {/* IMAGE COLUMN */}
        <section className="w-full px-3 pt-4 md:px-0 md:pt-0">
          <div className="lm-hero-img-wrap">
            {currentImage ? (
              <img
                src={currentImage.url}
                alt={currentImage.altText || product.title}
                className={`lm-hero-img${fading ? ' lm-hero-img--fading' : ''}`}
              />
            ) : (
              <div style={{height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#DDD" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
            )}
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
                <img src={img.url} alt={img.altText || `View ${i + 1}`} />
              </button>
            ))}
          </div>
        </section>

        {/* INFO COLUMN */}
        <div className="lm-info" style={{padding: '1.5rem 1.25rem 3rem'}}>
          <p className="lm-category">RED LIGHT LED MASKS</p>
          <h1 className="lm-title">Lumive FaceGlow Mask</h1>
          <p className="lm-desc">
            Lumive FaceGlow Mask redefines advanced skincare with LED light therapy designed for at-home use. It features blue light technology that helps target acne-causing bacteria and reduce breakouts, along with 7 additional light modes, each offering different skin-supporting benefits for a clearer and healthier-looking complexion.
          </p>

          <div className="lm-badges">
            <div className="lm-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>
              Clinically Proven
            </div>
            <div className="lm-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              30-Day Returns
            </div>
            <div className="lm-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Dermatologist Approved
            </div>
          </div>

          <div className="lm-rating-row">
            <StarRating rating={4.5} />
            <span className="lm-review-count">181 Reviews</span>
          </div>

          <div className="lm-options">
            <p className="lm-options-label">DEVICE OPTIONS</p>
            <div className="lm-option-card lm-option-card--selected">
              <div className="lm-option-thumb">
                <img src="/images/faceglow-mask-1.png" alt={product.title} />
              </div>
              <div className="lm-option-name">Lumive FaceGlow Mask</div>
              <div className="lm-option-prices">
                <span className="lm-price-compare">{comparePrice}</span>
                <span className="lm-price-sale">{currentPrice}</span>
              </div>
            </div>
          </div>

          <p className="lm-social-proof">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            <span className="lm-popular">Popular</span> — 47 people added to bag in 24 hours
          </p>

          <div className="lm-atc-wrap" ref={atcRef}>
            <AddToCartButton
              disabled={!selectedVariant || !selectedVariant.availableForSale}
              onClick={() => open('cart')}
              lines={selectedVariant ? [{merchandiseId: selectedVariant.id, quantity: 1, selectedVariant}] : []}
            >
              {selectedVariant?.availableForSale ? 'Add to bag' : 'Sold Out'}
            </AddToCartButton>
          </div>
        </div>

      </div>

      {/* Clinical Study */}
      <ClinicalSection />

      {/* Light Therapy */}
      <LightTherapySection />

      {/* Reviews */}
      <PremiumReviewsSection />

      {/* Contact */}
      <ContactSection />

      {/* Sticky ATC — mobile only */}
      <div className={`lm-sticky-atc${stickyVisible ? ' lm-sticky-atc--visible' : ''}`}>
        <div className="lm-sticky-atc-inner">
          <div className="lm-sticky-atc-info">
            <span className="lm-sticky-atc-name">Lumive FaceGlow Mask</span>
            <span className="lm-sticky-atc-price">{currentPrice}</span>
          </div>
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            onClick={() => open('cart')}
            lines={selectedVariant ? [{merchandiseId: selectedVariant.id, quantity: 1, selectedVariant}] : []}
          >
            {selectedVariant?.availableForSale ? 'Add to Bag' : 'Sold Out'}
          </AddToCartButton>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [{
            id: product.id,
            title: product.title,
            price: selectedVariant?.price?.amount || '0',
            vendor: product.vendor,
            variantId: selectedVariant?.id || '',
            variantTitle: selectedVariant?.title || '',
            quantity: 1,
          }],
        }}
      />
    </div>
  );
}

/* ── Before / After Slider ── */
function BeforeAfterSlider({before, after, label}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const calc = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  };

  const onMouseDown = () => { dragging.current = true; };
  const onMouseMove = (e) => { if (dragging.current) calc(e.clientX); };
  const onMouseUp   = () => { dragging.current = false; };
  const onTouchMove = (e) => { calc(e.touches[0].clientX); };

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, []);

  return (
    <div className="ba-wrap" ref={containerRef}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseDown={onMouseDown}
      onTouchStart={onMouseDown}
    >
      {/* Before image — full width underneath */}
      <img src={before} alt="Before" className="ba-img ba-img--before" draggable={false} />

      {/* After image — clipped */}
      <div className="ba-after-clip" style={{width: `${pos}%`}}>
        <img src={after} alt="After" className="ba-img ba-img--after" draggable={false} />
      </div>

      {/* Labels */}
      <span className="ba-label ba-label--before">Before</span>
      <span className="ba-label ba-label--after">After</span>

      {/* Handle */}
      <div className="ba-handle" style={{left: `${pos}%`}}>
        <div className="ba-handle-line" />
        <div className="ba-handle-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/><polyline points="9 18 3 12 9 6" transform="translate(6,0) scale(-1,1) translate(-6,0)"/>
          </svg>
        </div>
        <div className="ba-handle-line" />
      </div>
    </div>
  );
}

/* ── Before & After Carousel ── */
const BA_IMAGES = [
  '/images/ba-1.jpg',
  '/images/ba-2.jpg',
  '/images/ba-3.jpg',
  '/images/ba-4.jpg',
  '/images/ba-5.jpg',
];

function BeforeAfterSection() {
  const [current, setCurrent] = useState(0);
  const total = BA_IMAGES.length;
  const prev = () => setCurrent((current - 1 + total) % total);
  const next = () => setCurrent((current + 1) % total);

  return (
    <section className="ba-section">
      <div className="ba-header">
        <span className="ba-label-top">REAL RESULTS</span>
        <h2 className="ba-title">Before &amp; After From Our Customers</h2>
        <p className="ba-sub">Real people. Real results. No filters.</p>
      </div>

      <div className="ba-carousel">
        <button className="ba-arrow ba-arrow--prev" onClick={prev} aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        <div className="ba-track">
          {BA_IMAGES.map((src, i) => (
            <div
              key={i}
              className={`ba-slide${i === current ? ' ba-slide--active' : ''}`}
              style={{transform: `translateX(${(i - current) * 100}%)`}}
            >
              <img src={src} alt={`Before and after ${i + 1}`} />
            </div>
          ))}
        </div>

        <button className="ba-arrow ba-arrow--next" onClick={next} aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Dots */}
      <div className="ba-dots">
        {BA_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`ba-dot${i === current ? ' ba-dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ── Premium Accordion ── */
function AccordionItem({label, isOpen, onToggle, children, index}) {
  const bodyRef = useRef(null);
  const height = isOpen && bodyRef.current ? bodyRef.current.scrollHeight : 0;
  return (
    <div className={`lm-acc-item${isOpen ? ' lm-acc-item--open' : ''}`} style={{'--i': index}}>
      <button className="lm-acc-trigger" onClick={onToggle} aria-expanded={isOpen}>
        <div className="lm-acc-trigger-left">
          <span className="lm-acc-dot" />
          <span className="lm-acc-label">{label}</span>
        </div>
        <span className="lm-acc-chevron">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>
      <div className="lm-acc-body-wrap" style={{maxHeight: `${height}px`}}>
        <div className="lm-acc-body" ref={bodyRef}>{children}</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CLINICALLY PROVEN SECTION
══════════════════════════════════════════ */

const LED_LIGHTS = [
  {id:'blue',   name:'Blue Light',   wl:'415nm',         color:'#5B9CF6', glowColor:'rgba(91,156,246,0.35)',   benefit:'Targets Acne-Causing Bacteria',      desc:'Penetrates deep into pores to neutralise acne-causing bacteria, visibly reducing breakouts and supporting a consistently clearer complexion.'},
  {id:'red',    name:'Red Light',    wl:'630nm',         color:'#F07060', glowColor:'rgba(240,112,96,0.35)',   benefit:'Stimulates Collagen & Firmness',       desc:'Activates fibroblast activity to boost natural collagen and elastin, visibly firming skin and softening the appearance of fine lines and wrinkles.'},
  {id:'green',  name:'Green Light',  wl:'520nm',         color:'#4DC99A', glowColor:'rgba(77,201,154,0.35)',   benefit:'Balances Tone & Fades Pigmentation',  desc:'Inhibits excess melanin production to promote a visibly more even complexion, reducing dark spots and hyperpigmentation with consistent daily use.'},
  {id:'yellow', name:'Yellow Light', wl:'590nm',         color:'#E8B84B', glowColor:'rgba(232,184,75,0.35)',   benefit:'Enhances Radiance & Natural Glow',    desc:'Stimulates the lymphatic system and improves skin cell oxygenation, visibly reducing redness and imparting a warm, lasting natural luminosity.'},
  {id:'purple', name:'Purple Light', wl:'415 + 630nm',   color:'#9B7AE8', glowColor:'rgba(155,122,232,0.35)',  benefit:'Accelerates Cellular Renewal',         desc:'Combines the antibacterial power of blue with the regenerative effects of red, simultaneously targeting breakouts while supporting deep skin renewal.'},
  {id:'cyan',   name:'Cyan Light',   wl:'490nm',         color:'#3CCFDF', glowColor:'rgba(60,207,223,0.35)',   benefit:'Calms Sensitivity & Redness',         desc:'Soothes inflamed and reactive skin, visibly reducing redness and sensitivity while promoting a calm, balanced and refreshed complexion.'},
  {id:'white',  name:'White Light',  wl:'Full Spectrum', color:'#A8A49E', glowColor:'rgba(168,164,158,0.35)',  benefit:'Deep Cellular Rejuvenation',           desc:'Penetrates the deepest skin layers to stimulate comprehensive cellular renewal, refining overall texture and supporting long-term skin health.'},
];

function ClinicallyProvenSection() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);
  const startXRef = useRef(0);
  const total = LED_LIGHTS.length;

  const go = (idx) => {
    setActive(((idx % total) + total) % total);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive(c => (c + 1) % total), 5500);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => setActive(c => (c + 1) % total), 5500);
    return () => clearInterval(timerRef.current);
  }, []);

  const light = LED_LIGHTS[active];
  const pct = ((active + 1) / total) * 100;

  return (
    <section className="lm-cp-section">

      {/* Trust line */}
      <p className="lm-cp-trust">Clinically Proven&ensp;·&ensp;Dermatologist Recommended</p>

      {/* Headline */}
      <div className="lm-cp-header">
        <span className="lm-cp-eyebrow">The Science</span>
        <h2 className="lm-cp-title">Clinically Proven<br/>Benefits</h2>
      </div>

      {/* Stage — key forces re-animation on slide change */}
      <div
        className="lm-cp-stage"
        onTouchStart={(e) => { startXRef.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = startXRef.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) go(active + (diff > 0 ? 1 : -1));
        }}
      >
        <div key={active} className="lm-cp-slide" style={{'--c': light.color, '--glow': light.glowColor}}>

          {/* Atmospheric orb */}
          <div className="lm-cp-vis">
            <div className="lm-cp-vis-atm" />
            <div className="lm-cp-vis-ring" />
            <div className="lm-cp-vis-core" />
          </div>

          <p className="lm-cp-counter">{String(active + 1).padStart(2,'0')}&thinsp;—&thinsp;{String(total).padStart(2,'0')}</p>
          <h3 className="lm-cp-name">{light.name}</h3>
          <div className="lm-cp-rule" />
          <p className="lm-cp-wl">{light.wl}</p>
          <p className="lm-cp-benefit">{light.benefit}</p>
          <p className="lm-cp-desc">{light.desc}</p>
        </div>
      </div>

      {/* Progress bar + nav arrows */}
      <div className="lm-cp-nav-row">
        <button className="lm-cp-nav-btn" onClick={() => go(active - 1)} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="lm-cp-bar">
          <div className="lm-cp-bar-fill" style={{width:`${pct}%`, background: light.color}} />
        </div>
        <button className="lm-cp-nav-btn" onClick={() => go(active + 1)} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Light name tabs */}
      <div className="lm-cp-tabs">
        {LED_LIGHTS.map((l, i) => (
          <button
            key={l.id}
            className={`lm-cp-tab${i === active ? ' lm-cp-tab--on' : ''}`}
            style={{'--c': l.color}}
            onClick={() => go(i)}
          >
            {l.name.split(' ')[0]}
          </button>
        ))}
      </div>

    </section>
  );
}

/* ══════════════════════════════════════════
   CLINICAL STUDY SECTION
══════════════════════════════════════════ */

const CLINICAL_SLIDES = [
  {
    headline: 'Clinically proven to visibly reduce wrinkles in weeks',
    stat: '86',
    statLabel: 'of participants reported improvements in fine lines',
    footnote: '*12-week clinical study with 104 subjects and 1×/day use of 14-min LED treatment. Individual results may vary.',
    image: '/images/clinical-wrinkles.png',
    caption: 'Unretouched. 1×/day use for 12 weeks*',
  },
  {
    headline: 'Clinically proven to visibly reduce acne-causing bacteria',
    stat: '93',
    statLabel: 'of participants reported clearer skin and reduced breakouts',
    footnote: '*12-week clinical study with 104 subjects and 1×/day use of 14-min LED treatment. Individual results may vary.',
    image: '/images/clinical-acne.png',
    caption: 'Unretouched. 1×/day use for 12 weeks*',
  },
];

function useCountUp(target, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    setCount(0);
    let raf;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return count;
}

function ClinicalSection() {
  const total    = CLINICAL_SLIDES.length;
  const [idx, setIdx]           = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [fading, setFading]     = useState(false);
  const [visible, setVisible]   = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      {threshold: 0.2},
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const go = (newIdx) => {
    if (fading) return;
    setFading(true);
    setTimeout(() => { setDisplayed(newIdx); setIdx(newIdx); setFading(false); }, 220);
  };
  const prev = () => go((idx - 1 + total) % total);
  const next = () => go((idx + 1) % total);

  const slide = CLINICAL_SLIDES[displayed];
  const count = useCountUp(parseInt(slide.stat), visible);

  return (
    <section ref={ref} className={`cl2-section${visible ? ' cl2-section--in' : ''}`}>
      <div className="cl2-inner">

        <div className="cl2-header">
          <p className="cl2-eyebrow">Clinical Study</p>
          <h2 className="cl2-title">Clinically Proven Results</h2>
          <p className="cl2-sub">Visible improvements in skin appearance with consistent use.</p>
        </div>

        <div className={`cl2-body${fading ? ' cl2-body--fading' : ''}`}>

          {/* Image */}
          <div className="cl2-img-wrap">
            <img src={slide.image} alt="" className="cl2-img" />
            <span className="cl2-caption">{slide.caption}</span>
          </div>

          {/* Stat */}
          <div className="cl2-stat-block">
            <div className="cl2-stat-row">
              <span className="cl2-pct">{count}<span className="cl2-pct-sign">%</span></span>
              <p className="cl2-stat-label">{slide.statLabel}</p>
            </div>
            <div className="cl2-bar-wrap">
              <div className="cl2-bar-fill" style={{width: visible ? `${slide.stat}%` : '0%'}} />
            </div>
            <p className="cl2-footnote">{slide.footnote}</p>
          </div>

          {/* Nav */}
          <div className="cl2-nav">
            <button className="cl2-nav-btn" onClick={prev} aria-label="Previous">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span className="cl2-nav-count">{idx + 1} <span className="cl2-nav-sep">/</span> {total}</span>
            <button className="cl2-nav-btn" onClick={next} aria-label="Next">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   LIGHT THERAPY — FULL-WIDTH INTERACTIVE
══════════════════════════════════════════ */

const LIGHT_SLIDES = [
  {
    id: 'red',
    name: 'Red Light',
    nm: '630 nm',
    color: '#D94F38',
    glow: '#D94F38',
    image: '/images/mask-red.png',
    benefits: [
      'Supports collagen production',
      'Helps reduce fine lines',
      'Improves skin firmness',
      'Promotes youthful glow',
    ],
  },
  {
    id: 'blue',
    name: 'Blue Light',
    nm: '415 nm',
    color: '#3E68D4',
    glow: '#3E68D4',
    image: '/images/mask-blue.png',
    benefits: [
      'Targets acne-causing bacteria',
      'Helps calm breakouts',
      'Clarifies oily skin',
      'Supports cleaner complexion',
    ],
  },
  {
    id: 'green',
    name: 'Green Light',
    nm: '520 nm',
    color: '#2A9E62',
    glow: '#2A9E62',
    image: '/images/mask-green.png',
    benefits: [
      'Helps reduce pigmentation',
      'Evens skin tone',
      'Brightens dull skin',
      'Supports radiance',
    ],
  },
  {
    id: 'yellow',
    name: 'Yellow Light',
    nm: '590 nm',
    color: '#C8951A',
    glow: '#C8951A',
    image: '/images/mask-yellow.png',
    benefits: [
      'Reduces redness appearance',
      'Calms sensitive skin',
      'Improves circulation',
      'Enhances glow',
    ],
  },
  {
    id: 'purple',
    name: 'Purple Light',
    nm: '415+630 nm',
    color: '#7B5EC8',
    glow: '#7B5EC8',
    image: '/images/mask-purple.png',
    benefits: [
      'Combines red + blue benefits',
      'Supports skin recovery',
      'Helps reduce imperfections',
      'Improves texture',
    ],
  },
  {
    id: 'cyan',
    name: 'Cyan Light',
    nm: '490 nm',
    color: '#0FAABB',
    glow: '#0FAABB',
    image: '/images/mask-cyan.png',
    benefits: [
      'Helps soothe irritation',
      'Reduces skin stress appearance',
      'Refreshes tired skin',
      'Provides calming effect',
    ],
  },
  {
    id: 'orange',
    name: 'Orange Light',
    nm: '620 nm',
    color: '#D96B10',
    glow: '#D96B10',
    image: '/images/mask-orange.png',
    benefits: [
      'Revitalizes tired complexion',
      'Enhances skin brightness',
      'Supports healthy glow',
      'Energizes skin appearance',
    ],
  },
];

/* Stable particle data — computed once outside component */
const LED_PARTICLES = Array.from({length: 14}, (_, i) => ({
  id: i,
  left: `${((i * 19 + 7) % 84) + 6}%`,
  top:  `${((i * 31 + 11) % 78) + 8}%`,
  size: [1.5, 2, 1, 2.5][i % 4],
  delayS: (i * 0.31) % 3,
  durS:   4 + (i % 3) * 0.8,
}));

/* Luxury ease — slow in, fast middle, slow settle */
function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function LightTherapySection() {
  /* Displayed slide (drives text + ambient) */
  const [active, setActive] = useState(0);
  /* Previous slide — shader "from" texture */
  const [prev, setPrev] = useState(0);
  /* Shader wave progress: 0 → 1 (driven by RAF, not React state) */
  const progressRef   = useRef(0);
  /* Normalised mouse position for 3D tilt inside R3F */
  const mouseRef      = useRef({x: 0, y: 0});
  const sectionRef    = useRef(null);
  const isAnimating   = useRef(false);
  const animRaf       = useRef(null);
  const touchStartX   = useRef(0);
  /* True once React has mounted (SSR guard for Canvas) */
  const [mounted, setMounted] = useState(false);

  const total = LIGHT_SLIDES.length;
  const slide = LIGHT_SLIDES[active];

  useEffect(() => { setMounted(true); }, []);

  /* Mouse tracking → forwarded to R3F via mouseRef */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onMove = (e) => {
      const r = section.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - r.left) / r.width  - 0.5) * 2,
        y: ((e.clientY - r.top)  / r.height - 0.5) * 2,
      };
    };
    section.addEventListener('mousemove', onMove, {passive: true});
    return () => section.removeEventListener('mousemove', onMove);
  }, []);

  /* go() — triggers the LED wave transition */
  const go = (idx) => {
    if (isAnimating.current) return;
    const next = ((idx % total) + total) % total;
    if (next === active) return;

    /* Capture current active as the "from" texture */
    setPrev(active);
    setActive(next);

    /* Animate shader progress 0 → 1 over ~1 s */
    progressRef.current = 0;
    isAnimating.current = true;
    const startTime = performance.now();
    const duration  = 1050;

    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      progressRef.current = easeInOutQuart(t);
      if (t < 1) {
        animRaf.current = requestAnimationFrame(tick);
      } else {
        progressRef.current  = 1;
        isAnimating.current  = false;
        /* Reset so next transition starts clean */
        setPrev(next);
        progressRef.current = 0;
      }
    };
    animRaf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => { if (animRaf.current) cancelAnimationFrame(animRaf.current); }, []);

  return (
    <section
      ref={sectionRef}
      className="lm-lt-section"
      onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 44) go(active + (diff > 0 ? 1 : -1));
      }}
    >
      {/* Full-section ambient color orb */}
      <motion.div
        className="lm-lt-ambient"
        animate={{backgroundColor: slide.glow}}
        transition={{duration: 1.4, ease: [0.4, 0, 0.2, 1]}}
      />

      {/* Floating micro-particles — tinted with active color */}
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0}}>
        {LED_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: slide.color,
              transition: 'background-color 1.1s ease',
            }}
            animate={{y: [0, -14, 0], opacity: [0.06, 0.16, 0.06]}}
            transition={{duration: p.durS, delay: p.delayS, repeat: Infinity, ease: 'easeInOut'}}
          />
        ))}
      </div>

      <p className="lm-lt-eyebrow">Advanced LED Therapy</p>

      <div className="lm-lt-inner">

        {/* ── LEFT — static headline + animated per-slide copy ── */}
        <div className="lm-lt-left">
          <div>
            <h2 className="lm-lt-headline">
              7 Light<br />Frequencies.<br />
              <em>One Transformative<br />Ritual.</em>
            </h2>
            <p className="lm-lt-para">
              Clinically inspired LED wavelengths designed to support clearer, calmer, brighter and healthier-looking skin.
            </p>
          </div>

          {/* Per-slide copy — cinematic blur-up transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{opacity: 0, y: 18, filter: 'blur(8px)'}}
              animate={{opacity: 1, y: 0,  filter: 'blur(0px)'}}
              exit   ={{opacity: 0, y: -14, filter: 'blur(6px)'}}
              transition={{duration: 0.65, ease: [0.22, 1, 0.36, 1]}}
            >
              <span className="lm-lt-color-tag" style={{color: slide.color}}>
                {slide.name}&ensp;·&ensp;{slide.nm}
              </span>
              <span className="lm-lt-benefit-label" style={{color: slide.color}}>
                Key Benefits
              </span>
              <ul className="lm-lt-benefits">
                {slide.benefits.map((b, i) => (
                  <motion.li
                    key={b}
                    initial={{opacity: 0, x: -10}}
                    animate={{opacity: 1, x: 0}}
                    transition={{duration: 0.4, delay: i * 0.07}}
                  >
                    <span className="lm-lt-bdot" style={{'--c': slide.color}} />
                    {b}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="lm-lt-nav">
            <div className="lm-lt-counter">
              <span className="lm-lt-n">{String(active + 1).padStart(2, '0')}</span>
              <span className="lm-lt-slash">—</span>
              <span className="lm-lt-tot">{String(total).padStart(2, '0')}</span>
            </div>
            <button className="lm-lt-arrow" onClick={() => go(active - 1)} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button className="lm-lt-arrow" onClick={() => go(active + 1)} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── RIGHT — real-time 3D shader mask ── */}
        <div className="lm-lt-right">

          {/* Ambient radial glow behind the mask */}
          <motion.div
            className="lm-lt-mask-glow"
            animate={{backgroundColor: slide.glow}}
            transition={{duration: 1.1, ease: [0.4, 0, 0.2, 1]}}
          />

          {/* Canvas container — aspect-ratio box */}
          <div
            className="lm-lt-mask-stage"
            style={{
              position: 'relative',
              zIndex: 1,
              aspectRatio: '1 / 1.05',
              filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.13)) drop-shadow(0 8px 24px rgba(0,0,0,0.07))',
            }}
          >
            {/* SSR guard — Canvas only mounts client-side */}
            {mounted ? (
              <Suspense fallback={
                <img
                  src={slide.image}
                  alt={`Lumive ${slide.name} LED Mask`}
                  style={{width: '100%', height: 'auto', display: 'block'}}
                />
              }>
                <LEDMaskCanvas
                  slides={LIGHT_SLIDES}
                  activeIdx={active}
                  prevIdx={prev}
                  progressRef={progressRef}
                  mouseRef={mouseRef}
                />
              </Suspense>
            ) : (
              <img
                src={slide.image}
                alt={`Lumive ${slide.name} LED Mask`}
                style={{width: '100%', height: 'auto', display: 'block'}}
              />
            )}
          </div>

          {/* Color dot indicators */}
          <div className="lm-lt-dots">
            {LIGHT_SLIDES.map((s, i) => (
              <button
                key={s.id}
                className={`lm-lt-dot${i === active ? ' lm-lt-dot--on' : ''}`}
                style={{'--c': s.color}}
                onClick={() => go(i)}
                aria-label={s.name}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ══════════════════════════════════════════
   PREMIUM REVIEWS — data + components
══════════════════════════════════════════ */

const REVIEWS_DATA = [
  {name:'Sophia Laurent',    location:'Paris, France',         rating:5, photo:'/images/review-1.avif',  review:'ok so i was NOT expecting this to actually work but 4 weeks later and my skin genuinely looks different. calmer, less red, just... better. kind of obsessed',                                  skinType:'Sensitive Skin',   duration:'4 Weeks'},
  {name:'Charlotte Moore',   location:'London, UK',            rating:5, photo:'/images/review-3.avif',  review:'week 2 i just stopped putting on as much foundation without even thinking about it. thats honestly the best sign',                                                                               skinType:'Combination Skin', duration:'3 Weeks'},
  {name:'Elena Bauer',       location:'Munich, Germany',       rating:5, photo:'/images/review-4.avif',  review:'my husband noticed before i said anything. thats literally the only review you need',                                                                                                            skinType:'Normal Skin',      duration:'5 Weeks'},
  {name:'Ingrid Lindqvist',  location:'Stockholm, Sweden',     rating:5, photo:'/images/review-6.avif',  review:'6 weeks in and my skin feels like it did when i was like 26. i know that sounds so cliché but its actually true lol',                                                                            skinType:'Dry Skin',         duration:'6 Weeks'},
  {name:'Madison Taylor',    location:'New York, USA',         rating:5, photo:'/images/review-7.avif',  review:'the glow is SO real!! not in a glittery way, like actual healthy skin from the inside. i\'m genuinely obsessed with this thing',                                                                skinType:'Normal Skin',      duration:'8 Weeks'},
  {name:'Valentina Rossi',   location:'Milan, Italy',          rating:5, photo:'/images/review-8.avif',  review:'was skeptical, still kind of am tbh, but my skin tone is way more even now so... yeah. it works',                                                                                                skinType:'Combination Skin', duration:'4 Weeks'},
  {name:'Emma Hartmann',     location:'Berlin, Germany',       rating:5, photo:'/images/review-13.avif', review:'I\'m 47 and honestly wasn\'t expecting much. it\'s not overnight magic but after 3 months the difference is real and consistent and that\'s what i actually needed',                            skinType:'Mature Skin',      duration:'3 Months'},
  {name:'Freya Nielsen',     location:'Copenhagen, Denmark',   rating:5, photo:'/images/review-15.avif', review:'my facialist asked what i was doing differently before i even brought it up. said sold out loud lol',                                                                                            skinType:'Normal Skin',      duration:'6 Weeks'},
  {name:'Olivia Sterling',   location:'London, UK',            rating:5, photo:'/images/review-16.avif', review:'spent years and honestly way too much money trying to fix the lines around my eyes. this is actually doing something. genuinely can\'t believe it',                                             skinType:'Mature Skin',      duration:'10 Weeks'},
  {name:'Céline Moreau',     location:'Lyon, France',          rating:5, photo:'/images/review-17.avif', review:'sensitive skin here and it hasn\'t irritated me once which is already a win. skin just looks calmer overall, less angry i guess',                                                               skinType:'Sensitive Skin',   duration:'5 Weeks'},
  {name:'Zoe Walsh',         location:'Manchester, UK',        rating:5, photo:'/images/review-18.avif', review:'the blue light for breakouts is genuinely doing something. like my skin feels cleaner without being stripped which is hard to find',                                                            skinType:'Oily Skin',        duration:'7 Weeks'},
  {name:'Hannah Schultz',    location:'Hamburg, Germany',      rating:5, photo:'/images/review-19.avif', review:'pores look smaller, makeup sits better. 4 weeks. did not see that coming',                                                                                                                      skinType:'Oily Skin',        duration:'4 Weeks'},
  {name:'Lucia Ferrari',     location:'Rome, Italy',           rating:5, review:'i go out without makeup way more now. my skin just looks clear enough that i don\'t really feel like i need to cover it anymore??',                                                                                             skinType:'Combination Skin', duration:'5 Weeks'},
  {name:'Piper Chen',        location:'San Francisco, USA',    rating:5, review:'my skin reacts to literally everything so i was nervous but 8 weeks in and zero flare ups + actual improvement. that never happens',                                                                                            skinType:'Sensitive Skin',   duration:'8 Weeks'},
  {name:'Astrid Svensson',   location:'Gothenburg, Sweden',    rating:5, review:'less reactive, more balanced. as someone with sensitive skin this is genuinely one of the better things i\'ve tried. no drama just better skin',                                                                                skinType:'Sensitive Skin',   duration:'6 Weeks'},
  {name:'Brooke Williams',   location:'Los Angeles, USA',      rating:5, review:'i\'ve tried like every skincare thing out there and this is the first one that made my routine feel like it actually makes sense. skin is just consistently better now',                                                        skinType:'Normal Skin',      duration:'3 Months'},
  {name:'Margaux Petit',     location:'Bordeaux, France',      rating:5, review:'10 mins a day and my skin has changed more than it did from any serum i\'ve used. simple and it works, what more do you want',                                                                                                  skinType:'Dry Skin',         duration:'9 Weeks'},
  {name:'Isabelle Bernard',  location:'Paris, France',         rating:5, review:'I\'m 51 and my skin looks closer to how it did at 45. genuinely didn\'t expect that. very happy',                                                                                                                               skinType:'Mature Skin',      duration:'4 Months'},
  {name:'Penelope Grant',    location:'Oxford, UK',            rating:5, review:'started this more as a self care thing and then the results just... happened. skin looks noticeably better. bonus',                                                                                                              skinType:'Combination Skin', duration:'2 Months'},
  {name:'Anna Zimmermann',   location:'Frankfurt, Germany',    rating:5, review:'two different friends asked what i changed in my routine in the same week. that was enough for me lol',                                                                                                                         skinType:'Normal Skin',      duration:'7 Weeks'},
  {name:'Sofia Andersson',   location:'Malmö, Sweden',         rating:5, review:'i take skin photos every few weeks and the 5 week comparison genuinely surprised me. the evenness is so much better',                                                                                                           skinType:'Normal Skin',      duration:'5 Weeks'},
  {name:'Taylor Morrison',   location:'Chicago, USA',          rating:5, review:'didn\'t think id stick with it but here i am 6 weeks later. results are consistent and that\'s genuinely all i care about',                                                                                                    skinType:'Combination Skin', duration:'6 Weeks'},
  {name:'Giulia Conti',      location:'Florence, Italy',       rating:5, review:'the lines around my mouth are softer and i\'m less self conscious in photos now. sounds small but honestly it\'s not',                                                                                                         skinType:'Mature Skin',      duration:'2 Months'},
  {name:'Nora Hansen',       location:'Oslo, Norway',          rating:5, review:'winters here are brutal on skin and this is the first thing that\'s actually helped. less tight, less dull, way more comfortable',                                                                                             skinType:'Dry Skin',         duration:'3 Months'},
  {name:'Alexis Turner',     location:'Boston, USA',           rating:5, review:'ngl the glow right after a session is kind of addictive. i actually look forward to it now which is wild bc i hate morning routines',                                                                                          skinType:'Sensitive Skin',   duration:'4 Weeks'},
  {name:'Mia Becker',        location:'Cologne, Germany',      rating:5, review:'my skin looks healthy not like it\'s been treated, if that makes sense? that natural look was exactly what i was going for',                                                                                                   skinType:'Normal Skin',      duration:'6 Weeks'},
  {name:'Francesca Marino',  location:'Venice, Italy',         rating:5, review:'8 weeks and my breakouts are so much less frequent. skin looks cleaner without me doing anything extra which is what i needed',                                                                                                 skinType:'Oily Skin',        duration:'8 Weeks'},
  {name:'Lauren Hayes',      location:'Dublin, Ireland',       rating:5, review:'tried SO many home devices that did nothing. this one actually feels like it\'s getting somewhere. couldn\'t believe it tbh',                                                                                                  skinType:'Combination Skin', duration:'5 Weeks'},
  {name:'Clara Weber',       location:'Vienna, Austria',       rating:5, review:'only 3 weeks but my complexion already looks more refreshed. subtle but definitely real. happy so far',                                                                                                                        skinType:'Normal Skin',      duration:'3 Weeks'},
  {name:'Amélie Dubois',     location:'Strasbourg, France',    rating:5, review:'i just look at my skin differently now lol. it\'s healthier and more even and i feel way better about it than i did 7 weeks ago',                                                                                              skinType:'Dry Skin',         duration:'7 Weeks'},
  {name:'Natalie Brooks',    location:'Seattle, USA',          rating:5, review:'the redness around my nose that i\'ve had for literal years looks SO much better. wasn\'t even expecting that, was just hoping for glow',                                                                                      skinType:'Sensitive Skin',   duration:'6 Weeks'},
  {name:'Chiara Ricci',      location:'Turin, Italy',          rating:5, review:'jawline looks more defined and skin feels firmer. just from being consistent with it. no tricks, just actual results',                                                                                                         skinType:'Mature Skin',      duration:'3 Months'},
  {name:'Emilie Larsen',     location:'Aarhus, Denmark',       rating:5, review:'used it through honestly the worst 2 months of my life stress-wise and my skin held up way better than usual. means a lot',                                                                                                   skinType:'Combination Skin', duration:'8 Weeks'},
  {name:'Scarlett Davis',    location:'Nashville, USA',        rating:5, review:'not a dramatic transformation or anything like that, just genuinely better skin. that\'s all i wanted and that\'s what i got',                                                                                                 skinType:'Normal Skin',      duration:'5 Weeks'},
  {name:'Klara Müller',      location:'Stuttgart, Germany',    rating:5, review:'the green light has done more for my pigmentation than like 2 years of vitamin C serums. that surprised me a lot honestly',                                                                                                   skinType:'Normal Skin',      duration:'10 Weeks'},
  {name:'Vivienne Clarke',   location:'Edinburgh, UK',         rating:5, review:'my skin just catches light differently now. more even, less dull. noticed it in a shop mirror which is always the real test lol',                                                                                              skinType:'Mature Skin',      duration:'2 Months'},
  {name:'Inès Garcia',       location:'Barcelona, Spain',      rating:5, review:'6 weeks and my skin is SO much less reactive. to weather, to stress, to everything. that was literally the main thing i wanted',                                                                                               skinType:'Sensitive Skin',   duration:'6 Weeks'},
  {name:'Harper Stone',      location:'Miami, USA',            rating:5, review:'use the red light every single morning and the area around my eyes just looks more rested. it\'s non negotiable for me now',                                                                                                   skinType:'Mature Skin',      duration:'9 Weeks'},
  {name:'Beatrice Costa',    location:'Naples, Italy',         rating:5, review:'my skin was always tight and kind of dull. now it looks supple and actually bright. didn\'t expect such a real change',                                                                                                        skinType:'Dry Skin',         duration:'2 Months'},
  {name:'Lily Thompson',     location:'Toronto, Canada',       rating:5, review:'looked at a photo from 6 weeks ago and genuinely couldn\'t believe the difference. the dullness is just gone',                                                                                                                 skinType:'Combination Skin', duration:'6 Weeks'},
  {name:'Helena Janssen',    location:'Amsterdam, Netherlands',rating:5, review:'i noticed my cheekbones looking more lifted and i was like wait what. didn\'t expect that at all. very happy surprise',                                                                                                        skinType:'Normal Skin',      duration:'7 Weeks'},
  {name:'Ava Richardson',    location:'Phoenix, USA',          rating:5, review:'texture is smoother, pores look smaller, congestion is way down. 4 weeks. honestly didn\'t expect results this fast',                                                                                                         skinType:'Oily Skin',        duration:'4 Weeks'},
  {name:'Sophia Müller',     location:'Düsseldorf, Germany',   rating:5, review:'do it before bed every night and wake up with skin that actually looks rested. it\'s just part of my routine now like i don\'t even think about it',                                                                          skinType:'Normal Skin',      duration:'5 Weeks'},
  {name:'Isla Mackenzie',    location:'Glasgow, UK',           rating:5, review:'my skin holds onto moisture so differently now. looks plumper and feels genuinely healthy. didn\'t realise how dehydrated it was before',                                                                                     skinType:'Dry Skin',         duration:'8 Weeks'},
  {name:'Elena Ferretti',    location:'Bologna, Italy',        rating:5, review:'3 months in and my skin barrier is stronger than it\'s ever been. i used to react to everything. now i barely react to anything. huge deal for me',                                                                           skinType:'Sensitive Skin',   duration:'3 Months'},
  {name:'Julia Fischer',     location:'Zürich, Switzerland',   rating:5, review:'just quiet steady improvement every few weeks. not flashy results but real ones and that\'s exactly what i was hoping for',                                                                                                   skinType:'Combination Skin', duration:'10 Weeks'},
  {name:'Chloé Dubois',      location:'Nice, France',          rating:5, review:'looks like i had a facial and i was just in my bathroom for 10 mins. cleaner, more radiant, and i haven\'t changed anything else in my routine',                                                                              skinType:'Normal Skin',      duration:'6 Weeks'},
  {name:'Rebecca Stone',     location:'Washington D.C., USA',  rating:5, review:'people keep commenting on my skin and i haven\'t told anyone what i\'m doing yet lol. that\'s honestly the best kind of result',                                                                                              skinType:'Mature Skin',      duration:'4 Months'},
  {name:'Bianca Moretti',    location:'Genoa, Italy',          rating:5, review:'3 months and my skin just looks like... itself again? more even, more alive. hard to explain but very real',                                                                                                                   skinType:'Normal Skin',      duration:'3 Months'},
  {name:'Madeleine Fontaine',location:'Marseille, France',     rating:5, review:'the difference shows most in photos. my skin tone looks way more even and i\'m editing my photos less which feels like an actual win',                                                                                         skinType:'Dry Skin',         duration:'7 Weeks'},
  {name:'Sadie Collins',     location:'Portland, USA',         rating:5, review:'the evenness i\'d been chasing with serums for literally years. got there in under 3 months. kind of annoyed i didn\'t find this sooner',                                                                                     skinType:'Sensitive Skin',   duration:'9 Weeks'},
  {name:'Petra Hoffmann',    location:'Nuremberg, Germany',    rating:5, review:'skin looks more refined and the overall tone has improved in a way that\'s hard to ignore. very satisfied',                                                                                                                    skinType:'Combination Skin', duration:'8 Weeks'},
  {name:'Alice Martin',      location:'Nantes, France',        rating:5, review:'10 mins a day and i genuinely look forward to it. my skin looks calmer and i just feel better about it, simple as that',                                                                                                     skinType:'Normal Skin',      duration:'4 Weeks'},
  {name:'Iris Schmidt',      location:'Bremen, Germany',       rating:5, review:'skin feels less tense which sounds weird but if you have sensitive skin you know exactly what i mean. the yellow light really works for me',                                                                                   skinType:'Sensitive Skin',   duration:'6 Weeks'},
  {name:'Maya Jensen',       location:'Odense, Denmark',       rating:5, review:'could already see a difference by week 3. told basically everyone i know about it which is not something i usually do lol',                                                                                                   skinType:'Dry Skin',         duration:'5 Weeks'},
  {name:'Amber Wilson',      location:'Atlanta, USA',          rating:5, review:'it\'s just part of who i am now tbh. my skin is consistently better and there\'s no way i\'m going back',                                                                                                                    skinType:'Normal Skin',      duration:'3 Months'},
  {name:'Vittoria Russo',    location:'Palermo, Italy',        rating:5, review:'the pigmentation i thought was just permanent has actually faded. the green light is insane for that, didn\'t expect it at all',                                                                                               skinType:'Normal Skin',      duration:'2 Months'},
  {name:'Joséphine Laurent', location:'Toulouse, France',      rating:5, review:'i\'m in my 50s and have tried everything. this is the one i actually kept using and the results are there. simple as that',                                                                                                   skinType:'Mature Skin',      duration:'3 Months'},
  {name:'Camille Moreau',    location:'Lille, France',         rating:5, review:'6 weeks and my skin just looks so much more alive. feels different too. couldn\'t really explain it before but now i just feel good about my skin',                                                                            skinType:'Combination Skin', duration:'6 Weeks'},
  {name:'Elin Bergström',    location:'Uppsala, Sweden',       rating:5, review:'more confident in natural light, skin is clearer and more even. hadn\'t felt that way about my skin in a long time honestly',                                                                                                 skinType:'Normal Skin',      duration:'10 Weeks'},
];

/* Framer Motion variants — deck cascade in, reverse fold out */
const PRV_VARIANTS = {
  hidden: (c) => ({
    opacity: 0,
    y: -42,
    rotateX: -16,
    scale: 0.91,
    transformPerspective: 900,
    transition: {
      duration: 0.44,
      delay: c?.exitDelay ?? 0,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
  visible: (c) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transformPerspective: 900,
    transition: {
      duration: 0.68,
      delay: c?.enterDelay ?? 0,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function PrvStarRow() {
  return (
    <div className="prv-card-stars">
      {[0,1,2,3,4].map((i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#111111">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function PrvCard({review, animCustom}) {
  const inner = (
    <div className="prv-card">
      {review.photo && (
        <div className="prv-card-photo-wrap">
          <img
            src={review.photo}
            alt={`${review.name} — customer photo`}
            className="prv-card-photo"
            loading="lazy"
          />
        </div>
      )}
      <PrvStarRow />
      <p className="prv-review-text">{review.review}</p>
      <div className="prv-card-rule" />
      <span className="prv-card-name">{review.name}</span>
      <span className="prv-card-loc">{review.location}</span>
      <div className="prv-card-meta">
        <span className="prv-meta-tag">{review.skinType}</span>
        <span className="prv-meta-tag">{review.duration}</span>
      </div>
      <div className="prv-verified">
        <span className="prv-verified-dot" />
        Verified LumiVe Ritual
      </div>
    </div>
  );

  if (!animCustom) return inner;

  return (
    <motion.div
      custom={animCustom}
      variants={PRV_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {inner}
    </motion.div>
  );
}

const PRV_INITIAL = 3;
const PRV_BATCH   = 5;

function PremiumReviewsSection() {
  const [count, setCount]           = useState(PRV_INITIAL);
  const [batchStart, setBatchStart] = useState(PRV_INITIAL);

  const hasMore  = count < REVIEWS_DATA.length;
  const hasExtra = count > PRV_INITIAL;

  const onShowMore = () => {
    setBatchStart(count);
    setCount((c) => Math.min(c + PRV_BATCH, REVIEWS_DATA.length));
  };

  const onShowLess = () => {
    setBatchStart(PRV_INITIAL);
    setCount(PRV_INITIAL);
  };

  const staticCards = REVIEWS_DATA.slice(0, PRV_INITIAL);
  const extraCards  = REVIEWS_DATA.slice(PRV_INITIAL, count);

  return (
    <section className="prv-section">
      <div className="prv-inner">

        {/* Header */}
        <div className="prv-header">
          <span className="prv-eyebrow">Customer Reviews</span>
          <h2 className="prv-title">
            We let our customers<br />
            <em>speak for us.</em>
          </h2>
          <p className="prv-subtitle">
            Real experiences from customers who made LumiVe part of their skincare ritual.
          </p>
        </div>

        {/* Rating summary */}
        <div className="prv-rating-bar">
          <div className="prv-stars-row">
            {[0,1,2,3,4].map((i) => (
              <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#111111">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
          <span className="prv-rating-label">Rated 4.9 / 5 by customers worldwide</span>
        </div>

        {/* Card grid */}
        <div className="prv-grid">
          {/* First 3 — always visible, never animated */}
          {staticCards.map((rev) => (
            <PrvCard key={rev.name} review={rev} />
          ))}

          {/* Paginated extras — cascade in 5 at a time */}
          <AnimatePresence>
            {extraCards.map((rev, i) => {
              const isNew    = i >= (batchStart - PRV_INITIAL);
              const batchIdx = isNew ? i - (batchStart - PRV_INITIAL) : 0;
              return (
                <PrvCard
                  key={rev.name}
                  review={rev}
                  animCustom={{
                    enterDelay: isNew ? batchIdx * 0.055 : 0,
                    exitDelay:  (extraCards.length - 1 - i) * 0.018,
                  }}
                />
              );
            })}
          </AnimatePresence>
        </div>

        {/* Buttons */}
        <div className="prv-btn-wrap">
          {hasMore && (
            <motion.button
              className="prv-btn"
              onClick={onShowMore}
              whileTap={{scale: 0.97}}
              transition={{duration: 0.15}}
            >
              Show more reviews
            </motion.button>
          )}
          {hasExtra && (
            <button className="prv-btn-less" onClick={onShowLess}>
              Show fewer reviews
            </button>
          )}
        </div>

      </div>
    </section>
  );
}

/* ── CONTACT ── */
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

          <p className="lm-ct-response">
            <span className="lm-ct-dot" />
            Response time: within 24 hours
          </p>
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
                <div className="lm-ct-field">
                  <label>Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </div>
                <div className="lm-ct-field">
                  <label>Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
                </div>
                <div className="lm-ct-field">
                  <label>Subject</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" />
                </div>
                <div className="lm-ct-field">
                  <label>Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Tell us more…" required />
                </div>
                <button type="submit" className="lm-ct-submit">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── GraphQL ── */
const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice { amount currencyCode }
    id
    image { __typename id url altText width height }
    price { amount currencyCode }
    product { title handle }
    selectedOptions { name value }
    sku title
    unitPrice { amount currencyCode }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id title vendor handle descriptionHtml description
    encodedVariantExistence encodedVariantAvailability
    images(first: 10) {
      nodes { id url altText width height }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant { ...ProductVariant }
        swatch { color image { previewImage { url } } }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) { ...ProductVariant }
    seo { description title }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode $handle: String!
    $language: LanguageCode $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...Product }
  }
  ${PRODUCT_FRAGMENT}
`;
