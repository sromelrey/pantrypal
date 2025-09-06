import { MockData } from "./types";

// Mock data for testing CRUD operations, search, and fuzzy matching
export const mockData: MockData = {
  ingredients: [
    { id: 1, name: "Chicken" },
    { id: 2, name: "Garlic" },
    { id: 3, name: "Onion" },
    { id: 4, name: "Tomato" },
    { id: 5, name: "Rice" },
    { id: 6, name: "Soy Sauce" },
    { id: 7, name: "Olive Oil" },
    { id: 8, name: "Salt" },
    { id: 9, name: "Pepper" },
    { id: 10, name: "Pasta" },
    { id: 11, name: "Cheese" },
    { id: 12, name: "Milk" },
  ],
  dishes: [
    {
      id: 1,
      name: "Garlic Chicken",
      procedure:
        "1. Marinate chicken in soy sauce for 30 minutes. 2. Heat olive oil in a pan. 3. Sauté garlic and onion until fragrant. 4. Add chicken and cook until golden brown and cooked through. 5. Season with salt and pepper.",
      ingredients: [1, 2, 3, 6, 7, 8, 9],
    },
    {
      id: 2,
      name: "Tomato Chicken Stew",
      procedure:
        "1. Heat olive oil in a large pot. 2. Fry onion and garlic until soft. 3. Add chicken pieces and cook until sealed. 4. Add tomatoes and simmer for 20 minutes. 5. Season with salt and pepper to taste.",
      ingredients: [1, 2, 3, 4, 7, 8, 9],
    },
    {
      id: 3,
      name: "Garlic Fried Rice",
      procedure:
        "1. Heat olive oil in a wok or large pan. 2. Sauté garlic until golden and fragrant. 3. Add cooked rice and stir to break up clumps. 4. Add soy sauce and stir fry until evenly coated. 5. Season with salt and pepper.",
      ingredients: [2, 5, 6, 7, 8, 9],
    },
    {
      id: 4,
      name: "Cheesy Pasta",
      procedure:
        "1. Boil pasta according to package instructions. 2. Heat milk in a saucepan. 3. Add cheese and stir until melted. 4. Drain pasta and mix with cheese sauce. 5. Season with salt and pepper.",
      ingredients: [10, 11, 12, 8, 9],
    },
    {
      id: 5,
      name: "Simple Tomato Pasta",
      procedure:
        "1. Boil pasta until al dente. 2. Heat olive oil in a pan. 3. Sauté garlic until fragrant. 4. Add tomatoes and cook until soft. 5. Toss with pasta and season with salt and pepper.",
      ingredients: [10, 2, 4, 7, 8, 9],
    },
  ],
};

// Helper function to get dish with full ingredient objects
export function getDishWithIngredients(dishId: number): any {
  const dish = mockData.dishes.find((d) => d.id === dishId);
  if (!dish) return null;

  const ingredients = dish.ingredients
    .map((ingredientId) =>
      mockData.ingredients.find((ing) => ing.id === ingredientId)
    )
    .filter(Boolean);

  return {
    ...dish,
    ingredients,
  };
}

// Helper function to get all dishes with full ingredient objects
export function getAllDishesWithIngredients(): any[] {
  return mockData.dishes.map((dish) => getDishWithIngredients(dish.id));
}
