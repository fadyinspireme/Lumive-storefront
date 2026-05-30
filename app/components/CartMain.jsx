import {useOptimisticCart, CartForm} from '@shopify/hydrogen';
import {Link, useFetcher} from 'react-router';
import {useEffect, useRef, useState} from 'react';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
/**
 * Returns a map of all line items and their children.
 * @param {CartLine[]} lines
 * @return {import("C:/Users/PC/lumive-store/app/components/CartMain").LineItemChildrenMap}
 */
function getLineItemChildrenMap(lines) {
  const children = {};
  for (const line of lines) {
    if ('parentRelationship' in line && line.parentRelationship?.parent) {
      const parentId = line.parentRelationship.parent.id;
      if (!children[parentId]) children[parentId] = [];
      children[parentId].push(line);
    }
    if ('lineComponents' in line) {
      const children = getLineItemChildrenMap(line.lineComponents);
      for (const [parentId, childIds] of Object.entries(children)) {
        if (!children[parentId]) children[parentId] = [];
        children[parentId].push(...childIds);
      }
    }
  }
  return children;
}
/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;
  const childrenMap = getLineItemChildrenMap(cart?.lines?.nodes ?? []);

  const subtotal = parseFloat(cart?.cost?.subtotalAmount?.amount ?? 0);

  return (
    <section
      className={className}
      aria-label={layout === 'page' ? 'Cart page' : 'Cart drawer'}
    >
      <FreeShippingBar subtotal={subtotal} />
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <p id="cart-lines" className="sr-only">
          Line items
        </p>
        <div>
          <ul aria-labelledby="cart-lines">
            {(cart?.lines?.nodes ?? []).map((line) => {
              // we do not render non-parent lines at the root of the cart
              if (
                'parentRelationship' in line &&
                line.parentRelationship?.parent
              ) {
                return null;
              }
              return (
                <CartLineItem
                  key={line.id}
                  line={line}
                  layout={layout}
                  childrenMap={childrenMap}
                />
              );
            })}
          </ul>
        </div>
        {cartHasItems && <CartUpsell cartLines={cart?.lines?.nodes} />}
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </section>
  );
}

const FREE_SHIPPING_THRESHOLD = 39.99;

function FreeShippingBar({subtotal}) {
  const pct = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
  const unlocked = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="fsb">
      <p className="fsb-text">
        {unlocked ? (
          <>You&apos;re getting <strong>FREE shipping!</strong></>
        ) : (
          <>You&apos;re <strong>${remaining}</strong> away from <strong>FREE Shipping</strong></>
        )}
      </p>
      {!unlocked && (
        <div className="fsb-track">
          <div className="fsb-fill" style={{width: `${pct}%`}} />
        </div>
      )}
    </div>
  );
}

function GuaranteeBadge() {
  return (
    <div className="gb">
      <div className="gb-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
      <div className="gb-text">
        <p className="gb-title">30-Day Money Back Guarantee</p>
        <p className="gb-sub">Free replacement or refund if anything goes wrong.</p>
      </div>
      <div className="gb-check">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    </div>
  );
}

function CartUpsell({cartLines}) {
  const fetcher = useFetcher();
  const sliderRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (fetcher.state === 'idle' && !fetcher.data) {
      fetcher.load('/api/upsells');
    }
  }, [fetcher]);

  const inCartHandles = (cartLines ?? [])
    .map((l) => l.merchandise?.product?.handle)
    .filter(Boolean);

  const upsells = (fetcher.data?.upsells ?? []).filter(
    (p) =>
      p.variants.nodes[0]?.availableForSale &&
      !inCartHandles.includes(p.handle),
  );

  function onScroll() {
    if (!sliderRef.current || upsells.length < 2) return;
    const el = sliderRef.current;
    const idx = Math.round(el.scrollLeft / (el.scrollWidth / upsells.length));
    setActiveIdx(Math.min(idx, upsells.length - 1));
  }

  function goTo(i) {
    if (!sliderRef.current) return;
    const el = sliderRef.current;
    el.scrollTo({left: i * (el.scrollWidth / upsells.length), behavior: 'smooth'});
  }

  if (!upsells.length) return null;

  return (
    <div className="cu">
      <p className="cu-title">Frequently bought together</p>
      <div className="cu-slider" ref={sliderRef} onScroll={onScroll}>
        {upsells.map((product, i) => {
          const variant = product.variants.nodes[0];
          const price = product.priceRange.minVariantPrice;
          return (
            <div key={product.id} className={`cu-card${i === activeIdx ? ' cu-card--active' : ''}`}>
              <div className="cu-card-top">
                <div className="cu-img-wrap">
                  {product.featuredImage ? (
                    <img src={product.featuredImage.url} alt={product.title} className="cu-img" />
                  ) : (
                    <div className="cu-img-placeholder" />
                  )}
                </div>
                <div className="cu-info">
                  <p className="cu-name">{product.title}</p>
                  <p className="cu-price">
                    {parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                  </p>
                </div>
              </div>
              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.LinesAdd}
                inputs={{lines: [{merchandiseId: variant.id, quantity: 1}]}}
              >
                <button type="submit" className="cu-add">Add</button>
              </CartForm>
            </div>
          );
        })}
      </div>

      {upsells.length > 1 && (
        <div className="cu-dots">
          {upsells.map((_, i) => (
            <button
              key={i}
              className={`cu-dot${i === activeIdx ? ' cu-dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty({hidden = false}) {
  const {close} = useAside();
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link>
    </div>
  );
}

/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */
/** @typedef {{[parentId: string]: CartLine[]}} LineItemChildrenMap */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartLineItem').CartLine} CartLine */
