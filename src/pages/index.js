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
  const [potSize, setPotSize] = useState(15);
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
  }, [bag, category, potSize]);

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
      if (
        ingredientsUsed === recipe.ingredients.numOfItems &&
        potSize >= recipe.ingredients.numOfItems
      )
        score *= 10;

      return score * ingredientsUsed;
    }
  };

  return (
    <>
      <Head>
        <title>Pokémon Eat</title>
      </Head>
      <main className="xl:flex justify-center select-none items-end">
        {smthWrong ? (
          <h1 className="mt-40 text-center text-3xl">
            {'OH NO! Something is wrong! Please try refreshing >////<'}
          </h1>
        ) : (
          <>
            <section className="xl:w-[60%] pr-5 flex-none mb-20 xl:mb-0">
              <header className="flex justify-center my-6">
                <img
                  src="/assets/title.png"
                  className="w-4/5 md:w-1/2 xl:w-2/3"
                  alt="Pokemon Eat"
                />
              </header>
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
            <article className="mx-3 xl:w-[40%] flex flex-col items-start">
              <div className="flex w-full justify-between">
                <div className="flex justify-between border border-amber-700 bg-orange-400 text-white font-bold py-1.5 px-4 skew-x-[-8deg] rounded-md">
                  <img
                    src="/assets/recipe-list-icon.png"
                    className="w-5 self-center"
                  />
                  <h4 className="px-10">Recipe List</h4>
                </div>
                <div className="flex shadow-pot bg-white font-bold py-1.5 px-4 rounded-full">
                  <img src="/assets/pot.png" className="w-5 self-center" />
                  <div className="flex items-center pl-3 text-gray-700">
                    <p className="mr-6">Pot Size:</p>
                    <Button
                      title="-"
                      width="fixed"
                      bgColor="orange-400"
                      textColor="white"
                      borderColor="white"
                      onClick={() =>
                        setPotSize((prevPotSize) =>
                          Math.max(prevPotSize - 1, 0)
                        )
                      }
                    />
                    <p className="w-12 text-center">{potSize}</p>
                    <Button
                      title="+"
                      width="fixed"
                      bgColor="orange-400"
                      textColor="white"
                      borderColor="white"
                      onClick={() =>
                        setPotSize((prevPotSize) =>
                          Math.min(prevPotSize + 1, 1000)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border-2 px-3 border-yellow-500 mt-8 w-full">
                <CategorySelector
                  category={category}
                  setCategory={setCategory}
                />
                <Recipes
                  recipeBook={recipeBook}
                  category={category}
                  ingredients={ingredients}
                  bag={bag}
                  potSize={potSize}
                />
              </div>
            </article>
          </>
        )}
      </main>
    </>
  );
}
