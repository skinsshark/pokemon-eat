import { useEffect, useState } from "react";
import { objToArr } from "../../helpers/utils";

export default function Bag({ bag, ingredients, setBag }) {
  return (
    <div className="grid grid-cols-5">
      {ingredients?.map((ingredient, i) => (
        <Ingredient
          key={`ingredient-${i}`}
          ingredient={ingredient}
          bag={bag}
          setBag={setBag}
        />
      ))}
    </div>
  );
}

const Ingredient = ({ bag, ingredient, setBag }) => {
  const [name, data] = ingredient;
  const currCount = bag[name];

  const incrementCount = () => {
    setBag((prevBag) => ({
      ...prevBag,
      [name]: currCount + 1,
    }));
  };

  const decrementCount = () => {
    setBag((prevBag) => ({
      ...prevBag,
      [name]: Math.max(currCount - 1, 0),
    }));
  };

  return (
    <div className="relative rounded-2xl border-amber-300 border m-5">
      <img
        className="inline-block p-7 pb-16"
        src={data.photo}
        onClick={incrementCount}
      />
      <div className="absolute left-0 right-0 bottom-0 text-sm font-bold text-amber-900 border border-amber-800 bg-yellow-300 text-center rounded-bl-2xl rounded-br-2xl py-2">
        {name}
        {bag[name] > 0 ? (
          <div className="absolute text-lg top-[-2em] right-3 text-right">
            x{bag[name]}
          </div>
        ) : null}
      </div>
      {bag[name] > 0 ? (
        <div
          className="absolute bg-white top-[-0.5rem] right-[-0.5rem] cursor-pointer"
          onClick={decrementCount}
        >
          <div className="rounded-full border-gray-300 border w-8 h-8 text-center pt-[1px]">
            —
          </div>
        </div>
      ) : null}
    </div>
  );
};
