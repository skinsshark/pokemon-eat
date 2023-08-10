import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Home() {
  const [ingredients, setIngredients] = useState([])

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/serebii')
      const {ingredients} = await res.json()

      const ingredientsArr = []
      for (let i in ingredients) {
        ingredientsArr.push([i, ingredients[i]])
      }
  
      setIngredients(ingredientsArr)
    })()
  }, [])
  
  return (
    <>
      <Head>
        <title>Pokemon Eat</title>
      </Head>
      <main>
        {ingredients?.map((ingredient, i) => {
          const [name, data] = ingredient
          return (
            <img className="inline-block" 
              key={`ingredient-${i}`}
              src={data.photo} 
            />
          )
        })}
      </main>
    </>
  )
}
