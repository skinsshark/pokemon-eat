import Button from './Button';

export default function Bag({ bag, ingredients, setBag }) {
  return (
    <div className="grid grid-cols-3 lg:grid-cols-5">
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
      count: prevBag.count + 1,
    }));
  };

  const decrementCount = () => {
    setBag((prevBag) => ({
      ...prevBag,
      [name]: Math.max(currCount - 1, 0),
      count: Math.max(prevBag.count - 1, 0),
    }));
  };

  return (
    <div className="relative rounded-2xl border-yellow-500 border m-3 cursor-pointer bg-white">
      <img
        className="inline-block p-4 pb-16 lg:p-7 lg:pb-16"
        src={data.photo}
        onClick={incrementCount}
      />
      <div
        onClick={incrementCount}
        className="absolute left-0 right-0 bottom-0 text-xs lg:text-md font-bold text-amber-900 border border-amber-800 bg-yellow-300 text-center rounded-b-[15px] p-2"
      >
        {name}
        {bag[name] > 0 ? (
          <div className="absolute text-sm sm:text-md md:text-sm lg:text-md xl:text-lg top-[-2em] right-3 text-right">
            x{bag[name]}
          </div>
        ) : null}
      </div>
      {bag[name] > 0 ? (
        <div
          className="rounded-full absolute bg-white top-[-0.5rem] right-[-0.5rem]"
          // onClick={decrementCount}
        >
          {/* <div className="rounded-full border-gray-300 border w-8 h-8 text-center pt-[1px]">
            —
          </div> */}
          <Button onClick={decrementCount} title="—" width="fixed" />
        </div>
      ) : null}
    </div>
  );
};
