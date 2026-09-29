import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Camera, Check } from 'lucide-react';
import ChefIllustration from './ChefIllustration';

/**
 * Single landing hero — OLD Fridge-to-Table content
 * inside the NEW Cook. card design + animated chef.
 * (Inner "Cook." mini-nav removed so it no longer
 *  overlaps the global Fridge-to-Table navbar.)
 */
export default function CookHero({
  onOpenSnap,
  onOpenCuttingBoard,
  exampleIngredients = [],
  selectedIngredients = [],
  onToggleIngredient,
}) {
  return (
    <div className="cook-hero-card">
      <div className="cook-hero-grid">
        {/* left: OLD content */}
        <div className="cook-copy">
          <motion.div
            className="cook-badge"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Sparkles size={16} />
            AI KITCHEN COMPANION
          </motion.div>

          <motion.h1
            className="cook-title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            Turn whatever is in
            your fridge into
            <em>restaurant-quality dinner.</em>
          </motion.h1>

          <motion.p
            className="cook-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
          >
            Type what ingredients you have, or snap a photo of your open fridge.
            Our AI matches your exact pantry with step-by-step editorial recipes
            and video tutorials.
          </motion.p>

          <motion.div
            className="cook-cta-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
          >
            <motion.button
              type="button"
              className="cook-primary-btn"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenCuttingBoard}
            >
              <Sparkles size={18} />
              Open The Cutting Board
            </motion.button>

            <motion.button
              type="button"
              className="cook-ghost-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenSnap}
            >
              <Camera size={18} />
              Snap Fridge Photo
            </motion.button>
          </motion.div>

          {/* OLD example ingredient board */}
          <motion.div
            className="cook-board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <span className="board-label">EXAMPLE INGREDIENT BOARD:</span>
            <div className="board-chips">
              {exampleIngredients.map((ing) => {
                const isSelected = selectedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    type="button"
                    className={`chip ${isSelected ? '' : 'inactive'}`}
                    onClick={() => onToggleIngredient && onToggleIngredient(ing)}
                    title={isSelected ? 'Included in pantry' : 'Click to add to pantry'}
                  >
                    <span>{ing}</span>
                    {isSelected && <Check size={15} className="chip-check" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* right: NEW animated chef (kept) */}
        <motion.div
          className="cook-art"
          initial={{ opacity: 0, scale: 0.94, x: 24 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChefIllustration />
        </motion.div>
      </div>

      {/* decorative blobs */}
      <div className="cook-deco d1" />
      <div className="cook-deco d2" />
    </div>
  );
}
