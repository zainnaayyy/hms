import React, { useState } from 'react';

import Navbar from '../components/Navbar';
import HomeScreen from '../screens/HomeScreen';

export default function Home() {

  //fetch the top nav tabs from api endpoint
  const navs = [
    {
      name: 'home',
      path: '/home'
    },
    {
      name: 'about',
      path: '/about'
    }
  ];

  const [activeNav, setActiveNav] = useState('home');

  return (
    <>
      <HomeScreen />
    </>
  );
}
