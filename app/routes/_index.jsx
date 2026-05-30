import {Link, useLoaderData} from 'react-router';
import {HomeReviews} from '~/components/HomeReviews';
import {WhyLumive} from '~/components/WhyLumive';

export const meta = () => [
  {title: 'Lumive Care — LED Skincare Technology'},
  {name: 'description', content: 'Clinically proven LED phototherapy for acne, anti-aging and radiance. 12 minutes a day.'},
];

export async function loader({context}) {
  const {products} = await context.storefront.query(FIRST_PRODUCT_QUERY);
  const handle = products?.nodes?.[0]?.handle ?? 'faceglow-mask';
  return {handle};
}

const FIRST_PRODUCT_QUERY = `#graphql
  query FirstProduct($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 1) { nodes { handle } }
  }
`;

const FEATURES = [
  {n: '89%', label: 'reduction in acne in 8 weeks'},
  {n: '12 min', label: 'per session, hands-free'},
  {n: '0 UV', label: 'safe for all skin types'},
];

export default function Homepage() {
  const {handle} = useLoaderData();
  return (
    <div className="lm-home">

      {/* ── HERO IMAGE ── */}
      <section className="lm-hero-fullimg">
        <img src="/images/poza-home-page.png" alt="Lumive FaceGlow LED Mask" />
      </section>

      {/* ── HERO TEXT ── */}
      <section className="lm-home-hero-text">
        <h1 className="lm-home-h1">Lumive FaceGlow Mask</h1>
        <p className="lm-home-sub">
          Clinically proven to reduce fine lines, clear acne and boost radiance in just 12 minutes a day.
        </p>
        <div className="lm-home-rating">
          <span className="lm-home-stars">★★★★★</span>
          <span className="lm-home-rating-text">4.9 · 181 reviews</span>
        </div>
        <Link to="/products" className="lm-home-cta">Get Lumive Collection</Link>
      </section>

      {/* ── DIVIDER ── */}
      <div className="lm-home-divider" />

      {/* ── PRODUCT SPOTLIGHT ── */}
      <section className="lm-spotlight">
        <div className="lm-spotlight-inner">
          <div className="lm-spotlight-img">
            <img
              src="/images/faceglow-mask-1.png"
              alt="Lumive FaceGlow Mask"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
          <div className="lm-spotlight-text">
            <p className="lm-hero-label">THE SCIENCE</p>
            <h2 className="lm-spotlight-title">Professional Results. At Home.</h2>
            <p className="lm-spotlight-desc">
              The Lumive FaceGlow Mask delivers clinical-grade LED phototherapy used by dermatologists worldwide — now available for your daily skincare routine.
            </p>
            <ul className="lm-spotlight-list">
              {[
                'Reduces acne by up to 89% in 8 weeks',
                'Visibly diminishes fine lines & wrinkles',
                'Improves skin tone, texture & radiance',
                'Safe for all skin types — 0 UV radiation',
              ].map((item) => (
                <li key={item}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9372C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/products" className="lm-hero-btn lm-hero-btn--primary" style={{display: 'inline-block', marginTop: '1.5rem'}}>
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>

      <WhyLumive />
      <HomeReviews />

    </div>
  );
}
