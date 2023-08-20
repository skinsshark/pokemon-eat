export const CURRY = "Curry";
export const SALADS = "Salads";
export const DESSERTS = "Desserts";

// convert obj from json response to array
export function objToArr(obj) {
  const arr = [];
  for (let o in obj) {
    arr.push([o, obj[o]]);
  }

  return arr;
}
