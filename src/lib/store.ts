import { create } from "zustand";
import {
  Dish,
  Ingredient,
  DishWithIngredients,
  SearchFilters,
  DishSuggestion,
} from "./types";
import { mockData, getAllDishesWithIngredients } from "./mock-data";

interface PantryPalStore {
  // State
  dishes: Dish[];
  ingredients: Ingredient[];
  searchFilters: SearchFilters;
  selectedIngredients: number[];

  // Actions
  setDishes: (dishes: Dish[]) => void;
  setIngredients: (ingredients: Ingredient[]) => void;
  addDish: (dish: Dish) => void;
  updateDish: (dish: Dish) => void;
  deleteDish: (dishId: number) => void;
  addIngredient: (ingredient: Ingredient) => void;
  updateIngredient: (ingredient: Ingredient) => void;
  deleteIngredient: (ingredientId: number) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  setSelectedIngredients: (ingredientIds: number[]) => void;

  // Computed values
  getFilteredDishes: () => DishWithIngredients[];
  getDishSuggestions: () => DishSuggestion[];
  getAvailableIngredients: () => Ingredient[];
}

export const usePantryPalStore = create<PantryPalStore>((set, get) => ({
  // Initial state
  dishes: mockData.dishes,
  ingredients: mockData.ingredients,
  searchFilters: {
    query: "",
    ingredientIds: [],
  },
  selectedIngredients: [],

  // Actions
  setDishes: (dishes) => set({ dishes }),
  setIngredients: (ingredients) => set({ ingredients }),

  addDish: (dish) =>
    set((state) => ({
      dishes: [...state.dishes, dish],
    })),

  updateDish: (dish) =>
    set((state) => ({
      dishes: state.dishes.map((d) => (d.id === dish.id ? dish : d)),
    })),

  deleteDish: (dishId) =>
    set((state) => ({
      dishes: state.dishes.filter((d) => d.id !== dishId),
    })),

  addIngredient: (ingredient) =>
    set((state) => ({
      ingredients: [...state.ingredients, ingredient],
    })),

  updateIngredient: (ingredient) =>
    set((state) => ({
      ingredients: state.ingredients.map((i) =>
        i.id === ingredient.id ? ingredient : i
      ),
    })),

  deleteIngredient: (ingredientId) =>
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i.id !== ingredientId),
      // Also remove from dishes that use this ingredient
      dishes: state.dishes.map((dish) => ({
        ...dish,
        ingredients: dish.ingredients.filter((id) => id !== ingredientId),
      })),
    })),

  setSearchFilters: (filters) => set({ searchFilters: filters }),
  setSelectedIngredients: (ingredientIds) =>
    set({ selectedIngredients: ingredientIds }),

  // Computed values
  getFilteredDishes: () => {
    const { dishes, ingredients, searchFilters } = get();

    let filteredDishes = dishes.map((dish) => ({
      ...dish,
      ingredients: dish.ingredients
        .map((id) => ingredients.find((ing) => ing.id === id))
        .filter(Boolean) as Ingredient[],
    }));

    // Filter by search query
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filteredDishes = filteredDishes.filter(
        (dish) =>
          dish.name.toLowerCase().includes(query) ||
          dish.procedure.toLowerCase().includes(query) ||
          dish.ingredients.some((ing) => ing.name.toLowerCase().includes(query))
      );
    }

    // Filter by ingredients
    if (searchFilters.ingredientIds.length > 0) {
      filteredDishes = filteredDishes.filter((dish) =>
        searchFilters.ingredientIds.every((ingredientId) =>
          dish.ingredients.some((ing) => ing.id === ingredientId)
        )
      );
    }

    return filteredDishes;
  },

  getDishSuggestions: () => {
    const { selectedIngredients, dishes, ingredients } = get();

    if (selectedIngredients.length === 0) {
      return [];
    }

    const suggestions: DishSuggestion[] = dishes
      .map((dish) => {
        const dishIngredients = dish.ingredients
          .map((id) => ingredients.find((ing) => ing.id === id))
          .filter(Boolean) as Ingredient[];

        // Find matching ingredients (fuzzy matching)
        const matchedIngredients = dishIngredients.filter((dishIngredient) =>
          selectedIngredients.some((selectedId) => {
            const selectedIngredient = ingredients.find(
              (ing) => ing.id === selectedId
            );
            if (!selectedIngredient) return false;

            // Exact match
            if (dishIngredient.id === selectedId) return true;

            // Fuzzy match - check if names are similar
            const dishName = dishIngredient.name.toLowerCase();
            const selectedName = selectedIngredient.name.toLowerCase();

            return (
              dishName.includes(selectedName) || selectedName.includes(dishName)
            );
          })
        );

        // Calculate match score based on how many ingredients match
        const matchScore =
          matchedIngredients.length / Math.max(dishIngredients.length, 1);

        return {
          dish: {
            ...dish,
            ingredients: dishIngredients,
          },
          matchScore,
          matchedIngredients,
        };
      })
      .filter((suggestion) => suggestion.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    return suggestions;
  },

  getAvailableIngredients: () => {
    const { ingredients } = get();
    return ingredients.sort((a, b) => a.name.localeCompare(b.name));
  },
}));
