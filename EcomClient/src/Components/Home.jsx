import React from 'react';
// import { useTheme } from './ThemeContext';

function Home() {
  // const { isDarkMode, toggleTheme } = useTheme();
  // console.log('child darkmode')

  // if (typeof isDarkMode === 'undefined') {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      <h1>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</h1>
      <button onClick={toggleTheme}>Toggle Theme</button>
      
      <div >This is the Home page</div>
    </div>
  );
}

export default Home;
