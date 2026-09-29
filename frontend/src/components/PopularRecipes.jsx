import React, { useState } from 'react';
import { motion } from 'motion/react';

const POPULAR = [
  {
    title: 'Creamy Tomato Basil Soup',
    desc: 'This comforting soup is made with fresh tomatoes, aromatic basil, and a touch of cream.',
    img: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Spicy Shrimp Tacos',
    desc: 'These tacos are loaded with juicy shrimp that have been marinated in a spicy blend of chili powder.',
    img: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Chicken Parmesan',
    desc: 'This classic Italian dish features tender chicken breasts coated in crispy breadcrumbs.',
    img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=700&q=80',
  },
  {
    title: 'Chocolate Chip Cookies',
    desc: 'These cookies are the perfect balance of chewy and crispy, with gooey pockets of melted.',
    img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=700&q=80',
  },
];

export default function PopularRecipes({ onExplore }) {
  const [active, setActive] = useState(1);

  return (
    <section id="popular-recipes" className="popular-section">
      <motion.div
        className="popular-head"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
      >
        <h2>Popular Recipes You Can&apos;t Miss</h2>
        <p>
          From comfort food classics to exotic flavors, our featured
          <br />
          recipes are sure to impress.
        </p>
      </motion.div>

      <div className="popular-grid">
        {POPULAR.map((r, i) => (
          <motion.article
            key={r.title}
            className="popular-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            whileHover={{ y: -8, scale: 1.015 }}
          >
            <div className="popular-img-wrap">
              <motion.img
                src={r.img}
                alt={r.title}
                loading="lazy"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
            <motion.button
              type="button"
              className={`popular-btn ${active === i ? 'active' : ''}`}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setActive(i);
                if (onExplore) onExplore();
              }}
            >
              See Full Details
            </motion.button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
