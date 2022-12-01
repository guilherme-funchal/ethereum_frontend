import './App.css';
import { useState, useEffect } from 'react';
import Header from './Components/Header';
import Home from './Components/Home';
import Footer from './Components/Footer';
import Sidenav from './Components/Sidenav';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';


export default function App() {

  useEffect(() => {
  }, [])

  return (
    <div className='App'>
      <Header />
      <Sidenav />
      <Home />      
      <Footer />
    </div>
  );
}

