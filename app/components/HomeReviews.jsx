const RP = '/images/';
const RE = '/images/review-ochelari/';

const COLS = [
  // Column 1 — slowest
  [
    {name:'Emily Carter',     location:'New York, USA',        product:'FaceGlow Mask',            rating:5, photo:RP+'review-1.avif',   text:'After a few weeks my skin looks calmer and more radiant. It honestly feels like a professional treatment but at home. Nothing else has come close.'},
    {name:'Sofia Rossi',      location:'Milan, Italy',         product:'Under-Eye Therapy',         rating:5, photo:RE+'A6bc1d5f56cf24a55a4056a274f248346y.avif', text:'The Under-Eye Therapy became my evening ritual. It feels comfortable and easy and my under-eyes look noticeably more refreshed every morning.'},
    {name:'Clara Müller',     location:'Munich, Germany',      product:'FaceGlow Mask',            rating:5, photo:RP+'review-4.avif',   text:'The FaceGlow Mask feels premium from the first use. My skin looks smoother and more even. I love how simple it is to stay consistent with it.'},
    {name:'Mia Jensen',       location:'Copenhagen, Denmark',  product:'Under-Eye Therapy',         rating:5, photo:RE+'Ac78bfd18ddcd41b1ab745fc15710198eo.avif', text:'Dark circles were something I just accepted. After 5 weeks they\'re visibly lighter. My morning routine has completely changed.'},
    {name:'Olivia Harris',    location:'London, UK',           product:'FaceGlow Mask',            rating:5, photo:RP+'review-7.avif',   text:'My skin tone looks so much more even. I was sceptical but week 4 convinced me. Now it\'s the one thing in my routine I genuinely can\'t skip.'},
    {name:'Isabelle Moreau',  location:'Paris, France',        product:'Under-Eye Therapy',         rating:5, photo:RE+'S4e6e209f42914900982422ea802647efq.avif', text:'Very elegant product. Genuinely works. The puffiness I used to wake up with is just gone. My dermatologist asked what I changed.'},
    {name:'Amelia Brooks',    location:'Los Angeles, USA',     product:'FaceGlow Mask',            rating:5, photo:RP+'review-13.avif',  text:'I\'ve tried everything. This is the first thing that actually does what it promises. My skin looks healthier and more glowing every single week.'},
    {name:'Hannah Schneider', location:'Berlin, Germany',      product:'Under-Eye Therapy',         rating:4, photo:RE+'Adbd23a347d3e4a7ab4f5d2bebe728ad76.avif', text:'Took about 3 weeks to really notice but once I did I was sold. The area under my eyes looks so much less hollow and discoloured now.'},
  ],
  // Column 2 — medium
  [
    {name:'Sophia Bennett',   location:'Manchester, UK',       product:'FaceGlow Mask',            rating:5, photo:RP+'review-3.avif',   text:'week 2 i just stopped putting on as much foundation without even thinking about it. that\'s honestly the best sign. skin just looks better.'},
    {name:'Charlotte Dubois', location:'Lyon, France',         product:'Under-Eye Therapy',         rating:5, photo:RE+'Ad78cd72a8275442d89488ed0a0811927H.avif', text:'the warmth from the LEDs feels so relaxing. 10 minutes and i genuinely look rested even when i\'m not. became a habit i actually look forward to.'},
    {name:'Elena García',     location:'Barcelona, Spain',     product:'FaceGlow Mask',            rating:5, photo:RP+'review-6.avif',   text:'my husband noticed before i said anything. that\'s literally the only review you need. skin looks genuinely different in the best possible way.'},
    {name:'Emma Laurent',     location:'Bordeaux, France',     product:'Under-Eye Therapy',         rating:5, photo:RE+'Adae088c445d14022853939a24b8a1406Y.avif', text:'the hollow shadows under my eyes look so much less obvious. 4 weeks of consistent use and the difference is visible in photos. very impressed.'},
    {name:'Lily Thompson',    location:'Edinburgh, UK',        product:'FaceGlow Mask',            rating:5, photo:RP+'review-15.avif',  text:'my facialist asked what i was doing differently before i even brought it up. said sold out loud. skin is consistently better every single week.'},
    {name:'Anna Kowalski',    location:'Warsaw, Poland',       rating:5,                           product:'Under-Eye Therapy', photo:RE+'A5dc5b08add554bc6ae0d66d1b87dfcc3Z.avif', text:'fits perfectly, never slips, the LEDs feel warm and therapeutic. results took a few weeks but they\'re real and consistent.'},
    {name:'Grace Mitchell',   location:'Sydney, Australia',    product:'FaceGlow Mask',            rating:5, photo:RP+'review-8.avif',   text:'6 weeks in and my skin feels like it did when I was 26. I know that sounds dramatic but it\'s true. pores look smaller, tone more even.'},
    {name:'Lena Fischer',     location:'Vienna, Austria',      product:'Under-Eye Therapy',         rating:5, photo:RE+'S56accf436f5143058e94e114194acd71N.avif', text:'I\'ve spent so much on eye creams over the years. none of them did what this has done in 5 weeks. the area just looks healthier overall.'},
  ],
  // Column 3 — fastest
  [
    {name:'Zoe Walsh',        location:'Dublin, Ireland',      product:'FaceGlow Mask',            rating:5, photo:RP+'review-18.avif',  text:'the blue light for breakouts is genuinely doing something. skin feels cleaner without being stripped. 7 weeks and zero bad reactions.'},
    {name:'Freya Nielsen',    location:'Oslo, Norway',         product:'Under-Eye Therapy',         rating:5, photo:RE+'A90a0288e50264c7d94371769ada79077x.avif', text:'bought this after seeing it on a friend. the difference in her eyes was so obvious I didn\'t hesitate. mine are already better at week 3.'},
    {name:'Sara Lindström',   location:'Stockholm, Sweden',    product:'FaceGlow Mask',            rating:5, photo:RP+'review-16.avif',  text:'spent years trying to fix the lines around my eyes. this is actually doing something. genuinely can\'t believe it. consistent results every week.'},
    {name:'Céline Petit',     location:'Nantes, France',       product:'Under-Eye Therapy',         rating:5, photo:RE+'A23bf7045914540c186697f92d0a9487cw.avif', text:'minimal design, real results. 10 minutes while I read before bed. skin under my eyes looks genuinely different. simple as that.'},
    {name:'Hannah Smith',     location:'Toronto, Canada',      product:'FaceGlow Mask',            rating:4, photo:RP+'review-17.avif',  text:'sensitive skin here and it hasn\'t irritated me once. skin just looks calmer overall. less reactive, more balanced. really happy with it.'},
    {name:'Tess Visser',      location:'Amsterdam, Netherlands',product:'Under-Eye Therapy',        rating:5, photo:RE+'A965ac9ac97b2479c8d6086fa5eef9190m.avif', text:'not gonna lie i almost returned it after week 1. glad i didn\'t. week 4 the difference became obvious. now i wouldn\'t give it up.'},
    {name:'Margaux Simon',    location:'Toulouse, France',     product:'FaceGlow Mask',            rating:5, photo:RP+'review-19.avif',  text:'10 mins a day and my skin has changed more than from any serum I\'ve used. simple, it works, what more do you need.'},
    {name:'Bianca Ionescu',   location:'Bucharest, Romania',   product:'Under-Eye Therapy',         rating:5, photo:RE+'A497d6924b15b4df8bab4cac08b34a5667.avif', text:'zona ochilor arată complet diferit după 5 săptămâni. nu mai am nevoie de corector în fiecare dimineață. super mulțumită.'},
  ],
];

const SPEEDS = [44, 34, 26]; // seconds per column

function Stars({rating}) {
  return (
    <div className="hr-stars">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24"
          fill={i <= rating ? '#C9A96E' : 'rgba(0,0,0,0.12)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({r}) {
  return (
    <div className="hr-card">
      {r.photo && (
        <div className="hr-card-photo">
          <img src={r.photo} alt={r.name} loading="lazy" />
        </div>
      )}
      <div className="hr-card-body">
        <Stars rating={r.rating} />
        <p className="hr-card-text">{r.text}</p>
        <div className="hr-card-footer">
          <div>
            <span className="hr-card-name">{r.name}</span>
            <span className="hr-card-product">{r.product}</span>
          </div>
          <span className="hr-card-badge">
            <span className="hr-dot" />
            Verified
          </span>
        </div>
      </div>
    </div>
  );
}

function Column({reviews, speed, reverse}) {
  const doubled = [...reviews, ...reviews];
  return (
    <div className="hr-col-outer">
      <div
        className="hr-col-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        {doubled.map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
      </div>
    </div>
  );
}

export function HomeReviews() {
  return (
    <section className="hr-section">
      <div className="hr-header">
        <p className="hr-eyebrow">Customer Reviews</p>
        <h2 className="hr-title">We're proud of the results our customers achieve. That's why we let their experiences speak for us</h2>
        <p className="hr-sub">Real experiences from customers who made LumiveCare part of their daily ritual.</p>
      </div>

      <div className="hr-stage">
        <div className="hr-fade hr-fade--top" />
        <div className="hr-cols">
          <Column reviews={COLS[0]} speed={SPEEDS[0]} reverse={false} />
          <Column reviews={COLS[1]} speed={SPEEDS[1]} reverse={true} />
          <Column reviews={COLS[2]} speed={SPEEDS[2]} reverse={false} />
        </div>
        <div className="hr-fade hr-fade--bottom" />
      </div>
    </section>
  );
}
