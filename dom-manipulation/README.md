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
5. Quotes are persisted to `localStorage` automatically. Added quotes will survive page reloads.
6. The last displayed quote is stored in `sessionStorage` and will be restored during the same browser session.

Persistence & Storage
- **localStorage**: All quotes are saved to browser local storage and automatically restored on page load. Your quotes persist across browser sessions.
- **sessionStorage**: The last displayed quote is cached in session storage. It will be restored if you reload the page within the same session, but clears when the browser is closed.

Import / Export JSON
- **Export**: Click the `Export JSON` button to download your quotes as a `quotes.json` file.
- **Import**: Use the file input to select and upload a `.json` file containing an array of quote objects with `text` and `category` properties. Valid quotes will be merged into your current list and automatically saved to localStorage.

Example JSON format for import:
```json
[
  { "text": "Example quote 1", "category": "inspirational" },
  { "text": "Example quote 2", "category": "life" }
]
```

Notes
- The form is created dynamically by `createAddQuoteForm()` in `script.js`.
 - Key functions: `showRandomQuote()`, `createAddQuoteForm()`, `addQuote(text, category)`, `exportToJsonFile()`, `importFromJsonFile()`, `saveQuotes()`, `loadQuotes()`.

Try it locally
- On Windows PowerShell, you can run a simple static server if you have Python installed:

```powershell
python -m http.server 8000; Start-Process "http://localhost:8000/dom-manipulation/index.html"
```

Or just open `dom-manipulation/index.html` in your browser.
