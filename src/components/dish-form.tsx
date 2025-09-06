"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { usePantryPalStore } from "@/lib/store";
import { createDish, updateDish } from "@/lib/actions";
import { Dish, CreateDishData, UpdateDishData } from "@/lib/types";

interface DishFormProps {
  dish?: Dish;
  onClose: () => void;
  onSuccess: () => void;
}

export function DishForm({ dish, onClose, onSuccess }: DishFormProps) {
  const { addToast } = useToast();
  const {
    getAvailableIngredients,
    addDish,
    updateDish: updateDishStore,
  } = usePantryPalStore();

  const [formData, setFormData] = useState({
    name: dish?.name || "",
    procedure: dish?.procedure || "",
    ingredientIds: dish?.ingredients || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const availableIngredients = getAvailableIngredients();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dishData: CreateDishData | UpdateDishData = {
        name: formData.name,
        procedure: formData.procedure,
        ingredientIds: formData.ingredientIds,
        ...(dish && { id: dish.id }),
      };

      let result;
      if (dish) {
        result = await updateDish(dishData as UpdateDishData);
        if (result.success && result.dish) {
          updateDishStore(result.dish);
          addToast({
            title: "Success",
            description: "Dish updated successfully!",
            type: "success",
          });
        }
      } else {
        result = await createDish(dishData as CreateDishData);
        if (result.success && result.dish) {
          addDish(result.dish);
          addToast({
            title: "Success",
            description: "Dish created successfully!",
            type: "success",
          });
        }
      }

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        addToast({
          title: "Error",
          description: result.error || "Failed to save dish",
          type: "error",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddIngredient = (ingredientId: string) => {
    const id = parseInt(ingredientId);
    if (!formData.ingredientIds.includes(id)) {
      setFormData((prev) => ({
        ...prev,
        ingredientIds: [...prev.ingredientIds, id],
      }));
    }
  };

  const handleRemoveIngredient = (ingredientId: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredientIds: prev.ingredientIds.filter((id) => id !== ingredientId),
    }));
  };

  const getSelectedIngredients = () => {
    return formData.ingredientIds
      .map((id) => availableIngredients.find((ing) => ing.id === id))
      .filter(Boolean);
  };

  const getAvailableOptions = () => {
    return availableIngredients.filter(
      (ing) => !formData.ingredientIds.includes(ing.id)
    );
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          {dish ? "Edit Dish" : "Add New Dish"}
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Dish Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>Dish Name *</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder='Enter dish name'
              required
            />
          </div>

          {/* Cooking Procedure */}
          <div className='space-y-2'>
            <Label htmlFor='procedure'>Cooking Procedure *</Label>
            <Textarea
              id='procedure'
              value={formData.procedure}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, procedure: e.target.value }))
              }
              placeholder='Enter step-by-step cooking instructions'
              rows={6}
              required
            />
          </div>

          {/* Ingredients */}
          <div className='space-y-2'>
            <Label>Ingredients</Label>

            {/* Add Ingredient */}
            <div className='flex gap-2'>
              <Select onValueChange={handleAddIngredient}>
                <SelectTrigger className='flex-1'>
                  <SelectValue placeholder='Select an ingredient to add' />
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
                type='button'
                variant='outline'
                size='sm'
                disabled={getAvailableOptions().length === 0}
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            {/* Selected Ingredients */}
            {getSelectedIngredients().length > 0 && (
              <div className='flex flex-wrap gap-2 mt-2'>
                {getSelectedIngredients().map((ingredient) => (
                  <div
                    key={ingredient!.id}
                    className='flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm'
                  >
                    {ingredient!.name}
                    <button
                      type='button'
                      onClick={() => handleRemoveIngredient(ingredient!.id)}
                      className='hover:bg-blue-200 rounded-full p-0.5'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className='flex gap-2 justify-end'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : dish
                ? "Update Dish"
                : "Create Dish"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
