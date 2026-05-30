import {Link, useLoaderData} from 'react-router';
import {useState, useRef, useEffect} from 'react';

export const meta = () => [
  {title: 'Shop — LumiVe'},
  {name: 'description', content: 'Discover the LumiVe LED therapy collection. Clinically developed for radiant skin.'},
];

export async function loader({context}) {
  const {storefront} = context;
  const {products} = await storefront.query(PRODUCTS_QUERY);
  const allowed = products.nodes.filter((p) => {
    const t = p.title.toLowerCase();
    return t.includes('faceglow') || t.includes('face glow') || t.includes('under-eye') || t.includes('under eye');
  });
  return {shopifyProducts: allowed};
}

const PRODUCTS_QUERY = `#graphql
  query ShopProducts {
    products(first: 10) {
      nodes { id handle title priceRange { minVariantPrice { amount currencyCode } } }
    }
  }
`;

function getStatic(title) {
  const t = title.toLowerCase();
  if (t.includes('faceglow') || t.includes('face glow') || t.includes('mask')) {
    return {
      eyebrow: 'Full-Face LED Therapy',
      image: '/images/faceglow-mask-1.png',
      badges: ['504 LEDs', '7 Light Modes', '12 min / day'],
      desc: 'Clinical-grade LED phototherapy for the full face. Targets acne, fine lines, and uneven tone simultaneously.',
      rating: 4.5, reviews: 181, compare: '$249.99',
    };
  }
  if (t.includes('under-eye') || t.includes('under eye') || t.includes('eye therapy')) {
    return {
      forcedSlug: '/products/under-eye-therapy',
      eyebrow: 'Targeted Eye Therapy',
      image: '/images/eye-therapy-1.png',
      badges: ['Red + Infrared', '10 min / day', 'Zero UV'],
      desc: 'Precision LED therapy for dark circles, puffiness and fine lines. Engineered for the most delicate zone of the face.',
      rating: 4.8, reviews: 94, compare: '$49.99',
    };
  }
  if (t.includes('serum') || t.includes('acne')) {
    return {
      eyebrow: 'Acne Treatment',
      image: null,
      badges: ['Vitamin C', 'Niacinamide', 'Daily Use'],
      desc: 'Advanced serum formulated to target acne and blemishes for a clearer complexion.',
      rating: 4.7, reviews: 64, compare: null,
    };
  }
  if (t.includes('aloe') || t.includes('eye mask')) {
    return {
      eyebrow: 'Eye Care',
      image: null,
      badges: ['Aloe Vera', 'Cooling', 'Hydrating'],
      desc: 'Soothing aloe vera eye mask for puffiness and dark circles.',
      rating: 4.6, reviews: 43, compare: null,
    };
  }
  return {eyebrow: 'LED Therapy', image: null, badges: [], desc: '', rating: 5, reviews: 0, compare: null};
}

function Stars({rating}) {
  return (
    <span className="lm-stars">
      {[1,2,3,4,5].map((i) => {
        if (i <= Math.floor(rating)) return <span key={i} className="lm-star lm-star--full">★</span>;
        if (i - 0.5 <= rating) return <span key={i} className="lm-star lm-star--half">★</span>;
        return <span key={i} className="lm-star lm-star--empty">★</span>;
      })}
    </span>
  );
}

export default function ProductsIndex() {
  const {shopifyProducts} = useLoaderData();
  const [visible, setVisible] = useState(false);

  useEffect(() => { setVisible(true); }, []);

  const products = shopifyProducts.map((p) => {
    const s = getStatic(p.title);
    const price = p.priceRange.minVariantPrice;
    const isUnderEye = p.title.toLowerCase().includes('under-eye') || p.title.toLowerCase().includes('under eye');
    return {
      slug: s.forcedSlug ?? `/products/${p.handle}`,
      title: p.title,
      price: isUnderEye ? '$39.99 USD' : `${parseFloat(price.amount).toFixed(2)} ${price.currencyCode}`,
      eyebrow: s.eyebrow ?? 'LED Therapy',
      image: s.image ?? null,
      badges: s.badges ?? [],
      desc: s.desc ?? '',
      rating: s.rating ?? 5,
      reviews: s.reviews ?? 0,
      compare: s.compare ?? null,
    };
  });

  return (
    <div className="lm-shop-page">
      <div className={`lm-shop-header${visible ? ' lm-shop-header--visible' : ''}`}>
        <p className="lm-shop-eyebrow">The Collection</p>
        <h1 className="lm-shop-title">Choose Your Ritual.</h1>
        <p className="lm-shop-sub">Two devices. One philosophy — clinically developed LED therapy for skin that remembers its own light.</p>
      </div>

      <div className="lm-shop-grid">
        {products.map((p, i) => (
          <Link
            key={p.slug}
            to={p.slug}
            className={`lm-shop-card${visible ? ' lm-shop-card--visible' : ''}`}
            style={{'--delay': `${i * 0.18}s`}}
          >
            <div className="lm-shop-card-img-wrap">
              {p.image && <img src={p.image} alt={p.title} className="lm-shop-card-img" />}
              <div className="lm-shop-card-badges">
                {p.badges.map((b) => (
                  <span key={b} className="lm-shop-card-badge">{b}</span>
                ))}
              </div>
            </div>
            <div className="lm-shop-card-body">
              <p className="lm-shop-card-eyebrow">{p.eyebrow}</p>
              <h2 className="lm-shop-card-title">{p.title}</h2>
              <p className="lm-shop-card-desc">{p.desc}</p>
              <div className="lm-shop-card-rating">
                <Stars rating={p.rating} />
                <span className="lm-shop-card-reviews">{p.reviews} reviews</span>
              </div>
              <div className="lm-shop-card-footer">
                <div className="lm-shop-card-price">
                  {p.compare && <span className="lm-shop-card-compare">{p.compare}</span>}
                  <span className="lm-shop-card-sale">{p.price}</span>
                </div>
                <span className="lm-shop-card-cta">Shop Now →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
