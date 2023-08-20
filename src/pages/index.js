import Head from "next/head";
import { useEffect, useState } from "react";
import { CURRY, SALADS, DESSERTS, objToArr } from "../helpers/utils";

import Bag from "./components/Bag";
import Recipes from "./components/Recipes";

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
      ingredients.forEach((ing) => (newBag[ing[0]] = 0));
    }
    setBag(newBag);
  }, [ingredients]);

  useEffect(() => {
    // console.log(bag);
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
        <main className="md:flex select-none items-center">
          <section className="flex-2 md:max-w-[60%]">
            <Bag ingredients={ingredients} bag={bag} setBag={setBag} />
          </section>
          <article className="flex-1 rounded-2xl border border-yellow-500">
            <ul className="ml-10">
              <li className={`mr-5 cursor-pointer inline-block ${category==CURRY ? 'font-bold': ''}`} onClick={() => setCategory(CURRY)}>Curry</li>
              <li className={`mr-5 cursor-pointer inline-block ${category==SALADS ? 'font-bold': ''}`} onClick={() => setCategory(SALADS)}>Salads</li>
              <li className={`mr-5 cursor-pointer inline-block ${category==DESSERTS ? 'font-bold': ''}`} onClick={() => setCategory(DESSERTS)}>Desserts</li>
            </ul>
            <Recipes recipeBook={recipeBook} category={category} ingredients={ingredients} bag={bag} />
          </article>
        </main>
      )}
    </>
  );
}
