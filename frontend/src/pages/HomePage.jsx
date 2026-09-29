import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CookHero from '../components/CookHero';
import RecipeList from '../components/RecipeList';
import { useKitchen, INITIAL_EXAMPLE_INGREDIENTS } from '../context/KitchenContext';

export default function HomePage() {
  const navigate = useNavigate();
  const {
    ingredients,
    recipes,
    savedRecipeIds,
    setSelectedRecipe,
    setIsSnapModalOpen,
    toggleExampleIngredient,
    toggleSaveRecipe
  } = useKitchen();

  return (
    <div className="cook-landing">
      {/* Single hero: old content + new animation, no duplicate navbar */}
      <CookHero
        onOpenSnap={() => setIsSnapModalOpen(true)}
        onOpenCuttingBoard={() => navigate('/cutting-board')}
        exampleIngredients={INITIAL_EXAMPLE_INGREDIENTS}
        selectedIngredients={ingredients.map((i) => i.name)}
        onToggleIngredient={toggleExampleIngredient}
      />

      <div style={{ display: 'flex', justifyContent: 'center', margin: '26px 0 8px 0' }}>
        <Link
          to="/cutting-board"
          className="btn-hero-secondary"
          style={{ textDecoration: 'none', padding: '12px 28px', fontSize: '0.95rem' }}
        >
          Refine ingredients on The Cutting Board
          <ArrowRight size={17} />
        </Link>
      </div>

      <RecipeList
        recipes={recipes}
        onSelectRecipe={(rec) => setSelectedRecipe(rec)}
        savedRecipeIds={savedRecipeIds}
        onToggleSaveRecipe={toggleSaveRecipe}
      />
    </div>
  );
}
