"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { usePantryPalStore } from "@/lib/store";
import { createIngredient, updateIngredient } from "@/lib/actions";
import {
  Ingredient,
  CreateIngredientData,
  UpdateIngredientData,
} from "@/lib/types";

interface IngredientFormProps {
  ingredient?: Ingredient;
  onClose: () => void;
  onSuccess: () => void;
}

export function IngredientForm({
  ingredient,
  onClose,
  onSuccess,
}: IngredientFormProps) {
  const { addToast } = useToast();
  const { addIngredient, updateIngredient: updateIngredientStore } =
    usePantryPalStore();

  const [formData, setFormData] = useState({
    name: ingredient?.name || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const ingredientData: CreateIngredientData | UpdateIngredientData = {
        name: formData.name,
        ...(ingredient && { id: ingredient.id }),
      };

      let result;
      if (ingredient) {
        result = await updateIngredient(ingredientData as UpdateIngredientData);
        if (result.success && result.ingredient) {
          updateIngredientStore(result.ingredient);
          addToast({
            title: "Success",
            description: "Ingredient updated successfully!",
            type: "success",
          });
        }
      } else {
        result = await createIngredient(ingredientData as CreateIngredientData);
        if (result.success && result.ingredient) {
          addIngredient(result.ingredient);
          addToast({
            title: "Success",
            description: "Ingredient created successfully!",
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
          description: result.error || "Failed to save ingredient",
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

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle className='flex items-center justify-between'>
          {ingredient ? "Edit Ingredient" : "Add New Ingredient"}
          <Button variant='ghost' size='sm' onClick={onClose}>
            <X className='h-4 w-4' />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Ingredient Name */}
          <div className='space-y-2'>
            <Label htmlFor='name'>Ingredient Name *</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder='Enter ingredient name'
              required
            />
          </div>

          {/* Submit Buttons */}
          <div className='flex gap-2 justify-end'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : ingredient
                ? "Update Ingredient"
                : "Create Ingredient"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
