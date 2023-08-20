import { useEffect, useState } from 'react';
import { CURRY, SALADS, DESSERTS } from '../../helpers/utils';

const RecipeIngredients = ({ dish, ingredients, bag }) => {
  const { numOfItems, ...dishIngredients } = dish.ingredients;

  return (
    <div className="text-xxs sm:text-xs flex items-center">
      <p>Ingr.: </p>
      {Array.from(Object.entries(dishIngredients)).map((obj, i) => {
        const [ingredient, count] = obj;
        const hasEnough = bag[ingredient] >= count;
        let imgSrc = '';

        ingredients.find((el) => {
          if (el[0] === ingredient) {
            imgSrc = el[1].photo;
          }
        });

        return (
          <p
            key={`${dish.name.split(' ').join('-')}-${i}`}
            className="flex items-center mr-4"
          >
            <span className="rounded-full flex-shrink-0 bg-amber-100 p-1">
              <img src={imgSrc} className="w-4 sm:w-5 lg:w-7" />
            </span>{' '}
            <span
              className={`font-semibold ${
                hasEnough ? 'text-gray-700' : 'text-red-600'
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
          <div className="bg-yellow-100 rounded-l-xl">
            <img className="w-20 lg:w-40" src={dish.photo} />
          </div>
          <div className="px-5 py-2 lg:py-10 flex flex-col justify-between flex-1 flex-shrink">
            <h3 className="text-sm md:text-lg font-bold">{dish.name}</h3>
            <RecipeIngredients
              category={category}
              dish={dish}
              ingredients={ingredients}
              bag={bag}
            />
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
    <div className="max-h-[60vh] overflow-scroll overflow-x-hidden rounded-b-2xl border-t border-t-yellow-500">
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
