import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Navbar from '../../components/Navbar/Navbar.jsx'
import Banner from '../../components/Banner/Banner.jsx'
import ContinuarLendo from '../../components/ContinuarLendo/ContinuarLendo.jsx'
import Categorias from '../../components/Categorias/Categorias.jsx'
import RecemAdicionados from '../../components/RecemAdicionado/RecemAdicionados.jsx'
import Footer from '../../components/Footer/Footer.jsx'


function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <Banner></Banner>
      <ContinuarLendo></ContinuarLendo>
      <Categorias></Categorias>
      <RecemAdicionados></RecemAdicionados>
      <Footer></Footer>
    </div>
  )
}

export default Home
