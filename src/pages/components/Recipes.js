import { useEffect, useState } from "react";
import { CURRY, SALADS, DESSERTS, objToArr } from "../../helpers/utils";

const RecipeIngredients = ({ dish, ingredients, bag }) => {
  const { numOfItems, ...dishIngredients } = dish.ingredients;

  return (
    <div className="flex items-center">
      <p>Ingr.: </p>
      {Array.from(Object.entries(dishIngredients)).map((obj, i) => {
        const [ingredient, count] = obj;
        const hasEnough = bag[ingredient] >= count
        let imgSrc = "";

        ingredients.find((el) => {
          if (el[0] === ingredient) {
            imgSrc = el[1].photo;
          }
        });

        return (
          <p
            key={`${dish.name.split(" ").join("-")}-${i}`}
            className="flex items-center mr-4"
          >
            <span className="rounded-full bg-amber-100 p-1 mx-2">
              <img src={imgSrc} className="w-7" />
            </span>{" "}
            <span
              className={`font-semibold ${
                hasEnough ? "text-gray-700" : "text-red-600"
              }`}
            >
              {count}
            </span>
          </p>
        );
      })}
    </div>
  );
};

const RecipeList = ({ category, ingredients, recipes, bag }) => {
  return (
    <div className="p-5">
      {recipes?.map((dish, i) => (
        <div
          key={`${category}-${i}`}
          className="flex border border-amber-700 rounded-xl mb-6"
        >
          <div className="w-40 bg-yellow-100 rounded-l-xl">
            <img className="inline-block" src={dish.photo} />
          </div>
          <div className="px-5 py-10 flex flex-col justify-between">
            <h3 className="text-lg font-bold">{dish.name}</h3>
            <RecipeIngredients dish={dish} ingredients={ingredients} bag={bag} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Recipes({ recipeBook, category, ingredients, bag }) {
  const [curry, setCurry] = useState([]);
  const [salads, setSalads] = useState([]);
  const [desserts, setDesserts] = useState([]);

  useEffect(() => {
    if (recipeBook != null) {
      setCurry(recipeBook[CURRY]);
      setSalads(recipeBook[SALADS]);
      setDesserts(recipeBook[DESSERTS]);
    }
  }, [recipeBook]);

  return (
    <div className="max-h-[60vh] overflow-scroll rounded-b-2xl border-t border-t-yellow-500">
      {category === CURRY && (
        <RecipeList
          recipes={curry}
          ingredients={ingredients}
          category={category}
          bag={bag}
        />
      )}
      {category === SALADS && (
        <RecipeList
          recipes={salads}
          ingredients={ingredients}
          category={category}
          bag={bag}
        />
      )}
      {category === DESSERTS && (
        <RecipeList
          recipes={desserts}
          ingredients={ingredients}
          category={category}
          bag={bag}
        />
      )}
    </div>
  );
}
