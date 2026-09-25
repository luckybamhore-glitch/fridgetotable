import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import HeroSection from '../components/HeroSection';
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
    <>
      <HeroSection
        onOpenSnap={() => setIsSnapModalOpen(true)}
        onOpenCuttingBoard={() => navigate('/cutting-board')}
        exampleIngredients={INITIAL_EXAMPLE_INGREDIENTS}
        selectedIngredients={ingredients.map((i) => i.name)}
        onToggleIngredient={toggleExampleIngredient}
      />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
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
    </>
  );
}
