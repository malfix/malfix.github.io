(function () {
  "use strict";

  const STORAGE_KEY = "malfix.lang";
  const LANGUAGES = ["it", "en"];
  const FALLBACK = "en";

  const COPY = {
    it: {
      title: "Emanuele Malfarà — product engineer",
      description: "Product engineer. Un prodotto alla volta."
    },
    en: {
      title: "Emanuele Malfarà — product engineer",
      description: "Product engineer. One product at a time."
    }
  };

  const root = document.documentElement;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  const translatable = document.querySelectorAll("[data-it]");
  const otherLabel = document.getElementById("other");
  const switcher = document.getElementById("switch");

  function readStored() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function writeStored(language) {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      return;
    }
  }

  function fromBrowser() {
    const preferred = (navigator.language || FALLBACK).toLowerCase();
    return preferred.startsWith("it") ? "it" : "en";
  }

  function resolve() {
    const requested = new URLSearchParams(location.search).get("lang");
    if (LANGUAGES.includes(requested)) {
      return requested;
    }
    const stored = readStored();
    if (LANGUAGES.includes(stored)) {
      return stored;
    }
    return fromBrowser();
  }

  function counterpart(language) {
    return language === "it" ? "en" : "it";
  }

  function apply(language) {
    const other = counterpart(language);

    root.lang = language;
    document.title = COPY[language].title;

    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", COPY[language].description);
    }

    translatable.forEach(function (node) {
      const value = node.getAttribute("data-" + language);
      if (value) {
        node.textContent = value;
      }
    });

    otherLabel.textContent = other;
    switcher.setAttribute("href", "?lang=" + other);

    writeStored(language);
  }

  let current = resolve();
  apply(current);
  document.body.classList.add("is-animated");

  switcher.addEventListener("click", function (event) {
    event.preventDefault();
    current = counterpart(current);
    apply(current);
    history.replaceState(null, "", current === FALLBACK ? location.pathname : "?lang=" + current);
  });
})();
