import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';

export function CartLineItem({layout, line, childrenMap}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();
  const lineItemChildren = childrenMap[id];
  const childrenLabelId = `cart-line-children-${id}`;

  return (
    <li key={id} className="cli">
      <div className="cli-inner">
        {/* Image */}
        <Link to={lineItemUrl} onClick={() => layout === 'aside' && close()} className="cli-img-wrap">
          {image ? (
            <Image alt={title} aspectRatio="1/1" data={image} height={90} width={90} className="cli-img" />
          ) : (
            <div className="cli-img-placeholder" />
          )}
        </Link>

        {/* Info */}
        <div className="cli-info">
          <div className="cli-top">
            <Link to={lineItemUrl} onClick={() => layout === 'aside' && close()} className="cli-name">
              {product.title}
            </Link>
            <span className="cli-price">
              {product.title.toLowerCase().includes('under-eye') || product.title.toLowerCase().includes('under eye')
                ? '$39.99'
                : <ProductPrice price={line?.cost?.totalAmount} />}
            </span>
          </div>

          <div className="cli-sold-badge">
            <span className="cli-bolt">⚡</span> Sold 3 times
          </div>

          <div className="cli-bottom">
            <CartLineQuantity line={line} />
          </div>
        </div>
      </div>

      {lineItemChildren ? (
        <div>
          <p id={childrenLabelId} className="sr-only">Line items with {product.title}</p>
          <ul aria-labelledby={childrenLabelId} className="cart-line-children">
            {lineItemChildren.map((childLine) => (
              <CartLineItem childrenMap={childrenMap} key={childLine.id} line={childLine} layout={layout} />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  );
}

function CartLineQuantity({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;

  return (
    <div className="cli-qty">
      <div className="cli-qty-controls">
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          <button className="cli-qty-btn" aria-label="Decrease" disabled={quantity <= 1 || !!isOptimistic}>
            −
          </button>
        </CartLineUpdateButton>
        <span className="cli-qty-num">{quantity}</span>
        <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
          <button className="cli-qty-btn" aria-label="Increase" disabled={!!isOptimistic}>
            +
          </button>
        </CartLineUpdateButton>
      </div>

      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm fetcherKey={getUpdateKey(lineIds)} route="/cart" action={CartForm.ACTIONS.LinesRemove} inputs={{lineIds}}>
      <button disabled={disabled} type="submit" className="cli-remove" aria-label="Remove item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({children, lines}) {
  const lineIds = lines.map((line) => line.id);
  return (
    <CartForm fetcherKey={getUpdateKey(lineIds)} route="/cart" action={CartForm.ACTIONS.LinesUpdate} inputs={{lines}}>
      {children}
    </CartForm>
  );
}

function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('~/components/CartMain').LineItemChildrenMap} LineItemChildrenMap */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('storefrontapi.generated').CartLineFragment} CartLineFragment */
