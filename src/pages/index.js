import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CURRY, objToArr } from '../helpers/utils';

import Bag from './components/Bag';
import Button from './components/Button';
import CategorySelector from './components/CategorySelector';
import Recipes from './components/Recipes';

export default function Home() {
  const [category, setCategory] = useState(CURRY);
  const [smthWrong, setSmthWrong] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  const [recipeBook, setRecipeBook] = useState();
  const [bag, setBag] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        // const response = await fetch("/api/serebii");
        const response = await fetch('/data.txt');
        const data = await response.json();
        const { ingredients, recipes } = data;

        setIngredients(objToArr(ingredients));
        setRecipeBook(recipes);
      } catch (error) {
        console.error('Error with data file:', error);
        setSmthWrong(true);
      }
    })();
  }, []);

  const clearBag = () => {
    const newBag = {};
    if (ingredients.length > 0) {
      ingredients.forEach((ing) => (newBag[ing[0]] = 0));
      newBag.count = 0;
    }
    setBag(newBag);
  };

  useEffect(() => {
    clearBag();
  }, [ingredients]);

  useEffect(() => {
    if (recipeBook != null) {
      const updatedRecipes = [...recipeBook[category]].sort((a, b) => {
        const canFullyMakeA = canFullyMakeRecipe(a);
        const canFullyMakeB = canFullyMakeRecipe(b);
        return canFullyMakeB - canFullyMakeA;
      });

      setRecipeBook((prevRecipeBook) => ({
        ...prevRecipeBook,
        [category]: updatedRecipes,
      }));
    }
  }, [bag, category]);

  const canFullyMakeRecipe = (recipe) => {
    if (bag != null) {
      let score = 0;

      const neededIngredients = Object.keys(recipe.ingredients);
      let ingredientsUsed = 0;
      for (let i = 0; i < neededIngredients.length - 1; i++) {
        const item = neededIngredients[i];
        const availQty = bag[item];
        const reqQty = recipe.ingredients[item];

        score += Math.min(availQty, reqQty) / recipe.ingredients.numOfItems;
        if (availQty >= reqQty) {
          ingredientsUsed += Math.min(availQty, reqQty);
        }
      }

      // huge win if you can make recipe exactly
      if (ingredientsUsed === recipe.ingredients.numOfItems) score *= 10;

      return score * ingredientsUsed;
    }
  };

  return (
    <>
      <Head>
        <title>Pokémon Eat</title>
      </Head>
      <header className="flex justify-center">
        <img src="/assets/title.png" className="w-1/4" alt="My Image" />
      </header>
      {smthWrong ? (
        <h1 className="text-6xl">
          {'OH NO! Something is wrong! Please try refreshing >////<'}
        </h1>
      ) : (
        <main className="xl:flex justify-center select-none items-center">
          <section className="xl:w-[60%] pr-5 flex-none">
            <div className="flex justify-between">
              <div className="flex-grow border-b-2 flex items-stretch p-2 mr-2">
                <div className="w-3 bg-green-500" />
                <h2 className="ml-3 self-center font-semibold">
                  Choose Ingredients
                </h2>
              </div>
              <Button title="Reset All" onClick={() => clearBag()} />
            </div>
            <div className="mt-4">
              <Bag ingredients={ingredients} bag={bag} setBag={setBag} />
            </div>
          </section>
          <article className="flex-none mx-3 rounded-2xl border-2 px-3 border-yellow-500 xl:w-[40%]">
            <CategorySelector category={category} setCategory={setCategory} />
            <Recipes
              recipeBook={recipeBook}
              category={category}
              ingredients={ingredients}
              bag={bag}
            />
          </article>
        </main>
      )}
    </>
  );
}
