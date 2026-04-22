import { useState, useEffect } from "react";

function Theme() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  return (
    <button id="theme-btn" onClick={toggleTheme}>
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}

export default Theme;