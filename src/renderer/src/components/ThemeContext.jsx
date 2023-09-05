/**
 @usage
 const { currentTheme, toggleTheme } = useContext(ThemeContext);
 toggleTheme("system"); // system, light, dark
 */


import React, { createContext, useState, useEffect } from "react";
import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(webLightTheme);

  const toggleTheme = (theme) => {
    switch (theme.toLowerCase()) {
      case "light":
        setTheme(webLightTheme);
        break;
      case "dark":
        setTheme(webDarkTheme);
        break;
      case "system":
        const prefersDarkMode = window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDarkMode ? webDarkTheme : webLightTheme);
        break;
    }
  };

  // useEffect(() => {
  //   const prefersDarkMode = window.matchMedia &&
  //     window.matchMedia("(prefers-color-scheme: dark)").matches;
  //   setCurrentTheme(prefersDarkMode ? webDarkTheme : webLightTheme);
  // }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <FluentProvider theme={theme} className={"h-screen"}>
        {children}
      </FluentProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
