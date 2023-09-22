/**
 @usage
 const { theme, toggleTheme } = useContext(ThemeContext);
 toggleTheme("system"); // system, light, dark
 */


import React, { createContext, useEffect, useState } from "react";
import { FluentProvider, webLightTheme, webDarkTheme } from "@fluentui/react-components";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({ name: "light", value: webLightTheme });

  const toggleTheme = (theme) => {
    switch (theme.toLowerCase()) {
      case "light":
        setTheme({ name: "light", value: webLightTheme });
        break;
      case "dark":
        setTheme({ name: "dark", value: webDarkTheme });
        break;
      case "system":
        const prefersDarkMode = window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches;
        prefersDarkMode ? setTheme({ name: "system", value: webDarkTheme }) : setTheme({ name: "system", value: webLightTheme });
        break;
    }
    localStorage.setItem("theme", theme);
  };

  useEffect(() => {
    const prefers = localStorage.getItem("theme");
    if (prefers) {
      toggleTheme(prefers);
    } else {
      toggleTheme("system");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <FluentProvider theme={theme.value}>
        {children}
      </FluentProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
