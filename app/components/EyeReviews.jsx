import {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

const P = '/images/review-ochelari/';

/* Images grouped by upload session (same seconds = same customer) */
const EYE_REVIEWS = [
  // Session A: i1+i2+i3 uploadate la 11:15:44-59 — same customer
  {name:'Sophie L.',        location:'Paris, France',         rating:5,
   photos:[P+'A6bc1d5f56cf24a55a4056a274f248346y.avif', P+'Ac78bfd18ddcd41b1ab745fc15710198eo.avif', P+'S4e6e209f42914900982422ea802647efq.avif'],
   review:'ok so i genuinely did not expect this to work but 3 weeks in and the puffiness i wake up with is just... gone? like i have to check twice in the mirror now', skinType:'Sensitive skin', duration:'3 Weeks'},

  // Session B: i4 solo — eye close-up
  {name:'Emma R.',          location:'London, UK',            rating:5,
   photos:[P+'Adbd23a347d3e4a7ab4f5d2bebe728ad76.avif'],
   review:'my partner asked what i did to my eyes before i even mentioned this. that was week 4. best possible review i can give honestly', skinType:'Normal skin', duration:'4 Weeks'},

  // Session B: i5+i10 — packaging photos, separate review
  {name:'Charlotte P.',     location:'Edinburgh, UK',         rating:5,
   photos:[P+'Ad78cd72a8275442d89488ed0a0811927H.avif', P+'A5d5e81c76de2481cb36c88bc544b4b09g.avif'],
   review:'unboxing this felt premium. packaging is beautiful and the device feels really well made. results after 3 weeks are already visible', skinType:'Combination', duration:'3 Weeks'},

  // Session C split: i6+i7 — first customer
  {name:'Giulia M.',        location:'Milan, Italy',          rating:5,
   photos:[P+'Adae088c445d14022853939a24b8a1406Y.avif', P+'Abaec26b01fc04b4c953266b99724f8679.avif'],
   review:'the dark circles i\'ve had since my 20s look so much lighter. not completely gone but genuinely different. wearing less concealer now which says everything', skinType:'Combination', duration:'5 Weeks'},

  // Session C split: i8+i9 — second customer
  {name:'Lena F.',          location:'Munich, Germany',       rating:5,
   photos:[P+'Ad1e6a875e13348a290b2a86eda92118ai.avif', P+'A5dc5b08add554bc6ae0d66d1b87dfcc3Z.avif'],
   review:'was skeptical, still kind of am tbh but my under eye area looks way better so... yeah it works lol', skinType:'Dry skin', duration:'6 Weeks'},

  // Session D: i11+i12+i13 uploadate la 11:16:50-17:02 — same customer
  {name:'Sofia R.',         location:'Barcelona, Spain',      rating:4,
   photos:[P+'S56accf436f5143058e94e114194acd71N.avif', P+'A90a0288e50264c7d94371769ada79077x.avif', P+'A23bf7045914540c186697f92d0a9487cw.avif'],
   review:'comfortable to wear, looks sleek, and after 4 weeks my eyes look less hollow. ordered one for my mum too', skinType:'Normal skin', duration:'4 Weeks'},

  // Session E: i14+i15 uploadate la 11:17:09-17 — same customer
  {name:'Astrid L.',        location:'Stockholm, Sweden',     rating:5,
   photos:[P+'A965ac9ac97b2479c8d6086fa5eef9190m.avif', P+'A497d6924b15b4df8bab4cac08b34a5667.avif'],
   review:'10 mins a night while i watch something and after 5 weeks my skin under my eyes looks genuinely different. less tired. more... me i guess', skinType:'Sensitive skin', duration:'5 Weeks'},

  // Session F: i16+i17+i18 uploadate la 11:17:29-40 — same customer
  {name:'Nathalie D.',      location:'Brussels, Belgium',     rating:5,
   photos:[P+'A87f1275557f84bd0b1b5301ed261901ap.avif', P+'A0a054b0cd7934f64a6362b455122b069t.avif', P+'Seb9e27e4d729491cbd3d034330a4a680z.avif'],
   review:'i\'ve tried every eye cream out there. this is the first thing that has actually done something visible. kind of annoyed it took me so long to find it', skinType:'Mature skin', duration:'7 Weeks'},

  // Session G: i19+i20+i21 — same customer (3 photos)
  {name:'Olivia H.',        location:'Vienna, Austria',       rating:5,
   photos:[P+'S17f1ef5bd49f4340a22074017305c0dfX.avif', P+'A81b14be4f6304b8c9ab0fd1a54b76644P.avif', P+'A5e4e799a79014474bda222ff2e94d996O.avif'],
   review:'the puffiness every morning was ruining my confidence honestly. 6 weeks of this and it\'s just not there anymore. actually look awake now', skinType:'Combination', duration:'6 Weeks'},

  // Session G: i22 — solo
  {name:'Clara M.',         location:'Zurich, Switzerland',   rating:4,
   photos:[P+'A3cdb641f6a974c9caf6e5155f8438cb34.avif'],
   review:'fits perfectly, doesn\'t slip, and the warmth feels really nice. results took a few weeks but they\'re real. my eye area just looks healthier', skinType:'Dry skin', duration:'5 Weeks'},

  // Session H: i23+i24+i25 uploadate la 11:18:20-31 — same customer
  {name:'Isabelle F.',      location:'Lyon, France',          rating:5,
   photos:[P+'A8c196d79b687483e99adad354bb5b211m.avif', P+'A25143dae046746e59a44938a698cebbey.avif', P+'A46ed2f399b1d46959a7263e38093de2f1.avif'],
   review:'my facialist noticed before i mentioned it. that\'s the only thing i needed to hear. genuinely impressed', skinType:'Sensitive skin', duration:'8 Weeks'},

  // Session I split: i26+i27 — first customer
  {name:'Hannah B.',        location:'Berlin, Germany',       rating:5,
   photos:[P+'Sd72676a2e22e4c6199776fac554b3792d.avif', P+'S68d70b8aa79d4f7f8088c81ff6866f5dT.avif'],
   review:'not gonna lie i bought this thinking it probably wouldn\'t do much. 5 weeks later the hollowness under my eyes looks way less severe. shocked', skinType:'Normal skin', duration:'5 Weeks'},

  // Session I split: i28+i29 — second customer
  {name:'Valentina G.',     location:'Rome, Italy',           rating:5,
   photos:[P+'S1399b01900994bbb87626381048fd2eac.avif', P+'S9b056d83766b445ea5464db8b732e0eaC.avif'],
   review:'the design alone is worth it but the fact that it actually reduces puffiness too?? obsessed. use it every night without fail now', skinType:'Oily skin', duration:'4 Weeks'},

  // Session J: solo
  {name:'Elena M.',         location:'Turin, Italy',          rating:5,
   photos:[P+'S9940bfb15faf4a5abbb3e55e2f9e715ey.avif'],
   review:'after 6 weeks i look in the mirror and my eyes look 5 years younger. i know that sounds dramatic but it\'s genuinely how i feel. love this thing', skinType:'Sensitive skin', duration:'6 Weeks'},

  // Additional reviews
  {name:'Margot D.',        location:'Toulouse, France',      rating:5,
   photos:[P+'A6bc1d5f56cf24a55a4056a274f248346y.avif'],
   review:'i was already sceptical about LED devices but this changed my mind. after 4 weeks my under eyes look genuinely less tired. even on bad sleep days', skinType:'Normal skin', duration:'4 Weeks'},

  {name:'Freya K.',         location:'Oslo, Norway',          rating:5,
   photos:[P+'Ac78bfd18ddcd41b1ab745fc15710198eo.avif'],
   review:'bought this after seeing it on a friend. the difference in her eyes was so obvious i didn\'t even hesitate. mine are already looking better at week 3', skinType:'Dry skin', duration:'3 Weeks'},

  {name:'Ines M.',          location:'Seville, Spain',        rating:4,
   photos:[P+'S4e6e209f42914900982422ea802647efq.avif'],
   review:'very comfortable, easy to use, and results are real. my mum noticed before i told her. that\'s honestly all you need to know', skinType:'Combination', duration:'5 Weeks'},

  {name:'Laura B.',         location:'Düsseldorf, Germany',   rating:5,
   photos:[P+'Adbd23a347d3e4a7ab4f5d2bebe728ad76.avif'],
   review:'10 minutes before bed and i actually look forward to it now. week 5 and colleagues keep asking if i\'ve changed something. i just smile', skinType:'Sensitive skin', duration:'5 Weeks'},

  {name:'Joanna W.',        location:'Warsaw, Poland',        rating:5,
   photos:[P+'A5dc5b08add554bc6ae0d66d1b87dfcc3Z.avif'],
   review:'honestly wasn\'t sure at first but 6 weeks later the dark circles that have been there since uni are actually lighter. can\'t believe it took me this long', skinType:'Normal skin', duration:'6 Weeks'},

  {name:'Cécile R.',        location:'Strasbourg, France',    rating:5,
   photos:[P+'S56accf436f5143058e94e114194acd71N.avif'],
   review:'the packaging is beautiful and the product performs. my under eyes look so much more rested. worth every penny and i don\'t say that lightly', skinType:'Oily skin', duration:'7 Weeks'},

  {name:'Sara L.',          location:'Valencia, Spain',       rating:4,
   photos:[P+'A90a0288e50264c7d94371769ada79077x.avif'],
   review:'puffiness is basically gone. i use it while watching tv in the evenings. very easy to fit in and the results are genuinely there after a few weeks', skinType:'Dry skin', duration:'4 Weeks'},

  {name:'Maja P.',          location:'Ljubljana, Slovenia',   rating:5,
   photos:[P+'A23bf7045914540c186697f92d0a9487cw.avif'],
   review:'i\'ve spent so much on eye creams. none of them did what this has done in 5 weeks. the area looks so much lighter and less puffy', skinType:'Sensitive skin', duration:'5 Weeks'},

  {name:'Tess V.',          location:'Utrecht, Netherlands',  rating:5,
   photos:[P+'A965ac9ac97b2479c8d6086fa5eef9190m.avif'],
   review:'simple routine, real results. i put it on, watch a show, take it off. 4 weeks in and the hollowness under my eyes is noticeably better', skinType:'Combination', duration:'4 Weeks'},

  {name:'Rebecca J.',       location:'Bristol, UK',           rating:5,
   photos:[P+'A497d6924b15b4df8bab4cac08b34a5667.avif'],
   review:'i was gifted this and had zero expectations. 7 weeks later my skin under my eyes looks completely different. i now recommend it to literally everyone', skinType:'Normal skin', duration:'7 Weeks'},

  {name:'Hanna S.',         location:'Helsinki, Finland',     rating:4,
   photos:[P+'A87f1275557f84bd0b1b5301ed261901ap.avif'],
   review:'my under eyes look so much more even now. i used to layer concealer every morning and i\'ve basically stopped. that tells you everything', skinType:'Dry skin', duration:'6 Weeks'},

  {name:'Alicia M.',        location:'Marseille, France',     rating:5,
   photos:[P+'A0a054b0cd7934f64a6362b455122b069t.avif'],
   review:'the device is beautifully made and actually works. skin looks healthier, dark circles lighter, puffiness gone. i use it every single night', skinType:'Oily skin', duration:'5 Weeks'},

  {name:'Katrien V.',       location:'Ghent, Belgium',        rating:5,
   photos:[P+'Seb9e27e4d729491cbd3d034330a4a680z.avif'],
   review:'not gonna lie i almost returned it after week 1. glad i didn\'t. week 4 the difference became obvious and now i wouldn\'t give it up for anything', skinType:'Sensitive skin', duration:'6 Weeks'},

  {name:'Marta G.',         location:'Madrid, Spain',         rating:5,
   photos:[P+'S17f1ef5bd49f4340a22074017305c0dfX.avif'],
   review:'bought this on a whim. it\'s now the one thing in my routine i genuinely can\'t skip. eyes look rested, puffiness gone. 100% recommend', skinType:'Normal skin', duration:'5 Weeks'},

  {name:'Lara H.',          location:'Bern, Switzerland',     rating:4,
   photos:[P+'A81b14be4f6304b8c9ab0fd1a54b76644P.avif'],
   review:'clean design, does exactly what it says. my dermatologist noticed an improvement at my last appointment which is the only confirmation i needed', skinType:'Combination', duration:'8 Weeks'},

  {name:'Nicole F.',        location:'Lyon, France',          rating:5,
   photos:[P+'A5e4e799a79014474bda222ff2e94d996O.avif'],
   review:'i have really sensitive eyes and this has never irritated me once. 6 weeks of zero issues and visible improvement. rare combination honestly', skinType:'Sensitive skin', duration:'6 Weeks'},

  {name:'Anna K.',          location:'Krakow, Poland',        rating:5,
   photos:[P+'A3cdb641f6a974c9caf6e5155f8438cb34.avif'],
   review:'the before and after difference in photos is so clear. i look genuinely more awake without any makeup on. this device changed my morning routine completely', skinType:'Normal skin', duration:'7 Weeks'},

  {name:'Simone B.',        location:'Rotterdam, Netherlands',rating:5,
   photos:[P+'A8c196d79b687483e99adad354bb5b211m.avif'],
   review:'extremely happy with this. the puffiness i always wake up with just isn\'t there anymore. took about 3 weeks to notice but once i did i was sold', skinType:'Dry skin', duration:'5 Weeks'},

  {name:'Elina R.',         location:'Riga, Latvia',          rating:4,
   photos:[P+'A25143dae046746e59a44938a698cebbey.avif'],
   review:'works exactly as described. comfortable fit, genuine results. my partner said my eyes look more awake before i even told him i was using it', skinType:'Oily skin', duration:'4 Weeks'},

  {name:'Vera O.',          location:'Vienna, Austria',       rating:5,
   photos:[P+'A46ed2f399b1d46959a7263e38093de2f1.avif'],
   review:'i\'ve been using this for 2 months now and the improvement is consistent. doesn\'t plateau. skin just keeps looking better week after week', skinType:'Sensitive skin', duration:'8 Weeks'},

  {name:'Linh T.',          location:'Paris, France',         rating:5,
   photos:[P+'Sd72676a2e22e4c6199776fac554b3792d.avif'],
   review:'the hyperpigmentation under my eyes has faded noticeably. i\'m mixed race and finding something that works for my skin tone is hard. this actually does', skinType:'Combination', duration:'6 Weeks'},

  {name:'Zara B.',          location:'London, UK',            rating:5,
   photos:[P+'S68d70b8aa79d4f7f8088c81ff6866f5dT.avif'],
   review:'thought it was just hype. it\'s not. 5 weeks in and my under eyes look years younger. i\'ve genuinely stopped buying eye cream', skinType:'Normal skin', duration:'5 Weeks'},

  {name:'Petra H.',         location:'Prague, Czech Republic',rating:4,
   photos:[P+'S1399b01900994bbb87626381048fd2eac.avif'],
   review:'very well made product. took about 4 weeks to really see results but they\'re consistent and real. my skin looks calmer and more even overall', skinType:'Dry skin', duration:'6 Weeks'},

  {name:'Isabel C.',        location:'Porto, Portugal',       rating:5,
   photos:[P+'S9b056d83766b445ea5464db8b732e0eaC.avif'],
   review:'ordered this after months of research. zero regrets. the quality is exceptional and the results speak for themselves. use it every single day', skinType:'Normal skin', duration:'5 Weeks'},

  {name:'Amélie G.',        location:'Bordeaux, France',      rating:5,
   photos:[P+'A6bc1d5f56cf24a55a4056a274f248346y.avif'],
   review:'this is the first skincare product that\'s actually made my partner ask what i changed. not subtle. real, visible difference in under 4 weeks', skinType:'Oily skin', duration:'4 Weeks'},

  {name:'Sanna L.',         location:'Tampere, Finland',      rating:5,
   photos:[P+'Ac78bfd18ddcd41b1ab745fc15710198eo.avif'],
   review:'the dark circles i inherited from my mum are finally fading. i genuinely didn\'t think anything would work. 6 weeks and i\'m proven wrong in the best way', skinType:'Sensitive skin', duration:'6 Weeks'},

  {name:'Tina V.',          location:'Ljubljana, Slovenia',   rating:4,
   photos:[P+'S4e6e209f42914900982422ea802647efq.avif'],
   review:'compact, elegant, effective. i travel a lot and this fits in any bag. my eyes always look rested now even when i\'m running on 5 hours sleep', skinType:'Combination', duration:'5 Weeks'},

  {name:'Bianca L.',        location:'Bucharest, Romania',    rating:5,
   photos:[P+'A90a0288e50264c7d94371769ada79077x.avif'],
   review:'zona din jurul ochilor arată complet diferit față de acum 6 săptămâni. nu mai am nevoie de corector în fiecare dimineață. absolut mulțumită',  skinType:'Normal skin', duration:'6 Weeks'},

  {name:'Claire M.',        location:'Brussels, Belgium',     rating:5,
   photos:[P+'A23bf7045914540c186697f92d0a9487cw.avif'],
   review:'i was buying £80 eye serums before this. none of them did anything close to what this device does in 5 weeks. feel slightly foolish honestly. very good product', skinType:'Dry skin', duration:'5 Weeks'},

  {name:'Sofia J.',         location:'Stockholm, Sweden',     rating:5,
   photos:[P+'A965ac9ac97b2479c8d6086fa5eef9190m.avif'],
   review:'minimal effort, maximum results. 10 minutes is nothing. my skin under my eyes looks younger, healthier and i get more sleep comments than ever before', skinType:'Sensitive skin', duration:'7 Weeks'},
];

const PRV_VARIANTS = {
  hidden: (c) => ({
    opacity: 0, y: -42, rotateX: -16, scale: 0.91, transformPerspective: 900,
    transition: {duration: 0.44, delay: c?.exitDelay ?? 0, ease: [0.4, 0, 0.2, 1]},
  }),
  visible: (c) => ({
    opacity: 1, y: 0, rotateX: 0, scale: 1, transformPerspective: 900,
    transition: {duration: 0.68, delay: c?.enterDelay ?? 0, ease: [0.22, 1, 0.36, 1]},
  }),
};

const PRV_INITIAL = 3;
const PRV_BATCH   = 5;

function StarRow() {
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

function EyeCard({review, animCustom}) {
  const photos = review.photos || [];
  const main   = photos[0];
  const extra  = photos.slice(1);

  const inner = (
    <div className="prv-card">
      {photos.length > 0 && (
        <div className={`prv-card-photo-wrap eye-photos-${Math.min(photos.length, 3)}`}>
          {photos.slice(0, 3).map((src, i) => (
            <img key={i} src={src} alt={i === 0 ? review.name : ''} className="prv-card-photo" loading="lazy" />
          ))}
        </div>
      )}
      <StarRow />
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

export function EyeReviewsSection() {
  const [count, setCount]           = useState(PRV_INITIAL);
  const [batchStart, setBatchStart] = useState(PRV_INITIAL);

  const hasMore  = count < EYE_REVIEWS.length;
  const hasExtra = count > PRV_INITIAL;

  const onShowMore = () => {
    setBatchStart(count);
    setCount((c) => Math.min(c + PRV_BATCH, EYE_REVIEWS.length));
  };

  const onShowLess = () => {
    setBatchStart(PRV_INITIAL);
    setCount(PRV_INITIAL);
  };

  const staticCards = EYE_REVIEWS.slice(0, PRV_INITIAL);
  const extraCards  = EYE_REVIEWS.slice(PRV_INITIAL, count);

  return (
    <section className="prv-section">
      <div className="prv-inner">

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

        <div className="prv-grid">
          {staticCards.map((rev) => (
            <EyeCard key={rev.name} review={rev} />
          ))}
          <AnimatePresence>
            {extraCards.map((rev, i) => {
              const isNew    = i >= (batchStart - PRV_INITIAL);
              const batchIdx = isNew ? i - (batchStart - PRV_INITIAL) : 0;
              return (
                <EyeCard
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
