import {Link, useParams} from 'react-router';

export const meta = ({params}) => {
  const title = POLICIES[params.handle]?.title ?? 'Policy';
  return [{title: `${title} — LumiVe`}];
};

export async function loader({params}) {
  if (!POLICIES[params.handle]) {
    throw new Response('Policy not found', {status: 404});
  }
  return {handle: params.handle};
}

export default function Policy() {
  const {handle} = useParams();
  const policy = POLICIES[handle];
  if (!policy) return null;

  return (
    <div className="lm-policy-page">
      <div className="lm-policy-hero">
        <Link to="/" className="lm-policy-back">← Back to site</Link>
        <p className="lm-policy-label">Legal</p>
        <h1 className="lm-policy-title">{policy.title}</h1>
        <p className="lm-policy-date">Last updated: {policy.lastUpdated}</p>
      </div>

      <div className="lm-policy-body">
        <div className="lm-policy-content">
          {policy.sections.map((section, i) => (
            <div key={i} className={`lm-policy-section${!section.heading ? ' lm-policy-section--intro' : ''}`}>
              {section.heading && <h2 className="lm-policy-h2">{section.heading}</h2>}
              {Array.isArray(section.body)
                ? section.body.map((para, j) => <p key={j} className="lm-policy-p">{para}</p>)
                : <p className={`lm-policy-p${!section.heading ? ' lm-policy-p--lead' : ''}`}>{section.body}</p>
              }
            </div>
          ))}
        </div>

        <div className="lm-policy-contact-box">
          <p className="lm-policy-contact-label">Questions?</p>
          <p className="lm-policy-contact-text">If you have any questions about our policies, reach out to our team directly.</p>
          <a href="mailto:support.lumive@gmail.com" className="lm-policy-contact-link">support.lumive@gmail.com</a>
        </div>
      </div>
    </div>
  );
}

const POLICIES = {
  'privacy-policy': {
    title: 'Privacy Policy',
    lastUpdated: 'May 29, 2026',
    sections: [
      {
        heading: null,
        body: 'At LumiveCare, we value your privacy and are committed to protecting your personal information.',
      },
      {
        heading: 'Information We Collect',
        body: [
          'Name',
          'Email address',
          'Shipping address',
          'Phone number (if provided)',
        ],
      },
      {
        heading: 'How We Use Your Information',
        body: [
          'Process and deliver your orders',
          'Provide customer support',
          'Communicate with you regarding your purchase',
          'Improve our services and customer experience',
        ],
      },
      {
        heading: 'Information Sharing',
        body: 'We do not sell your personal information. Your information may be shared only with trusted service providers necessary to operate our business, such as payment processors and shipping partners.',
      },
      {
        heading: 'Data Security',
        body: 'We take reasonable measures to protect your information and ensure secure transactions.',
      },
      {
        heading: 'Contact Us',
        body: 'If you have any questions regarding this Privacy Policy or your personal information, please contact us at support.lumive@gmail.com. Thank you for trusting LumiveCare.',
      },
    ],
  },

  'terms-of-service': {
    title: 'Terms of Service',
    lastUpdated: 'May 28, 2026',
    sections: [
      {
        heading: null,
        body: 'These terms govern your use of the LumiVe website and the purchase of our products. By shopping with us, you agree to the following. We have written them to be clear — not to protect us from you, but to set an honest foundation for the relationship.',
      },
      {
        heading: 'Using our website',
        body: [
          'You may use this site for personal, non-commercial purposes only.',
          'You agree not to misuse our platform — no scraping, no fraudulent orders, no attempts to interfere with our systems.',
          'All content on this site, including imagery, copy, and product design, belongs to LumiVe and may not be reproduced without our written permission.',
        ],
      },
      {
        heading: 'Orders and pricing',
        body: [
          'Prices are displayed in the applicable currency and do not include applicable local taxes or shipping fees, which are calculated at checkout.',
          'We do our best to keep product information accurate and up to date. In the rare case of a pricing error, we will contact you before fulfilling the order.',
          'We reserve the right to cancel or refuse any order at our discretion, including those that appear to be placed for resale.',
        ],
      },
      {
        heading: 'Product results',
        body: 'LED light therapy is clinically studied and our results are real — but skin is individual. Results vary from person to person. We stand behind our technology, which is why we offer a 30-day return right. What we cannot guarantee is that every individual outcome will be identical.',
      },
      {
        heading: 'Liability',
        body: 'LumiVe is not liable for indirect or consequential damages arising from the use of our products or website. Our responsibility is limited to the value of the product purchased. Nothing in these terms affects your statutory consumer rights.',
      },
      {
        heading: 'Governing law',
        body: 'These terms are governed by applicable law. Any disputes will first be addressed through direct communication — we prefer to resolve things together before anything more formal is needed.',
      },
      {
        heading: 'Changes',
        body: 'We may update these terms from time to time. When we do, we will revise the date above. Continued use of the site after any update constitutes acceptance.',
      },
    ],
  },

  'refund-policy': {
    title: 'Return & Refund Policy',
    lastUpdated: 'May 29, 2026',
    sections: [
      {
        heading: null,
        body: 'At LumiveCare, customer satisfaction is our priority. We stand behind the quality of our products and want you to shop with complete confidence.',
      },
      {
        heading: '30-Day Return Guarantee',
        body: 'If you are not completely satisfied with your purchase, you may return eligible items within 30 days of delivery for a refund or exchange.',
      },
      {
        heading: 'Return Eligibility',
        body: [
          'The item must be returned within 30 days of the delivery date.',
          'The product must be in its original condition.',
          'All original packaging, accessories, manuals, and included materials must be returned.',
          'The item must not show excessive signs of wear, damage, misuse, or alteration.',
        ],
      },
      {
        heading: 'Refund Process',
        body: [
          'Once your return has been received and inspected, we will notify you regarding the approval of your refund.',
          'Refunds will be issued to the original payment method.',
          'Processing times may vary depending on your payment provider.',
          'Shipping charges are non-refundable unless the return is due to a defective or incorrect item.',
        ],
      },
      {
        heading: 'Damaged or Incorrect Items',
        body: 'If your order arrives damaged, defective, or incorrect, please contact our support team as soon as possible. We will work quickly to resolve the issue and provide a replacement or refund where applicable.',
      },
      {
        heading: 'How to Start a Return',
        body: 'To initiate a return, please contact our customer support team with your order number and reason for return. Our team will provide detailed return instructions and assist you throughout the process. Email: support.lumive@gmail.com',
      },
      {
        heading: 'Our Commitment',
        body: 'At LumiveCare, we are committed to providing high-quality products and exceptional customer service. Our 30-day return policy is designed to ensure a worry-free shopping experience and complete peace of mind. For any questions regarding returns, refunds, or exchanges, please contact us at support.lumive@gmail.com',
      },
    ],
  },

  'shipping-policy': {
    title: 'Shipping Policy',
    lastUpdated: 'May 29, 2026',
    sections: [
      {
        heading: null,
        body: 'At LumiveCare, we are committed to delivering your order as quickly and efficiently as possible.',
      },
      {
        heading: 'Order Processing',
        body: 'Orders are typically processed within 1–2 business days after payment has been received. You will receive a confirmation email once your order has been placed and a shipping confirmation email when your order has been dispatched.',
      },
      {
        heading: 'Shipping Times',
        body: 'Estimated delivery time is typically 5–8 business days after your order has been shipped. Delivery times may vary depending on your location and local carrier operations.',
      },
      {
        heading: 'Tracking Information',
        body: 'Once your order has been shipped, you will receive tracking information via email so you can follow your package\'s journey.',
      },
      {
        heading: 'Delays',
        body: 'While we strive to ensure timely delivery, occasional delays may occur due to factors beyond our control, such as customs procedures, weather conditions, or carrier disruptions.',
      },
      {
        heading: 'Need Help?',
        body: 'If you have any questions regarding your shipment, please contact our support team at support.lumive@gmail.com. Thank you for choosing LumiveCare.',
      },
    ],
  },
};
