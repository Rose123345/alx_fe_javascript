Dynamic Quote Generator

Overview
- A small demo that shows how to dynamically generate and manipulate DOM elements with vanilla JavaScript.

Files
- `index.html` - main page
- `script.js` - JavaScript logic (creates form dynamically, manages quotes/categories)
- `style.css` - simple styles

Usage
1. Open `dom-manipulation/index.html` in a browser (double-click or use a static server).
2. Use the `Category` selector to filter quotes.
3. Click `Show New Quote` to display a random quote for the selected category.
4. Add a new quote by filling the inputs and clicking `Add Quote` — the category list updates dynamically.

Notes
- The form is created dynamically by `createAddQuoteForm()` in `script.js`.
- The primary functions are `showRandomQuote()`, `createAddQuoteForm()`, and `addQuote(text, category)`.

Try it locally
- On Windows PowerShell, you can run a simple static server if you have Python installed:

```powershell
python -m http.server 8000; Start-Process "http://localhost:8000/dom-manipulation/index.html"
```

Or just open `dom-manipulation/index.html` in your browser.
