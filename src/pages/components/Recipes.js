import { useEffect, useState } from 'react';
import { CURRY, SALADS, DESSERTS } from '../../helpers/utils';

const RecipeIngredients = ({ dish, ingredients, bag, potSize }) => {
  const { numOfItems, ...dishIngredients } = dish.ingredients;

  return (
    <div className="text-xxs sm:text-xs flex items-center">
      <p className="mr-1">Ingr.: </p>
      {Array.from(Object.entries(dishIngredients)).map((obj, i) => {
        const [ingredient, count] = obj;
        let imgSrc = '';

        ingredients.find((el) => {
          if (el[0] === ingredient) {
            imgSrc = el[1].photo;
          }
        });

        return (
          <div
            key={`${dish.name.split(' ').join('-')}-${i}`}
            className="flex items-center mr-3.5"
          >
            <span className="rounded-full flex-shrink-0 bg-amber-100 p-0.5 mr-1">
              <img src={imgSrc} className="w-4 sm:w-5 lg:w-7" />
            </span>
            <span
              className={`font-semibold ${
                bag[ingredient] >= count ? 'text-gray-700' : 'text-red-600'
              }`}
            >
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const RecipeList = ({ category, ingredients, recipes, bag, potSize }) => {
  return (
    <div className="px-3 py-4">
      {recipes?.map((dish, i) => {
        let canMake = true;
        for (const item in dish.ingredients) {
          if (item !== 'numOfItems') {
            if (
              bag[item] < dish.ingredients[item] ||
              potSize < dish.ingredients.numOfItems
            ) {
              canMake = false;
            }
          }
        }

        return (
          <div
            key={`${category}-${i}`}
            className={`flex border border-amber-700 rounded-xl mb-6 ${
              canMake ? 'bg-white shadow-float' : 'opacity-70 shadow-sm-float'
            }`}
          >
            <div className="bg-yellow-100 rounded-l-xl p-1 flex">
              <img
                className="w-[4.5rem] xl:w-24 2xl:w-36 self-center"
                src={dish.photo}
              />
            </div>
            <div className="px-3 py-2 md:py-2 xl:py-10 flex flex-col justify-between flex-1 flex-shrink">
              <h3 className="text-sm xl:text-lg font-bold">{dish.name}</h3>
              <RecipeIngredients
                category={category}
                dish={dish}
                ingredients={ingredients}
                bag={bag}
                potSize={potSize}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function Recipes({
  recipeBook,
  category,
  ingredients,
  bag,
  potSize,
}) {
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
    <div className="h-[35vh] xl:h-auto xl:max-h-[41vw] overflow-scroll overflow-x-hidden px-3 rounded-b-2xl">
      {category === CURRY && (
        <RecipeList
          recipes={curry}
          ingredients={ingredients}
          category={category}
          bag={bag}
          potSize={potSize}
        />
      )}
      {category === SALADS && (
        <RecipeList
          recipes={salads}
          ingredients={ingredients}
          category={category}
          bag={bag}
          potSize={potSize}
        />
      )}
      {category === DESSERTS && (
        <RecipeList
          recipes={desserts}
          ingredients={ingredients}
          category={category}
          bag={bag}
          potSize={potSize}
        />
      )}
    </div>
  );
}
