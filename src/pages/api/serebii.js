import {JSDOM} from 'jsdom'

const getData = async (req, res) => {
  // ingredients!
  const ingredientsPage = await fetch('https://www.serebii.net/pokemonsleep/ingredients.shtml')
  const ingredientsHTML = await ingredientsPage.text()

  const ingredientsDOM = new JSDOM(ingredientsHTML)
  const ingredientsDocument = ingredientsDOM.window.document
  const ingredientsTable = ingredientsDocument.querySelectorAll('.dextable')[1]

  // could make dynamic
  const INGREDIENTS_MAP = ['photo', 'name', 'description', 'base_strength']
  const ingredients = {}

  for (let i = 1; i < ingredientsTable.rows.length; i++) {
    const name = ingredientsTable.rows[i].cells[1].textContent //name column
    ingredients[name] = {}
  }

  // i=0 is the table header
  for (let i = 1; i < ingredientsTable.rows.length; i++) {
    const row = ingredientsTable.rows[i];
    const ing = ingredients[row.cells[1].textContent] // current ingredient
    for (let j = 0; j < row.cells.length - 1; j++) {
        if (j===1) continue; // don't need to deal with name column
        const cell = row.cells[j];

        if (j === 0) {
          const imgElement = cell.querySelector('img')
          ing[INGREDIENTS_MAP[j]] = 
            imgElement.getAttribute('src').replace('pokemonsleep', 'assets');
        } else {
          ing[INGREDIENTS_MAP[j]] = cell.textContent
        }
    }
  }

  // recipes!
  const dishesPage = await fetch('https://www.serebii.net/pokemonsleep/dishes.shtml')
  const dishesHTML = await dishesPage.text()

  const dishesDOM = new JSDOM(dishesHTML)
  const dishesDocument = dishesDOM.window.document

  const recipeTables = Array.from(dishesDocument.querySelectorAll('.dextable'))
  const categories = Array.from(dishesDocument.querySelectorAll('h2'))
  categories.shift() // remove "Dish Strength" table

  // could make dynamic
  const RECIPES_MAP = ['photo', 'name', 'description', 'ingredients']
  const CATEGORIES_MAP = []
  const recipes = {}
  categories.forEach(category => {
    const heading = category.textContent.split(' ')
    const title = heading[heading.length - 1]
    recipes[title] = {}
    CATEGORIES_MAP.push(title)
  })

  // for each curry, salad, dessert table
  for (let k = 1; k < recipeTables.length; k++) {
    const table = recipeTables[k]
    const category = recipes[CATEGORIES_MAP[k-1]]

    // i=0 is the table header
    for (let i = 1; i < table.rows.length; i++) {
      const row = table.rows[i];
      category[row.cells[1].textContent] = {}
      const dish = category[row.cells[1].textContent] // curry: {}, ...

      for (let j = 0; j < row.cells.length; j++) {
        if (j === 1) continue; // don't need to deal with name column
        const cell = row.cells[j];

        if (j === 0) {
          const imgElement = row.cells[0].querySelector('img')
          dish[RECIPES_MAP[0]] = imgElement.getAttribute('src').replace('pokemonsleep', 'assets')
        } else {
          dish[RECIPES_MAP[j]] = cell.textContent
        }
      }
    }
  }  
  
  res.status(200).json({
    ingredients,
    recipes
  })
}

export default getData