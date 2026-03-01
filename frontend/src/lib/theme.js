const THEME_KEY = "ems_theme";

export const getSavedTheme = () => {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return "light";
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  root.setAttribute("data-bs-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
};

export const toggleTheme = (currentTheme) => (currentTheme === "dark" ? "light" : "dark");
