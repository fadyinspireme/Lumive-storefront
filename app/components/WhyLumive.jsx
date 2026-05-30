const ROWS = [
  {feature: 'Clinical-grade LED technology',       lumive: true,  trad: false, spa: true  },
  {feature: 'Used at home, no appointments',       lumive: true,  trad: true,  spa: false },
  {feature: 'Visible results within weeks',        lumive: true,  trad: false, spa: true  },
  {feature: 'Safe for daily use',                  lumive: true,  trad: true,  spa: false },
  {feature: 'Dermatologist-inspired',              lumive: true,  trad: false, spa: true  },
  {feature: 'No irritation, no downtime',          lumive: true,  trad: false, spa: true  },
  {feature: 'Premium comfort & effortless ritual', lumive: true,  trad: false, spa: false },
  {feature: 'Long-term skin confidence support',   lumive: true,  trad: false, spa: false },
];

function Check() {
  return (
    <span className="wlt-check">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="#1A1714"/>
        <polyline points="6.5 12 10 15.5 17.5 8" stroke="#F6F1EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

function Cross() {
  return (
    <span className="wlt-cross">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.06)"/>
        <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" stroke="rgba(0,0,0,0.22)" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="15.5" y1="8.5" x2="8.5" y2="15.5" stroke="rgba(0,0,0,0.22)" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </span>
  );
}

export function WhyLumive() {
  return (
    <div className="wlt-section">
      <div className="wlt-inner">

        <div className="wlt-header">
          <p className="wlt-eyebrow">The Lumive Difference</p>
          <h2 className="wlt-title">Why Choose Lumive Care?</h2>
          <p className="wlt-sub">See how Lumive compares to the alternatives.</p>
        </div>

        <div className="wlt-scroll">
          <table className="wlt-table">
            <thead>
              <tr>
                <th className="wlt-th wlt-th-feat" />
                <th className="wlt-th wlt-th-lumive">
                  <div className="wlt-col-lumive">Lumive Care</div>
                </th>
                <th className="wlt-th">
                  <div className="wlt-col">Traditional<br/>Skincare</div>
                </th>
                <th className="wlt-th">
                  <div className="wlt-col">Spa<br/>Treatment</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="wlt-tr">
                  <td className="wlt-td wlt-td-feat">{r.feature}</td>
                  <td className="wlt-td wlt-td-lumive">{r.lumive ? <Check/> : <Cross/>}</td>
                  <td className="wlt-td">{r.trad ? <Check/> : <Cross/>}</td>
                  <td className="wlt-td">{r.spa ? <Check/> : <Cross/>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
