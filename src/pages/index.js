import Head from 'next/head'
import { useEffect, useState } from 'react'
import {objToArr} from '../helpers/utils'

const CURRY = "Curry"
const SALADS = "Salads"
const DESSERTS = "Desserts"

export default function Home() {
  const [smthWrong, setSmthWrong] = useState(false)
  const [ingredients, setIngredients] = useState([])

  const [curry, setCurry] = useState([])
  const [salads, setSalads] = useState([])
  const [desserts, setDesserts] = useState([])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/serebii')
        const {ingredients, recipes} = await res.json()

        setIngredients(objToArr(ingredients))
        setCurry(objToArr(recipes[CURRY]))
        setSalads(objToArr(recipes[SALADS]))
        setDesserts(objToArr(recipes[DESSERTS]))
      } catch (err) {
        console.error("Error: ", err)
        setSmthWrong(true)
      }
    })()
  }, [])
  
  return (
    <>
      <Head>
        <title>Pokemon Eat</title>
      </Head>
      {smthWrong ? <h1 className="text-6xl">{"OH NO! Something wrong! Please try refreshing >////<"}</h1> : (
        <main className="flex flex-wrap">
          {ingredients?.map((ingredient, i) => {
            const [name, data] = ingredient
            return (
              <img className="inline-block w-40" 
                key={`ingredient-${i}`}
                src={data.photo} 
              />
            )
          })}
          {curry?.map((c,i) => {
            const [name, data] = c
            return (
              <img className="inline-block w-40" 
                key={`curry-${i}`}
                src={data.photo} 
              />
            )
          })}
          {salads?.map((c,i) => {
            const [name, data] = c
            return (
              <img className="inline-block w-40" 
                key={`salads-${i}`}
                src={data.photo} 
              />
            )
          })}
          {desserts?.map((c,i) => {
            const [name, data] = c
            return (
              <img className="inline-block w-40" 
                key={`desserts-${i}`}
                src={data.photo} 
              />
            )
          })}
        </main>
      )}
    </>
  )
}