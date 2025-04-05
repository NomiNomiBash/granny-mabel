// src/data/RecipeData.js

// Recipe combinations for infinite craft
// Recipe combinations for noodle and juice shop
export const InfiniteRecipes = {
    // Noodle Recipes
    "Rice+Water": { name: "Rice", emoji: "🍚", color: "#FFF9C4", category: "base" },
    "Wheat Flour+Water": { name: "Noodle Dough", emoji: "🍜", color: "#F5F5F5", category: "base" },
    "Noodle Dough+Salt": { name: "Plain Noodles", emoji: "🍜", color: "#E0E0E0", category: "noodles" },
    "Plain Noodles+Vegetables": { name: "Vegetable Noodles", emoji: "🥗", color: "#81C784", category: "noodles" },
    "Plain Noodles+Soy Sauce": { name: "Soy Noodles", emoji: "🥡", color: "#455A64", category: "noodles" },
    "Plain Noodles+Eggs": { name: "Egg Noodles", emoji: "🍜", color: "#FFD54F", category: "noodles" },
    "Egg Noodles+Chicken": { name: "Chicken Noodle Soup", emoji: "🥣", color: "#FFCDD2", category: "soup" },
    "Soy Noodles+Vegetables": { name: "Veggie Stir Fry", emoji: "🥘", color: "#66BB6A", category: "main" },

    // Juice Recipes
    "Fruits+Water": { name: "Fruit Juice", emoji: "🧃", color: "#FF9800", category: "beverage" },
    "Fruit Juice+Sugar": { name: "Sweet Fruit Juice", emoji: "🍹", color: "#FFC107", category: "beverage" },
    "Fruits+Eggs": { name: "Fruit Smoothie", emoji: "🥤", color: "#FFD54F", category: "beverage" },

    // Special Combinations
    "Chicken+Salt": { name: "Seasoned Chicken", emoji: "🍗", color: "#FF5722", category: "protein" },
    "Vegetable Noodles+Soy Sauce": { name: "Asian Veggie Noodles", emoji: "🍜", color: "#4CAF50", category: "noodles" },
    "Chicken Noodle Soup+Vegetables": { name: "Hearty Chicken Soup", emoji: "🥣", color: "#FF9800", category: "soup" },
    "Sweet Fruit Juice+Rice": { name: "Fruity Rice Drink", emoji: "🥤", color: "#FFEB3B", category: "beverage" }
};

// You could extend this file with other game data as needed
// For example, recipe requirements, achievements, etc.