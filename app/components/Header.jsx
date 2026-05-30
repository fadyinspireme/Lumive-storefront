import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';

export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const {open} = useAside();
  return (
    <>
      <div className="lm-announce">
        Enjoy free shipping and returns on all orders →
      </div>
      <header className="lm-header">
        <button className="lm-mobile-menu-btn" onClick={() => open('mobile')} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <NavLink prefetch="intent" to="/" className="lm-logo" end>
          <span className="lm-logo-text">LUMIVE</span>
        </NavLink>

        <nav className="lm-nav" aria-label="Main navigation">
          <NavLink to="/collections/all" className="lm-nav-link">Shop</NavLink>
          <NavLink to="/collections" className="lm-nav-link">Explore</NavLink>
          <NavLink to="/pages/about" className="lm-nav-link">Learn</NavLink>
          <NavLink to="/collections/gifts" className="lm-nav-link">Gifts</NavLink>
        </nav>

        <div className="lm-header-actions">
          <button className="lm-header-icon" onClick={() => open('search')} aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          <NavLink to="/account" className="lm-header-icon" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </NavLink>
          <CartToggle cart={cart} />
        </div>
      </header>
    </>
  );
}

export function HeaderMenu({menu, primaryDomainUrl, viewport, publicStoreDomain}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();
  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink end onClick={close} prefetch="intent" style={activeLinkStyle} to="/">
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink className="header-menu-item" end key={item.id} onClick={close}
            prefetch="intent" style={activeLinkStyle} to={url}>
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function CartBadge({count}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();
  return (
    <a href="/cart" className="lm-header-icon lm-cart-btn"
      onClick={(e) => {
        e.preventDefault();
        open('cart');
        publish('cart_viewed', {cart, prevCart, shop, url: window.location.href || ''});
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {count !== null && count > 0 && (
        <span className="lm-cart-count">{count}</span>
      )}
    </a>
  );
}

function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}><CartBanner /></Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {id: 'gid://shopify/MenuItem/1', resourceId: null, tags: [], title: 'Shop', type: 'HTTP', url: '/collections/all', items: []},
    {id: 'gid://shopify/MenuItem/2', resourceId: null, tags: [], title: 'Explore', type: 'HTTP', url: '/collections', items: []},
    {id: 'gid://shopify/MenuItem/3', resourceId: null, tags: [], title: 'Learn', type: 'PAGE', url: '/pages/about', items: []},
    {id: 'gid://shopify/MenuItem/4', resourceId: null, tags: [], title: 'Gifts', type: 'HTTP', url: '/collections/gifts', items: []},
  ],
};

function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? '600' : undefined,
    color: isPending ? '#999' : '#1E1E1E',
  };
}
