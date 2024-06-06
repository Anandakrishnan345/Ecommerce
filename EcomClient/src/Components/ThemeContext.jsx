// import React, { createContext, useContext, useState } from 'react';

// // Create a new context for the theme
// const ThemeContext = createContext();

// // Custom hook to use the theme context

// export const useTheme = () =>  useContext(ThemeContext);



// // Theme Provider component to wrap your application
// export const ThemeProvider = ({ children }) => {
//   const [isDarkMode, setIsDarkMode] = useState(false); // Initial theme state
//   console.log('initial theme state')

//   const toggleTheme = () => {
//     setIsDarkMode((prevMode) => !prevMode); // Toggle theme
//     console.log('theme toggles to dark:')
//   };

//   // Provide the theme state and toggle function to the context
//   return (
//     <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
