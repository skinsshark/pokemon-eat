import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CURRY, objToArr } from '../helpers/utils';

import Bag from './components/Bag';
import Button from './components/Button';
import CategorySelector from './components/CategorySelector';
import Recipes from './components/Recipes';

export default function Home() {
  const [category, setCategory] = useState(); // localStorage
  const [smthWrong, setSmthWrong] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  const [recipeBook, setRecipeBook] = useState();
  const [potSize, setPotSize] = useState(); // localStorage
  const [bag, setBag] = useState({}); // localStorage

  useEffect(() => {
    (async () => {
      try {
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

    localStorage.setItem('bag', JSON.stringify(newBag));
    setBag(newBag);
  };

  // once ingredients are loaded in, won't retrigger because ingredients don't change, only bag
  useEffect(() => {
    if (ingredients.length > 0) {
      // get bag from local storage if saved
      const savedBag = localStorage.getItem('bag');
      if (savedBag != null) {
        setBag(() => JSON.parse(savedBag));
      } else {
        clearBag();
      }

      // get potSize from local storage if saved
      const savedPotSize = localStorage.getItem('potSize');
      if (savedPotSize != null) {
        setPotSize(() => JSON.parse(savedPotSize));
      } else {
        setPotSize(15);
      }

      // get recipe category from local storage if saved
      const savedCategory = localStorage.getItem('category');
      if (savedCategory != null) {
        setCategory(() => JSON.parse(savedCategory));
      } else {
        setCategory(CURRY);
      }
    }
  }, [ingredients]);

  // update recipes list
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

  // save pot size in localStorage when changed
  useEffect(() => {
    if (potSize != null) {
      localStorage.setItem('potSize', JSON.stringify(potSize));
    }
  }, [potSize]);

  // save recipe category in localStorage when changed
  useEffect(() => {
    if (category != null) {
      localStorage.setItem('category', JSON.stringify(category));
    }
  }, [category]);

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
        <meta property="og:title" content="Pokémon Eat" />
        <meta property="og:image" content="/assets/preview.png" />
      </Head>
      <main className="flex flex-wrap-reverse xl:flex-nowrap justify-center select-none">
        {smthWrong ? (
          <h1 className="mt-40 text-center text-3xl">
            {'OH NO! Something is wrong! Please try refreshing >////<'}
          </h1>
        ) : (
          <>
            <section className="w-full xl:w-[60%] px-3 xl:px-0 xl:pr-5 flex-none mb-20 xl:mb-0">
              {/* desktop title */}
              <header className="hidden xl:flex justify-center my-6">
                <img
                  src="/assets/title.png"
                  className="w-4/5 md:w-1/2 xl:w-2/3"
                  alt="Pokemon Eat"
                />
              </header>
              <div className="flex justify-between">
                <div className="flex-grow border-b-2 border-b-gray-200 flex items-stretch p-2 mr-2">
                  <div className="w-3 bg-green-500" />
                  <h2 className="ml-3 self-center font-semibold">
                    Choose Ingredients
                  </h2>
                </div>
                <Button
                  title="Reset All"
                  onClick={() => {
                    if (confirm('Clear your ingredients and start over?')) {
                      clearBag();
                    }
                  }}
                />
              </div>
              <div className="mt-4">
                <Bag ingredients={ingredients} bag={bag} setBag={setBag} />
              </div>
            </section>
            <article className="w-full mx-4 xl:mx-3 xl:w-[40%] flex flex-col items-start xl:mt-20">
              <div className="xl:mx-0 flex w-full items-center justify-between">
                <div className="inline-block xl:mb-0 xl:flex justify-between border border-amber-700 bg-orange-400 text-white font-bold py-1.5 px-4 skew-x-[-8deg] rounded-md">
                  <img
                    src="/assets/recipe-list-icon.png"
                    className="hidden sm:inline-block w-5 self-center"
                  />
                  <h4 className="inline-block px-4 2xl:px-10 text-sm xl:text-lg self-center">
                    Recipe List
                  </h4>
                </div>
                <div className="self-center flex shadow-pot bg-white font-bold py-1.5 px-4 rounded-full">
                  <img src="/assets/pot.png" className="w-5 self-center" />
                  <div className="flex items-center pl-3 text-gray-700">
                    <p className="mr-4 2xl:mr-6 text-sm xl:text-lg">
                      Pot Size:
                    </p>
                    <Button
                      title="-"
                      width="fixed"
                      bgColor="orange-400"
                      textColor="white"
                      borderColor="white"
                      isDisabled={potSize === 15}
                      onClick={() =>
                        setPotSize((prevPotSize) =>
                          Math.max(prevPotSize - 3, 15)
                        )
                      }
                    />
                    <p className="w-8 xl:w-12 text-center text-sm xl:text-lg">
                      {potSize}
                    </p>
                    <Button
                      title="+"
                      width="fixed"
                      bgColor="orange-400"
                      textColor="white"
                      borderColor="white"
                      isDisabled={potSize === 81}
                      onClick={() =>
                        setPotSize((prevPotSize) =>
                          Math.min(prevPotSize + 3, 81)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-yellow-500 mt-8 w-full mb-10 xl:mb-5">
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
            {/* mobile title */}
            <header className="xl:hidden w-[90vw] flex justify-center mt-2 mb-6">
              <img
                src="/assets/title.png"
                className="sm:w-4/5 md:w-1/2 xl:w-2/3"
                alt="Pokemon Eat"
              />
            </header>
          </>
        )}
      </main>
    </>
  );
}
