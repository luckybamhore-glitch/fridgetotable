export const SAMPLE_FRIDGES = [
  {
    id: 'tuscan-salmon',
    name: 'Gourmet Mediterranean Fridge',
    description: 'Fresh salmon fillets, organic spinach, heavy cream, garlic cloves, sun-dried tomatoes, and pasture butter.',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      { name: 'Salmon Fillets', category: 'Meat & Seafood', confidence: 'high', freshnessHint: 'fresh', quantityEstimate: '2 fillets' },
      { name: 'Garlic', category: 'Produce', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '1 bulb' },
      { name: 'Spinach', category: 'Produce', confidence: 'high', freshnessHint: 'needs-use-soon', quantityEstimate: '1 bunch' },
      { name: 'Heavy Cream', category: 'Dairy & Eggs', confidence: 'high', freshnessHint: 'fresh', quantityEstimate: '250 ml' },
      { name: 'Sun-dried Tomatoes', category: 'Pantry & Grains', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '1 jar' },
      { name: 'Butter', category: 'Dairy & Eggs', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '1 stick' },
      { name: 'Lemon', category: 'Produce', confidence: 'medium', freshnessHint: 'fresh', quantityEstimate: '2 whole' },
      { name: 'Parmesan Cheese', category: 'Dairy & Eggs', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '1 block' }
    ]
  },
  {
    id: 'farmer-market-veggie',
    name: 'Farmer\'s Market Crisp Drawer',
    description: 'Bell peppers, red onion, zucchini, cherry tomatoes, eggs, feta cheese, and olive oil.',
    imageUrl: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      { name: 'Cherry Tomatoes', category: 'Produce', confidence: 'high', freshnessHint: 'fresh', quantityEstimate: '1 pint' },
      { name: 'Bell Peppers', category: 'Produce', confidence: 'high', freshnessHint: 'fresh', quantityEstimate: '3 assorted' },
      { name: 'Zucchini', category: 'Produce', confidence: 'high', freshnessHint: 'needs-use-soon', quantityEstimate: '2 medium' },
      { name: 'Red Onion', category: 'Produce', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '2 bulbs' },
      { name: 'Eggs', category: 'Dairy & Eggs', confidence: 'high', freshnessHint: 'fresh', quantityEstimate: '6 large' },
      { name: 'Feta Cheese', category: 'Dairy & Eggs', confidence: 'high', freshnessHint: 'fresh', quantityEstimate: '200g' },
      { name: 'Olive Oil', category: 'Condiments & Sauces', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '1 bottle' },
      { name: 'Fresh Basil', category: 'Produce', confidence: 'medium', freshnessHint: 'needs-use-soon', quantityEstimate: '1 pack' }
    ]
  },
  {
    id: 'asian-pantry-chicken',
    name: 'Pan-Asian Pantry & Poultry',
    description: 'Chicken breast, ginger, scallions, soy sauce, sesame oil, broccoli florets, and jasmine rice.',
    imageUrl: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=1000&q=80',
    ingredients: [
      { name: 'Chicken Breast', category: 'Meat & Seafood', confidence: 'high', freshnessHint: 'fresh', quantityEstimate: '500g' },
      { name: 'Broccoli', category: 'Produce', confidence: 'high', freshnessHint: 'fresh', quantityEstimate: '1 crown' },
      { name: 'Scallions (Green Onions)', category: 'Produce', confidence: 'high', freshnessHint: 'needs-use-soon', quantityEstimate: '1 bunch' },
      { name: 'Ginger Root', category: 'Produce', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '1 knob' },
      { name: 'Soy Sauce', category: 'Condiments & Sauces', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '1 bottle' },
      { name: 'Sesame Oil', category: 'Condiments & Sauces', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '1 bottle' },
      { name: 'Garlic', category: 'Produce', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '4 cloves' },
      { name: 'Rice / Noodles', category: 'Pantry & Grains', confidence: 'high', freshnessHint: 'stable', quantityEstimate: '1 bag' }
    ]
  }
];

export const FALLBACK_RECIPES = [
  {
    id: 'rec_tuscan_salmon',
    title: 'Tuscan Creamy Garlic Butter Salmon',
    subtitle: 'Crispy skin, wilted spinach & sweet sun-dried tomatoes in a velvety parmesan pan sauce.',
    matchPercentage: 96,
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.9,
    reviewsCount: '1.2k',
    calories: 520,
    nutrition: {
      calories: 520,
      servingSize: '1 salmon fillet + 3/4 cup Tuscan sauce',
      proteinGrams: 36,
      protein: '36g',
      carbsGrams: 10,
      carbs: '10g',
      fatGrams: 36,
      fat: '36g',
      fiberGrams: 2,
      fiber: '2g',
      sugarGrams: 5,
      sugar: '5g',
      sodiumMg: 640,
      sodium: '640mg',
      cholesterolMg: 165,
      highlights: ['High Protein', 'Omega-3 Rich', 'Keto-Friendly']
    },
    cuisine: 'Italian Coastal',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
    matchedIngredients: [
      { name: 'Salmon Fillets', amount: '2 portions (6 oz each)', isFromPantry: true },
      { name: 'Garlic', amount: '4 cloves, minced', isFromPantry: true },
      { name: 'Baby Spinach', amount: '3 cups fresh', isFromPantry: true },
      { name: 'Heavy Cream', amount: '3/4 cup', isFromPantry: true },
      { name: 'Sun-dried Tomatoes', amount: '1/3 cup, sliced', isFromPantry: true },
      { name: 'Butter', amount: '2 tbsp', isFromPantry: true }
    ],
    missingIngredients: [
      { name: 'Parmesan Cheese (optional)', amount: '1/4 cup grated', optional: true, substitute: 'Nutritional yeast or extra butter' },
      { name: 'Fresh Lemon Wedges', amount: '1 lemon', optional: false, substitute: 'Apple cider vinegar or white wine' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Sear the Salmon',
        instruction: 'Pat salmon fillets dry with a paper towel. Season with salt and cracked black pepper. Heat 1 tbsp butter and olive oil in a skillet over medium-high heat. Sear salmon skin-side down for 5 minutes, flip and sear for 3 minutes until golden. Transfer to a warm plate.',
        durationMinutes: 8,
        tip: 'Drying the skin thoroughly ensures a restaurant-crisp texture without sticking.'
      },
      {
        step: 2,
        title: 'Sauté Aromatics',
        instruction: 'In the same skillet over medium heat, melt the remaining 1 tbsp butter. Add minced garlic and sun-dried tomatoes; sauté for 1 minute until delightfully fragrant.',
        durationMinutes: 2,
        tip: 'Do not let the garlic brown deeply; keep it aromatic and sweet.'
      },
      {
        step: 3,
        title: 'Build the Velvety Sauce',
        instruction: 'Reduce heat to low-medium. Pour in heavy cream and bring to a gentle simmer. Fold in fresh baby spinach and stir until gently wilted (about 2 minutes).',
        durationMinutes: 3,
        tip: 'Stir constantly to prevent cream from scorching.'
      },
      {
        step: 4,
        title: 'Combine & Finish',
        instruction: 'Nestle the seared salmon back into the skillet. Spoon the creamy sauce over top. Squeeze fresh lemon juice, garnish with pine nuts or herbs, and serve immediately.',
        durationMinutes: 2,
        tip: 'Serve with steamed cauliflower rice, crusty rustic bread, or green beans.'
      }
    ],
    chefTips: [
      'For maximum flavor, use oil from the sun-dried tomato jar when searing the salmon.',
      'If the cream sauce becomes too thick, whisk in 2 tablespoons of warm water or broth.'
    ],
    whyItWorks: 'The rich natural omega fats of the salmon cut beautifully through the acidity of sun-dried tomatoes and velvety garlic cream.',
    winePairing: 'Crisp Pinot Grigio or chilled Sauvignon Blanc',
    tags: ['Keto-Friendly', 'High Protein', 'Under 30 Mins', 'Tonight\'s Pick']
  },
  {
    id: 'rec_garlic_butter_pasta',
    title: 'Rustic Pan-Roasted Garlic & Spinach Pasta',
    subtitle: 'Al dente ribbons tossed in browned butter, blistered tomatoes, and silky parmesan emulsion.',
    matchPercentage: 92,
    prepTime: '5 mins',
    cookTime: '15 mins',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.8,
    reviewsCount: '840',
    calories: 440,
    nutrition: {
      calories: 440,
      servingSize: '1 bowl (approx. 320g)',
      proteinGrams: 14,
      protein: '14g',
      carbsGrams: 58,
      carbs: '58g',
      fatGrams: 18,
      fat: '18g',
      fiberGrams: 5,
      fiber: '5g',
      sugarGrams: 4,
      sugar: '4g',
      sodiumMg: 480,
      sodium: '480mg',
      cholesterolMg: 55,
      highlights: ['Vegetarian', 'Comfort Food', 'Quick Energy']
    },
    cuisine: 'Modern Mediterranean',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?auto=format&fit=crop&w=1200&q=80',
    matchedIngredients: [
      { name: 'Garlic', amount: '5 cloves, thinly sliced', isFromPantry: true },
      { name: 'Spinach', amount: '4 cups', isFromPantry: true },
      { name: 'Butter', amount: '3 tbsp', isFromPantry: true },
      { name: 'Heavy Cream', amount: '1/4 cup', isFromPantry: true }
    ],
    missingIngredients: [
      { name: 'Spaghetti / Fettuccine', amount: '200g', optional: false, substitute: 'Egg noodles or spiralized zucchini' },
      { name: 'Red Pepper Flakes', amount: '1/2 tsp', optional: true, substitute: 'Black pepper' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Boil Pasta',
        instruction: 'Cook pasta in heavily salted boiling water until 1 minute before al dente. Reserve 1/2 cup pasta cooking water.',
        durationMinutes: 8,
        tip: 'Pasta water contains starches that form an emulsified restaurant-style sauce.'
      },
      {
        step: 2,
        title: 'Brown the Butter & Garlic',
        instruction: 'Melt butter in a wide pan over medium heat. When frothy, add sliced garlic and chili flakes, stirring until golden and nutty.',
        durationMinutes: 3,
        tip: 'Watch closely; browned butter has a warm hazelnut scent.'
      },
      {
        step: 3,
        title: 'Toss and Emulsify',
        instruction: 'Add pasta directly into the butter skillet with reserved pasta water and heavy cream. Swirl vigorously until glossy. Fold in spinach until wilted.',
        durationMinutes: 3,
        tip: 'Tossing vigorously creates the velvety restaurant sheen.'
      }
    ],
    chefTips: ['Garnish with toasted breadcrumbs or pine nuts for crunch.'],
    whyItWorks: 'Starchy pasta water combines with browned butter fats to create an authentic Roman emulsion.',
    winePairing: 'Chardonnay or Vermentino',
    tags: ['Quick & Easy', 'Vegetarian Friendly', 'Comfort Food']
  },
  {
    id: 'rec_crispy_salmon_bowl',
    title: 'Crispy Garlic Salmon & Green Power Bowl',
    subtitle: 'Golden-seared salmon rested over sautéed garlic greens, warm grains, and lemon crema.',
    matchPercentage: 91,
    prepTime: '10 mins',
    cookTime: '12 mins',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.9,
    reviewsCount: '620',
    calories: 490,
    nutrition: {
      calories: 490,
      servingSize: '1 power bowl (salmon + greens + grains)',
      proteinGrams: 34,
      protein: '34g',
      carbsGrams: 28,
      carbs: '28g',
      fatGrams: 28,
      fat: '28g',
      fiberGrams: 6,
      fiber: '6g',
      sugarGrams: 5,
      sugar: '5g',
      sodiumMg: 560,
      sodium: '560mg',
      cholesterolMg: 95,
      highlights: ['High Protein', 'Gluten Free', 'Nutrient Dense']
    },
    cuisine: 'Healthy Californian',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
    matchedIngredients: [
      { name: 'Salmon Fillets', amount: '2 fillets', isFromPantry: true },
      { name: 'Spinach', amount: '2 cups', isFromPantry: true },
      { name: 'Garlic', amount: '3 cloves', isFromPantry: true },
      { name: 'Butter', amount: '1 tbsp', isFromPantry: true }
    ],
    missingIngredients: [
      { name: 'Quinoa or Brown Rice', amount: '1 cup cooked', optional: true, substitute: 'Riced cauliflower' },
      { name: 'Avocado', amount: '1 sliced', optional: true, substitute: 'Cucumber slices' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Pan Sear Salmon',
        instruction: 'Cook salmon in a hot cast-iron skillet for 4 mins per side until crispy on the edges.',
        durationMinutes: 8,
        tip: 'Do not move the fillet for the first 3 minutes so a crisp crust forms.'
      },
      {
        step: 2,
        title: 'Flash Sauté Greens',
        instruction: 'Toss spinach and garlic in butter for 90 seconds until warm and tender.',
        durationMinutes: 2,
        tip: 'Retain vibrant green color by pulling off heat immediately.'
      },
      {
        step: 3,
        title: 'Assemble Bowl',
        instruction: 'Layer warm greens, spoon over tangy lemon-cream drizzle, and rest salmon on top.',
        durationMinutes: 2,
        tip: 'Sprinkle with toasted seeds for extra texture.'
      }
    ],
    chefTips: ['Finish with flaky sea salt right before taking your first bite.'],
    whyItWorks: 'Nutrient-dense pairing of healthy fats, magnesium-rich dark leafy greens, and clean protein.',
    winePairing: 'Sparkling Rosé or Sparkling Water with Lime',
    tags: ['High Protein', 'Gluten Free', 'Under 20 Mins']
  }
];
