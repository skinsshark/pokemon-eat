import { JSDOM } from "jsdom";

const getData = async (req, res) => {
  // ingredients!
  const ingredientsPage = await fetch(
    "https://www.serebii.net/pokemonsleep/ingredients.shtml"
  );
  const ingredientsHTML = await ingredientsPage.text();

  const ingredientsDOM = new JSDOM(ingredientsHTML);
  const ingredientsDocument = ingredientsDOM.window.document;
  const ingredientsTable = ingredientsDocument.querySelectorAll(".dextable")[1];

  // could make dynamic
  const INGREDIENTS_MAP = ["photo", "name", "description", "base_strength"];
  const ingredients = {};

  for (let i = 1; i < ingredientsTable.rows.length; i++) {
    const name = ingredientsTable.rows[i].cells[1].textContent; //name column
    ingredients[name] = {};
  }

  // i=0 is the table header
  for (let i = 1; i < ingredientsTable.rows.length; i++) {
    const row = ingredientsTable.rows[i];
    const ing = ingredients[row.cells[1].textContent]; // current ingredient
    for (let j = 0; j < row.cells.length - 1; j++) {
      if (j === 1 || j === 2) continue; // don't need to deal with name column and don't want description
      const cell = row.cells[j];

      if (j === 0) {
        const imgElement = cell.querySelector("img");
        ing[INGREDIENTS_MAP[j]] = imgElement
          .getAttribute("src")
          .replace("pokemonsleep", "assets");
      } else {
        ing[INGREDIENTS_MAP[j]] = cell.textContent;
      }
    }
  }

  // recipes!
  const dishesPage = await fetch(
    "https://www.serebii.net/pokemonsleep/dishes.shtml"
  );
  const dishesHTML = await dishesPage.text();

  const dishesDOM = new JSDOM(dishesHTML);
  const dishesDocument = dishesDOM.window.document;

  const recipeTables = Array.from(dishesDocument.querySelectorAll(".dextable"));
  const categories = Array.from(dishesDocument.querySelectorAll("h2"));
  categories.shift(); // remove "Dish Strength" table

  // could make dynamic
  const RECIPES_MAP = ["photo", "name", "description", "ingredients"];
  const CATEGORIES_MAP = [];
  let recipes = [];
  categories.forEach((category) => {
    const heading = category.textContent.split(" ");
    const title = heading[heading.length - 1];
    // recipes[title] = {};
    CATEGORIES_MAP.push(title);
  });

  const categoriesWithRecipes = {};

  // for each curry, salad, dessert table
  for (let k = 1; k < recipeTables.length; k++) {
    const table = recipeTables[k];
    const category = CATEGORIES_MAP[k - 1];

    // i=0 is the table header, i=1 is the "mixed" dishes
    for (let i = 2; i < table.rows.length; i++) {
      const row = table.rows[i];
      const dish = {
        [RECIPES_MAP[1]]: row.cells[1].textContent,
      };

      for (let j = 0; j < row.cells.length; j++) {
        if (j === 1 || j === 2) continue; // don't need to deal with name column and description
        const cell = row.cells[j];

        if (j === 0) {
          const imgElement = row.cells[0].querySelector("img");
          dish[RECIPES_MAP[0]] = imgElement
            .getAttribute("src")
            .replace("pokemonsleep", "assets");
        } else if (j === 3) {
          // clean ingredients string
          const list = {};
          let numOfItems = 0;
          const matches = cell.textContent?.match(/([^*]+) \* (\d+)/g);
          matches?.forEach((ing) => {
            const [item, count] = ing.split(" * ");
            const num = parseInt(count);
            list[item] = num;
            numOfItems += num;
          });
          dish[RECIPES_MAP[3]] = {
            ...list,
            numOfItems,
          };
        } else {
          dish[RECIPES_MAP[j]] = cell.textContent;
        }
      }

      recipes.push(dish); // Push the recipe object into the category array
    }

    categoriesWithRecipes[category] = recipes.sort(
      (a, b) => b.ingredients.numOfItems - a.ingredients.numOfItems
    );
    recipes = []; // reset recipes for next category
  }

  res.status(200).json({
    ingredients,
    recipes: categoriesWithRecipes,
  });
};

export default getData;
