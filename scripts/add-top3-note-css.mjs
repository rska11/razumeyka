import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../app/risovanie/drawing.css', import.meta.url);
let css = readFileSync(file, 'utf8');

const block = `

.drawing-rating-note {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  justify-content: center;
  border: 1px solid rgba(21,35,61,.08);
  border-radius: 28px;
  padding: 28px;
  color: #fff;
  background:
    radial-gradient(circle at 85% 12%, rgba(233,185,73,.26), transparent 30%),
    var(--draw-ink);
  box-shadow: 0 22px 58px rgba(21,35,61,.16);
}

.drawing-rating-note span {
  color: var(--draw-gold);
  font-family: Unbounded, sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.drawing-rating-note h3 {
  margin-top: 16px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(1.8rem, 3vw, 3rem);
  font-weight: 800;
  letter-spacing: -.04em;
  line-height: 1.05;
}

.drawing-rating-note p {
  margin-top: 14px;
  color: rgba(255,255,255,.62);
  font-size: 14px;
  font-weight: 650;
  line-height: 1.7;
}

.drawing-rating-note .drawing-gallery-more-link {
  margin-top: 24px;
  color: var(--draw-ink);
  background: var(--draw-gold);
}
`;

if (!css.includes('.drawing-rating-note')) {
  css += block;
}

writeFileSync(file, css);
