import {JSDOM} from 'jsdom'

const getData = async (req, res) => {
  // ingredients!
  const ingredientsPage = await fetch('https://www.serebii.net/pokemonsleep/ingredients.shtml')
  const ingredientsHTML = await ingredientsPage.text()

  const ingredientsDOM = new JSDOM(ingredientsHTML)
  const ingredientsDocument = ingredientsDOM.window.document
  const ingredientsTable = ingredientsDocument.querySelectorAll('.dextable')[1]

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
  
  res.status(200).json({
    ingredients
  })
}

export default getData