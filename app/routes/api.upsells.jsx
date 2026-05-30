export async function loader({context}) {
  const {storefront} = context;
  const {products} = await storefront.query(UPSELL_QUERY, {
    cache: storefront.CacheShort(),
  });
  return {upsells: products.nodes};
}

const UPSELL_QUERY = `#graphql
  query UpsellProducts {
    products(first: 10, query: "handle:the-lumive-serum-for-acne OR handle:the-lumive-aloe-vera-eye-mask") {
      nodes {
        id
        title
        handle
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 1) { nodes { id availableForSale } }
      }
    }
  }
`;
