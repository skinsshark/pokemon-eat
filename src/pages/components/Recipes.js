import { useEffect, useState } from "react";
import { objToArr } from "../../helpers/utils";

const CURRY = "Curry";
const SALADS = "Salads";
const DESSERTS = "Desserts";

export default function Recipes({ recipeBook }) {
  const [curry, setCurry] = useState([]);
  const [salads, setSalads] = useState([]);
  const [desserts, setDesserts] = useState([]);

  useEffect(() => {
    if (recipeBook != null) {
      setCurry(objToArr(recipeBook[CURRY]));
      setSalads(objToArr(recipeBook[SALADS]));
      setDesserts(objToArr(recipeBook[DESSERTS]));
    }
  }, [recipeBook]);

  return (
    <div>
      {curry?.map((c, i) => {
        const [name, data] = c;
        return (
          <img
            className="inline-block w-40"
            key={`curry-${i}`}
            src={data.photo}
          />
        );
      })}
      {salads?.map((c, i) => {
        const [name, data] = c;
        return (
          <img
            className="inline-block w-40"
            key={`salads-${i}`}
            src={data.photo}
          />
        );
      })}
      {desserts?.map((c, i) => {
        const [name, data] = c;
        return (
          <img
            className="inline-block w-40"
            key={`desserts-${i}`}
            src={data.photo}
          />
        );
      })}
    </div>
  );
}
