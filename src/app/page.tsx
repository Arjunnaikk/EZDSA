"use client"

import React from 'react'
import  { useState } from 'react'

const Home = () => {
  const [count, setCount] = useState(0)
  const handleClickMinus = () => {
    setCount(count => count - 1);
  }
  const handleClickPlus = () => {
    setCount(count => count * 10);
  }
  return (
    <>
    <div className='flex flex-row gap-2'>
    <button onClick={handleClickMinus}>-</button>
    <h1>{count}</h1>
    <button onClick={handleClickPlus}>+</button>
    </div>
    </>
  )
}

export default Home;