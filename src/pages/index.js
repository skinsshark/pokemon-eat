import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CURRY, SALADS, DESSERTS, objToArr } from '../helpers/utils';

import Bag from './components/Bag';
import Button from './components/Button';
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
        <title>Pokemon Eat</title>
      </Head>
      {smthWrong ? (
        <h1 className="text-6xl">
          {'OH NO! Something is wrong! Please try refreshing >////<'}
        </h1>
      ) : (
        <main className="xl:flex justify-center select-none items-center">
          <section className="xl:max-w-[60%]">
            <Bag ingredients={ingredients} bag={bag} setBag={setBag} />
            {bag?.count > 0 ? (
              <Button title="Reset All" onClick={() => clearBag()} />
            ) : null}
          </section>
          <article className="mx-3 rounded-2xl border border-yellow-500">
            <ul className="ml-10">
              <li
                className={`mr-5 cursor-pointer inline-block ${
                  category == CURRY ? 'font-bold' : ''
                }`}
                onClick={() => setCategory(CURRY)}
              >
                Curry
              </li>
              <li
                className={`mr-5 cursor-pointer inline-block ${
                  category == SALADS ? 'font-bold' : ''
                }`}
                onClick={() => setCategory(SALADS)}
              >
                Salads
              </li>
              <li
                className={`mr-5 cursor-pointer inline-block ${
                  category == DESSERTS ? 'font-bold' : ''
                }`}
                onClick={() => setCategory(DESSERTS)}
              >
                Desserts
              </li>
            </ul>
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
