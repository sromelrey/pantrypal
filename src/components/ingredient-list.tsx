"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Package } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { usePantryPalStore } from "@/lib/store";
import { deleteIngredient } from "@/lib/actions";
import { Ingredient } from "@/lib/types";

interface IngredientListProps {
  ingredients: Ingredient[];
  onEdit: (ingredient: Ingredient) => void;
}

export function IngredientList({ ingredients, onEdit }: IngredientListProps) {
  const { addToast } = useToast();

  const handleDelete = async (ingredient: Ingredient) => {
    if (!confirm(`Are you sure you want to delete "${ingredient.name}"?`)) {
      return;
    }

    try {
      const result = await deleteIngredient(ingredient.id);
      if (result.success) {
        usePantryPalStore.getState().deleteIngredient(ingredient.id);
        addToast({
          title: "Success",
          description: "Ingredient deleted successfully!",
          type: "success",
        });
      } else {
        addToast({
          title: "Error",
          description: result.error || "Failed to delete ingredient",
          type: "error",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "An unexpected error occurred",
        type: "error",
      });
    }
  };

  if (ingredients.length === 0) {
    return (
      <Card>
        <CardContent className='flex flex-col items-center justify-center py-8'>
          <Package className='h-12 w-12 text-gray-400 mb-4' />
          <p className='text-gray-500 text-center'>No ingredients found</p>
          <p className='text-sm text-gray-400 text-center mt-1'>
            Add some ingredients to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {ingredients.map((ingredient) => (
        <Card key={ingredient.id} className='hover:shadow-md transition-shadow'>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Package className='h-4 w-4 text-green-500' />
              {ingredient.name}
            </CardTitle>
          </CardHeader>

          <CardContent className='pt-0'>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onEdit(ingredient)}
                className='flex-1'
              >
                <Edit className='h-4 w-4 mr-1' />
                Edit
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleDelete(ingredient)}
                className='text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
