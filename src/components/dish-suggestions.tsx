"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Lightbulb, ChefHat, X, Plus } from "lucide-react";
import { usePantryPalStore } from "@/lib/store";
import { DishWithIngredients } from "@/lib/types";

export function DishSuggestions() {
  const {
    selectedIngredients,
    setSelectedIngredients,
    getDishSuggestions,
    getAvailableIngredients,
  } = usePantryPalStore();

  const suggestions = getDishSuggestions();
  const availableIngredients = getAvailableIngredients();

  const handleAddIngredient = (ingredientId: string) => {
    const id = parseInt(ingredientId);
    if (!selectedIngredients.includes(id)) {
      setSelectedIngredients([...selectedIngredients, id]);
    }
  };

  const handleRemoveIngredient = (ingredientId: number) => {
    setSelectedIngredients(
      selectedIngredients.filter((id) => id !== ingredientId)
    );
  };

  const clearSelectedIngredients = () => {
    setSelectedIngredients([]);
  };

  const getSelectedIngredientObjects = () => {
    return selectedIngredients
      .map((id) => availableIngredients.find((ing) => ing.id === id))
      .filter(Boolean);
  };

  const getAvailableOptions = () => {
    return availableIngredients.filter(
      (ing) => !selectedIngredients.includes(ing.id)
    );
  };

  const getMatchPercentage = (matchScore: number) => {
    return Math.round(matchScore * 100);
  };

  const getMatchColor = (matchScore: number) => {
    if (matchScore >= 0.8) return "bg-green-100 text-green-800";
    if (matchScore >= 0.5) return "bg-yellow-100 text-yellow-800";
    return "bg-orange-100 text-orange-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Lightbulb className='h-5 w-5 text-yellow-500' />
          Dish Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Ingredient Selection */}
        <div className='space-y-2'>
          <label className='text-sm font-medium'>
            Select ingredients you have:
          </label>
          <div className='flex gap-2'>
            <Select onValueChange={handleAddIngredient}>
              <SelectTrigger className='flex-1'>
                <SelectValue placeholder='Add ingredients you have' />
              </SelectTrigger>
              <SelectContent>
                {getAvailableOptions().map((ingredient) => (
                  <SelectItem
                    key={ingredient.id}
                    value={ingredient.id.toString()}
                  >
                    {ingredient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant='outline'
              size='sm'
              disabled={getAvailableOptions().length === 0}
            >
              <Plus className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <label className='text-sm font-medium'>Your ingredients:</label>
              <Button
                variant='ghost'
                size='sm'
                onClick={clearSelectedIngredients}
                className='text-xs'
              >
                Clear All
              </Button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {getSelectedIngredientObjects().map((ingredient) => (
                <Badge
                  key={ingredient!.id}
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  {ingredient!.name}
                  <button
                    onClick={() => handleRemoveIngredient(ingredient!.id)}
                    className='hover:bg-gray-300 rounded-full p-0.5'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        <div className='space-y-3'>
          {selectedIngredients.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <ChefHat className='h-12 w-12 mx-auto mb-4 text-gray-300' />
              <p>Select some ingredients to get dish suggestions!</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              <ChefHat className='h-12 w-12 mx-auto mb-4 text-gray-300' />
              <p>No dishes found with your selected ingredients.</p>
              <p className='text-sm mt-1'>
                Try adding more ingredients or check your pantry!
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              <h4 className='font-medium text-sm text-gray-700'>
                Found {suggestions.length} dish
                {suggestions.length !== 1 ? "es" : ""}:
              </h4>
              {suggestions.map((suggestion) => (
                <Card
                  key={suggestion.dish.id}
                  className='border-l-4 border-l-blue-500'
                >
                  <CardContent className='p-4'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <h5 className='font-medium'>{suggestion.dish.name}</h5>
                        <Badge
                          className={`text-xs ${getMatchColor(
                            suggestion.matchScore
                          )}`}
                        >
                          {getMatchPercentage(suggestion.matchScore)}% match
                        </Badge>
                      </div>
                    </div>

                    <div className='space-y-2'>
                      {/* Matched Ingredients */}
                      <div>
                        <p className='text-xs font-medium text-gray-600 mb-1'>
                          Matched ingredients (
                          {suggestion.matchedIngredients.length}):
                        </p>
                        <div className='flex flex-wrap gap-1'>
                          {suggestion.matchedIngredients.map((ingredient) => (
                            <Badge
                              key={ingredient.id}
                              variant='outline'
                              className='text-xs'
                            >
                              {ingredient.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* All Ingredients */}
                      <div>
                        <p className='text-xs font-medium text-gray-600 mb-1'>
                          All ingredients needed:
                        </p>
                        <div className='flex flex-wrap gap-1'>
                          {suggestion.dish.ingredients.map((ingredient) => (
                            <Badge
                              key={ingredient.id}
                              variant={
                                suggestion.matchedIngredients.some(
                                  (mi) => mi.id === ingredient.id
                                )
                                  ? "default"
                                  : "secondary"
                              }
                              className='text-xs'
                            >
                              {ingredient.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Missing Ingredients */}
                      {suggestion.matchedIngredients.length <
                        suggestion.dish.ingredients.length && (
                        <div>
                          <p className='text-xs font-medium text-orange-600 mb-1'>
                            Missing ingredients:
                          </p>
                          <div className='flex flex-wrap gap-1'>
                            {suggestion.dish.ingredients
                              .filter(
                                (ingredient) =>
                                  !suggestion.matchedIngredients.some(
                                    (mi) => mi.id === ingredient.id
                                  )
                              )
                              .map((ingredient) => (
                                <Badge
                                  key={ingredient.id}
                                  variant='outline'
                                  className='text-xs text-orange-600 border-orange-300'
                                >
                                  {ingredient.name}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
