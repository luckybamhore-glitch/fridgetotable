import React from 'react';
import { motion } from 'motion/react';

/**
 * Animated cartoon chef holding a pizza peel / frypan.
 * - Whole chef gently floats
 * - Pan tilts side-to-side like tossing
 * - Pizza bounces off the pan on a loop (the "toss")
 * - Steam curls rise, ok-hand waves, eyes blink
 */
export default function ChefIllustration() {
  return (
    <div className="chef-stage">
      {/* soft blob behind chef */}
      <div className="chef-blob" />

      {/* floating sparkles / leaves around */}
      <motion.span
        className="chef-particle p1"
        animate={{ y: [0, -14, 0], rotate: [0, 20, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        ✨
      </motion.span>
      <motion.span
        className="chef-particle p2"
        animate={{ y: [0, -18, 0], rotate: [0, -18, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      >
        🍅
      </motion.span>
      <motion.span
        className="chef-particle p3"
        animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        🌿
      </motion.span>
      <motion.span
        className="chef-particle p4"
        animate={{ y: [0, -16, 0], scale: [1, 1.25, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      >
        🧀
      </motion.span>

      {/* tossed toppings that pop up from the pan */}
      <motion.span
        className="toss-bit t1"
        animate={{ y: [0, -64, 0], x: [0, -18, 0], opacity: [0, 1, 0], rotate: [0, 120, 220] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        🫑
      </motion.span>
      <motion.span
        className="toss-bit t2"
        animate={{ y: [0, -78, 0], x: [0, 14, 0], opacity: [0, 1, 0], rotate: [0, -140, -260] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.35 }}
      >
        🍕
      </motion.span>
      <motion.span
        className="toss-bit t3"
        animate={{ y: [0, -58, 0], x: [0, 26, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
      >
        🍅
      </motion.span>

      {/* whole chef float */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <svg viewBox="0 0 440 460" className="chef-svg" role="img" aria-label="Happy chef tossing pizza in a pan">
          <defs>
            <linearGradient id="coatGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#eef0f4" />
            </linearGradient>
            <linearGradient id="panGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e8a34c" />
              <stop offset="100%" stopColor="#b96a1b" />
            </linearGradient>
            <linearGradient id="cheeseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe08a" />
              <stop offset="100%" stopColor="#f5b942" />
            </linearGradient>
          </defs>

          {/* backdrop ring */}
          <ellipse cx="220" cy="230" rx="168" ry="180" fill="none" stroke="#1f2937" strokeWidth="3" opacity="0.85" />
          <ellipse cx="220" cy="408" rx="110" ry="18" fill="#1f2937" opacity="0.08" />

          {/* steam curls */}
          {[
            'M148 210 C 132 180, 168 168, 152 138 C 142 118, 160 104, 172 92',
            'M182 222 C 168 192, 204 180, 188 150 C 178 130, 198 116, 208 104',
            'M318 300 C 330 270, 300 258, 314 230 C 322 212, 308 200, 302 190',
          ].map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke="#9aa3b2"
              strokeWidth="5"
              strokeLinecap="round"
              opacity={0.55}
              initial={{ pathLength: 0.4 }}
              animate={{ y: [0, -8, 0], opacity: [0.25, 0.65, 0.25] }}
              transition={{ duration: 2.6 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
            />
          ))}

          {/* left arm + handle behind pan */}
          <motion.g
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '150px', originY: '300px' }}
          >
            <rect x="52" y="268" width="96" height="18" rx="9" fill="#9a5a21" transform="rotate(-18 52 268)" />
            {/* hand gripping */}
            <circle cx="148" cy="292" r="26" fill="#f2b88a" stroke="#1f2937" strokeWidth="3" />
            <circle cx="148" cy="292" r="26" fill="none" stroke="#1f2937" strokeWidth="3" opacity="0.15" />
          </motion.g>

          {/* body / coat */}
          <path
            d="M120 300 C 110 360, 130 420, 220 424 C 310 420, 330 360, 320 300 L 280 250 L 160 250 Z"
            fill="url(#coatGrad)"
            stroke="#1f2937"
            strokeWidth="3.5"
          />
          {/* coat buttons */}
          <circle cx="212" cy="300" r="5" fill="#1f2937" />
          <circle cx="212" cy="330" r="5" fill="#1f2937" />
          <circle cx="212" cy="360" r="5" fill="#1f2937" />
          {/* coat fold lines */}
          <path d="M190 250 L 205 300 L 195 420" fill="none" stroke="#cbd2dc" strokeWidth="3" strokeLinecap="round" />
          <path d="M250 250 L 238 300 L 248 420" fill="none" stroke="#cbd2dc" strokeWidth="3" strokeLinecap="round" />

          {/* neckerchief */}
          <path d="M186 244 C 200 272, 196 300, 182 322 L 168 306 C 178 288, 180 266, 176 248 Z" fill="#16a34a" stroke="#1f2937" strokeWidth="3" />
          <path d="M254 244 C 244 274, 250 302, 266 322 L 278 304 C 268 288, 264 266, 264 248 Z" fill="#dc2626" stroke="#1f2937" strokeWidth="3" />
          <ellipse cx="220" cy="248" rx="22" ry="12" fill="#f2b88a" stroke="#1f2937" strokeWidth="3" />

          {/* head */}
          <ellipse cx="220" cy="168" rx="72" ry="78" fill="#f7c9a0" stroke="#1f2937" strokeWidth="3.5" />
          {/* ears */}
          <circle cx="150" cy="172" r="14" fill="#f7c9a0" stroke="#1f2937" strokeWidth="3" />
          <circle cx="290" cy="172" r="14" fill="#f7c9a0" stroke="#1f2937" strokeWidth="3" />

          {/* chef hat */}
          <motion.g
            animate={{ rotate: [-2, 2, -2], y: [0, -3, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '220px', originY: '110px' }}
          >
            <ellipse cx="220" cy="72" rx="86" ry="52" fill="#ffffff" stroke="#1f2937" strokeWidth="3.5" />
            <ellipse cx="168" cy="66" rx="30" ry="30" fill="#ffffff" stroke="#1f2937" strokeWidth="3" />
            <ellipse cx="272" cy="66" rx="30" ry="30" fill="#ffffff" stroke="#1f2937" strokeWidth="3" />
            <rect x="164" y="88" width="112" height="30" rx="10" fill="#ffffff" stroke="#1f2937" strokeWidth="3.5" />
          </motion.g>

          {/* brows */}
          <path d="M172 138 L 202 132" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
          <path d="M238 132 L 268 138" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
          {/* eyes (blink) */}
          <motion.g
            animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
            transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.92, 0.95, 0.98, 1] }}
            style={{ originX: '220px', originY: '158px' }}
          >
            <ellipse cx="188" cy="158" rx="10" ry="12" fill="#1f2937" />
            <ellipse cx="252" cy="158" rx="10" ry="12" fill="#1f2937" />
            <circle cx="191" cy="154" r="3.4" fill="#fff" />
            <circle cx="255" cy="154" r="3.4" fill="#fff" />
          </motion.g>
          {/* nose + smile */}
          <ellipse cx="220" cy="182" rx="14" ry="11" fill="#eaa573" stroke="#1f2937" strokeWidth="2.5" />
          <path d="M196 202 Q 220 222, 244 202" fill="none" stroke="#1f2937" strokeWidth="4" strokeLinecap="round" />
          {/* big mustache */}
          <motion.path
            d="M186 196 C 170 210, 176 228, 196 226 C 206 225, 212 214, 220 212 C 228 214, 234 225, 244 226 C 264 228, 270 210, 254 196 C 240 186, 228 192, 220 198 C 212 192, 200 186, 186 196 Z"
            fill="#4a2c14"
            stroke="#1f2937"
            strokeWidth="3"
            animate={{ scaleX: [1, 1.04, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '220px', originY: '205px' }}
          />

          {/* right arm doing OK gesture */}
          <motion.g
            animate={{ rotate: [0, -10, 6, 0], y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '320px', originY: '300px' }}
          >
            <path
              d="M300 260 C 320 250, 336 230, 342 200 L 362 206 C 356 240, 338 266, 316 280 Z"
              fill="#ffffff"
              stroke="#1f2937"
              strokeWidth="3.5"
            />
            {/* hand */}
            <circle cx="356" cy="188" r="24" fill="#f2b88a" stroke="#1f2937" strokeWidth="3" />
            <circle cx="356" cy="188" r="9" fill="none" stroke="#1f2937" strokeWidth="3" />
            <path d="M368 170 C 376 160, 382 148, 380 136" fill="none" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
            <path d="M374 176 C 384 170, 392 160, 392 148" fill="none" stroke="#1f2937" strokeWidth="5" strokeLinecap="round" />
          </motion.g>

          {/* PAN + PIZZA — the tossing group */}
          <motion.g
            animate={{ rotate: [-7, 6, -7], x: [0, 6, 0], y: [0, -6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ originX: '200px', originY: '330px' }}
          >
            {/* wooden peel */}
            <ellipse cx="236" cy="356" rx="118" ry="52" fill="url(#panGrad)" stroke="#1f2937" strokeWidth="3.5" />
            <ellipse cx="236" cy="350" rx="118" ry="52" fill="#d98a2e" stroke="#1f2937" strokeWidth="3.5" />
            {/* pizza base (bounces separately for toss illusion) */}
            <motion.g
              animate={{ y: [0, -22, 0], rotate: [0, -4, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ originX: '236px', originY: '348px' }}
            >
              <ellipse cx="236" cy="344" rx="96" ry="40" fill="#f9c74f" stroke="#1f2937" strokeWidth="3" />
              <ellipse cx="236" cy="340" rx="88" ry="35" fill="url(#cheeseGrad)" />
              {/* pepperoni */}
              {[
                [190, 332], [220, 326], [252, 330], [278, 340], [206, 348], [240, 350], [264, 352],
              ].map(([x, y], i) => (
                <g key={i}>
                  <ellipse cx={x} cy={y} rx="13" ry="8.5" fill="#e23e3e" stroke="#7f1d1d" strokeWidth="2" />
                  <circle cx={x - 3} cy={y - 1} r="1.8" fill="#7f1d1d" />
                  <circle cx={x + 3} cy={y + 1} r="1.8" fill="#7f1d1d" />
                </g>
              ))}
              {/* basil */}
              {[[202, 338], [234, 342], [262, 336]].map(([x, y], i) => (
                <motion.path
                  key={i}
                  d={`M${x} ${y} q 8 -8 16 0 q -8 8 -16 0`}
                  fill="#16a34a"
                  stroke="#14532d"
                  strokeWidth="1.5"
                  animate={{ rotate: [0, 14, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}
                  style={{ originX: `${x}px`, originY: `${y}px` }}
                />
              ))}
              {/* olives */}
              <ellipse cx="216" cy="336" rx="4" ry="3" fill="#1f2937" />
              <ellipse cx="272" cy="348" rx="4" ry="3" fill="#1f2937" />
            </motion.g>
            {/* pan shine */}
            <path d="M150 336 Q 190 318, 240 316" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.55" />
          </motion.g>
        </svg>
      </motion.div>

      {/* floating badge cards */}
      <motion.div
        className="chef-float-badge b-top"
        animate={{ y: [0, -10, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="dot">🔥</span>
        <div>
          <strong>500+ Recipes</strong>
          <small>Easy & tasty</small>
        </div>
      </motion.div>
      <motion.div
        className="chef-float-badge b-bottom"
        animate={{ y: [0, 10, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <span className="stars">★★★★★</span>
        <div>
          <strong>4.9 Loved</strong>
          <small>12k home chefs</small>
        </div>
      </motion.div>
    </div>
  );
}
