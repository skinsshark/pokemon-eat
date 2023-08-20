import Head from "next/head";
import { useEffect, useState } from "react";
import { objToArr } from "../helpers/utils";

import Bag from "./components/Bag";
import Recipes from "./components/Recipes";

export default function Home() {
  const [smthWrong, setSmthWrong] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  const [recipeBook, setRecipeBook] = useState();
  const [bag, setBag] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("/data.txt");
        const data = await response.json();
        const { ingredients, recipes } = data;

        setIngredients(objToArr(ingredients));
        setRecipeBook(recipes);
      } catch (error) {
        console.error("Error with data file:", error);
        setSmthWrong(true);
      }
    })();
  }, []);

  useEffect(() => {
    const newBag = {};
    if (ingredients.length > 0) {
      ingredients.forEach(ing => (newBag[ing[0]] = 0));
    }
    setBag(newBag);
  }, [ingredients]);

  useEffect(() => {
    console.log("bag change");
  }, [bag]);

  return (
    <>
      <Head>
        <title>Pokemon Eat</title>
      </Head>
      {smthWrong ? (
        <h1 className="text-6xl">
          {"OH NO! Something wrong! Please try refreshing >////<"}
        </h1>
      ) : (
        <main className="sm:flex select-none">
          <section className="flex-2 max-w-[60%]">
            <Bag ingredients={ingredients} bag={bag} setBag={setBag} />
          </section>
          <article className="flex-1">
            <Recipes recipeBook={recipeBook} />
          </article>
        </main>
      )}
    </>
  );
}
