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
    id: 'rec_palalk_tamatar_shimla',
    title: 'Palak Tamatar Shimla Mirch Sabzi',
    subtitle: 'Ghar-style spinach, cherry tomato and yellow bell pepper tadka in jeera-haldi masala.',
    matchPercentage: 96,
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.9,
    reviewsCount: '1.2k',
    calories: 320,
    nutrition: {
      calories: 320,
      servingSize: '1 katori sabzi + 2 roti',
      proteinGrams: 12,
      protein: '12g',
      carbsGrams: 28,
      carbs: '28g',
      fatGrams: 18,
      fat: '18g',
      fiberGrams: 7,
      fiber: '7g',
      sugarGrams: 8,
      sugar: '8g',
      sodiumMg: 540,
      sodium: '540mg',
      cholesterolMg: 15,
      highlights: ['High Fibre', 'Desi Tadka', 'Vegetarian']
    },
    cuisine: 'North Indian Home Style',
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
    matchedIngredients: [
      { name: 'Cherry Tomatoes', amount: '1 cup, halved', isFromPantry: true },
      { name: 'Yellow Bell Pepper', amount: '1 large, diced', isFromPantry: true },
      { name: 'Spinach', amount: '3 cups, chopped', isFromPantry: true },
      { name: 'Garlic', amount: '4 cloves, minced', isFromPantry: true }
    ],
    missingIngredients: [
      { name: 'Salt', amount: 'to taste', optional: true, substitute: 'Black salt or sendha namak' },
      { name: 'Haldi (Turmeric)', amount: '1/2 tsp', optional: true, substitute: 'A pinch of garam masala' },
      { name: 'Jeera (Cumin Seeds)', amount: '1 tsp', optional: true, substitute: 'Mustard seeds / rai' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Tadka Lagao',
        instruction: 'Heat 2 tbsp mustard oil / ghee in a kadhai on medium flame. Add 1 tsp jeera, let it crackle. Add minced garlic and 1 chopped green chilli, bhuno for 30 seconds till fragrant.',
        durationMinutes: 2,
        tip: 'Jeera should crackle immediately — if not, oil is not hot enough for a proper desi tadka.'
      },
      {
        step: 2,
        title: 'Bhuno Masala',
        instruction: 'Add diced yellow bell pepper, saute 3 mins. Add halved cherry tomatoes, 1/2 tsp haldi, 1 tsp dhania powder, salt to taste. Bhuno till tomatoes soften and oil leaves sides.',
        durationMinutes: 6,
        tip: 'Bhuno on medium-high till masala turns glossy — this is the soul of the sabzi.'
      },
      {
        step: 3,
        title: 'Palak Milao',
        instruction: 'Add chopped spinach, cover and cook 4-5 mins till wilted. Sprinkle 1/2 tsp garam masala and a squeeze of nimbu. Serve hot with roti or jeera rice.',
        durationMinutes: 5,
        tip: 'Do not overcook palak — keep it bright green for best taste and nutrition.'
      }
    ],
    chefTips: [
      'Add kasuri methi crushed between palms at the end for dhaba-style aroma.',
      'If tomatoes are sour, add a pinch of gur / sugar to balance.'
    ],
    whyItWorks: 'Jeera-garlic tadka blooms in hot oil, haldi and tomato acidity cut the earthiness of palak, while sweet bell pepper balances the masala.',
    winePairing: 'Masala Chaas or Nimbu Pani',
    tags: ['Vegetarian', 'Under 30 Mins', 'Tonight\'s Pick', 'Desi Tadka']
  },
  {
    id: 'rec_masala_spinach_bhurji',
    title: 'Desi Masala Spinach Bell Pepper Bhurji',
    subtitle: 'Dry-style Indian bhurji with haldi-jeera tadka, perfect with paratha or dal-chawal.',
    matchPercentage: 92,
    prepTime: '8 mins',
    cookTime: '12 mins',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.8,
    reviewsCount: '840',
    calories: 290,
    nutrition: {
      calories: 290,
      servingSize: '1 katori bhurji (approx. 250g)',
      proteinGrams: 10,
      protein: '10g',
      carbsGrams: 22,
      carbs: '22g',
      fatGrams: 16,
      fat: '16g',
      fiberGrams: 6,
      fiber: '6g',
      sugarGrams: 7,
      sugar: '7g',
      sodiumMg: 480,
      sodium: '480mg',
      cholesterolMg: 10,
      highlights: ['Vegetarian', 'Quick Sabzi', 'Low Oil Option']
    },
    cuisine: 'Punjabi Dhaba Style',
    imageUrl: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=1200&q=80',
    matchedIngredients: [
      { name: 'Spinach', amount: '3 cups', isFromPantry: true },
      { name: 'Cherry Tomatoes', amount: '1 cup', isFromPantry: true },
      { name: 'Yellow Bell Pepper', amount: '1 large', isFromPantry: true }
    ],
    missingIngredients: [
      { name: 'Mustard Oil', amount: '1 tbsp', optional: true, substitute: 'Ghee or any cooking oil' },
      { name: 'Black Pepper (Kali Mirch)', amount: '1/2 tsp crushed', optional: true, substitute: 'Green chilli or red chilli powder' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Tadka & Bhuno',
        instruction: 'Heat oil in kadhai. Add jeera and hing, then chopped bell pepper. Saute 3 mins on high flame for light char.',
        durationMinutes: 4,
        tip: 'High flame gives dhaba-style smoky char to shimla mirch.'
      },
      {
        step: 2,
        title: 'Tomato-Palek Mix',
        instruction: 'Add tomatoes, haldi, salt, crushed kali mirch. Cook 3 mins, then add spinach. Cover 4 mins till dry sabzi consistency.',
        durationMinutes: 7,
        tip: 'Cook open at the end to evaporate water for perfect dry bhurji texture.'
      }
    ],
    chefTips: ['Serve with ghee-roasted paratha and kachumber salad.'],
    whyItWorks: 'Hot tadka + tomato khattas + palak earthiness creates classic sweet-sour-savoury Indian balance.',
    winePairing: 'Sweet Lassi or Masala Chai',
    tags: ['Quick & Easy', 'Vegetarian Friendly', 'Indian Tiffin']
  },
  {
    id: 'rec_tamatar_palalk_tadka',
    title: 'Tamatar Palak Tadka Curry',
    subtitle: 'Light South-North fusion curry — tomato-garlic tadka poured over wilted palak and peppers.',
    matchPercentage: 91,
    prepTime: '8 mins',
    cookTime: '12 mins',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.9,
    reviewsCount: '620',
    calories: 310,
    nutrition: {
      calories: 310,
      servingSize: '1 katori curry + 1 cup steamed rice',
      proteinGrams: 11,
      protein: '11g',
      carbsGrams: 30,
      carbs: '30g',
      fatGrams: 15,
      fat: '15g',
      fiberGrams: 6,
      fiber: '6g',
      sugarGrams: 8,
      sugar: '8g',
      sodiumMg: 520,
      sodium: '520mg',
      cholesterolMg: 8,
      highlights: ['Comfort Curry', 'Gluten Free', 'One Kadhai']
    },
    cuisine: 'Desi Home Style Curry',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    matchedIngredients: [
      { name: 'Cherry Tomatoes', amount: '1 cup', isFromPantry: true },
      { name: 'Spinach', amount: '2 cups', isFromPantry: true },
      { name: 'Yellow Bell Pepper', amount: '1 diced', isFromPantry: true },
      { name: 'Garlic', amount: '3 cloves', isFromPantry: true }
    ],
    missingIngredients: [
      { name: 'Garam Masala', amount: '1/2 tsp', optional: true, substitute: 'Kitchen king masala' },
      { name: 'Salt', amount: 'to taste', optional: true, substitute: 'Black salt' }
    ],
    instructions: [
      {
        step: 1,
        title: 'Curry Base',
        instruction: 'In a kadhai, heat 1 tbsp oil, add rai + jeera + curry leaves (optional). Add garlic, bell pepper, tomatoes. Bhuno till soft.',
        durationMinutes: 6,
        tip: 'Let tomatoes break down fully — that is your natural curry gravy, no cream needed.'
      },
      {
        step: 2,
        title: 'Palak & Finish',
        instruction: 'Add spinach + 1/2 cup water, simmer 4 mins. Finish with garam masala and nimbu juice. Serve with rice / roti.',
        durationMinutes: 5,
        tip: 'Add tadka of ghee + garlic on top before serving for restaurant aroma.'
      }
    ],
    chefTips: ['Mash a few tomatoes with the back of the spoon for thicker desi gravy.'],
    whyItWorks: 'Rai-jeera tempering + tomato tang + garam masala warmth lifts mild palak and sweet peppers into a full Indian curry.',
    winePairing: 'Masala Chaas or Jeera Pani',
    tags: ['One Pot', 'Gluten Free', 'Under 20 Mins']
  }
];
