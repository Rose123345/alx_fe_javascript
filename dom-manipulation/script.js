// Dynamic Quote Generator - advanced DOM manipulation
const STORAGE_KEY = 'dqg_quotes';
const SESSION_KEY = 'dqg_lastQuote';
const CATEGORY_KEY = 'dqg_lastCategory';

const quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspirational" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", category: "perseverance" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "Do what you can, with what you have, where you are.", category: "inspirational" }
];

// Cache DOM nodes
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categorySelect = document.getElementById('categorySelect');
const categoryFilter = document.getElementById('categoryFilter');
const formContainer = document.getElementById('formContainer');

// Helpers
function getCategories() {
  const set = new Set(quotes.map(q => q.category));
  return ['all', ...Array.from(set)];
}

// Persistence helpers
function saveQuotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error('Failed to save quotes to localStorage', e);
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const imported = JSON.parse(raw);
    if (Array.isArray(imported)) {
      quotes.length = 0;
      imported.forEach(q => {
        if (q && q.text && q.category) quotes.push(q);
      });
    }
  } catch (e) {
    console.error('Failed to load quotes from localStorage', e);
  }
}

function populateCategorySelect() {
  const categories = getCategories();
  // Clear existing options
  categorySelect.innerHTML = '';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat === 'all' ? 'All' : capitalize(cat);
    categorySelect.appendChild(opt);
  });
}

// New: populateCategories populates both `categorySelect` and the task-required
// `categoryFilter` dropdown. This keeps both controls in sync.
function populateCategories() {
  const categories = getCategories();
  // Helper to populate a select element
  function fill(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat === 'all' ? (selectEl.id === 'categoryFilter' ? 'All Categories' : 'All') : capitalize(cat);
      selectEl.appendChild(opt);
    });
  }
  fill(categorySelect);
  fill(categoryFilter);
}

function saveSelectedCategory() {
  try {
    localStorage.setItem(CATEGORY_KEY, categorySelect.value);
  } catch (e) {
    console.error('Failed to save selected category', e);
  }
}

function restoreSelectedCategory() {
  try {
    const saved = localStorage.getItem(CATEGORY_KEY);
    if (saved && categorySelect.querySelector(`option[value="${saved}"]`)) {
      categorySelect.value = saved;
    }
  } catch (e) {
    console.error('Failed to restore selected category', e);
  }
}

function capitalize(s){ return String(s).charAt(0).toUpperCase() + String(s).slice(1); }

// Show a random quote (optionally filtered by category)
function showRandomQuote() {
  const selected = categorySelect.value;
  const pool = (selected && selected !== 'all') ? quotes.filter(q => q.category === selected) : quotes;

  if (!pool.length) {
    renderEmpty(`No quotes in category "${selected}" yet.`);
    return;
  }

  const idx = Math.floor(Math.random() * pool.length);
  renderQuote(pool[idx]);
}

function renderEmpty(message){
  quoteDisplay.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'small';
  p.textContent = message;
  quoteDisplay.appendChild(p);
}

function renderQuote(q){
  // Clear
  quoteDisplay.innerHTML = '';

  const text = document.createElement('div');
  text.className = 'quote-text';
  text.textContent = `"${q.text}"`;

  const meta = document.createElement('div');
  meta.className = 'quote-meta';
  meta.textContent = `Category: ${capitalize(q.category)}`;

  quoteDisplay.appendChild(text);
  quoteDisplay.appendChild(meta);
  // Save last displayed quote to session storage
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(q));
  } catch (e) {
    // ignore
  }
}

// Create the add-quote form dynamically and attach to DOM
function createAddQuoteForm() {
  const form = document.createElement('div');
  form.className = 'form';

  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.id = 'newQuoteText';
  inputText.placeholder = 'Enter a new quote';
  inputText.setAttribute('aria-label', 'New quote text');

  const inputCategory = document.createElement('input');
  inputCategory.type = 'text';
  inputCategory.id = 'newQuoteCategory';
  inputCategory.placeholder = 'Enter quote category (e.g. inspirational)';
  inputCategory.setAttribute('aria-label', 'New quote category');

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', () => addQuote(inputText.value.trim(), inputCategory.value.trim()));

  const note = document.createElement('div');
  note.className = 'small';
  note.textContent = 'Tip: categories group quotes. Add a new category by typing it here.';

  form.appendChild(inputText);
  form.appendChild(inputCategory);
  form.appendChild(addBtn);
  form.appendChild(note);

  formContainer.appendChild(form);
}

// Add quote to array and update DOM
function addQuote(text, category) {
  if (!text) {
    alert('Please enter a quote text.');
    return;
  }
  if (!category) category = 'uncategorized';
  const normalizedCategory = category.toLowerCase();

  const newQ = { text, category: normalizedCategory };
  quotes.push(newQ);

  populateCategorySelect();
  saveQuotes();
  // Select the newly added category so user sees it
  categorySelect.value = normalizedCategory;
  renderQuote(newQ);

  // Clear input fields
  const textInput = document.getElementById('newQuoteText');
  const catInput = document.getElementById('newQuoteCategory');
  if (textInput) textInput.value = '';
  if (catInput) catInput.value = '';
}

// Wire up controls
newQuoteBtn.addEventListener('click', showRandomQuote);
categorySelect.addEventListener('change', () => {
  // When category changes, show a quote from that category (or message)
  saveSelectedCategory();
  showRandomQuote();
});

// Task-required function: filterQuotes reads the selection from the `categoryFilter`
// dropdown, applies it to the main select, saves it, and updates the displayed quote.
function filterQuotes() {
  if (!categoryFilter) return;
  const val = categoryFilter.value;
  if (categorySelect) categorySelect.value = val;
  saveSelectedCategory();
  showRandomQuote();
}

// Initialize UI
// Load persisted quotes first
loadQuotes();
populateCategorySelect();
restoreSelectedCategory();
createAddQuoteForm();
// Try to restore last quote from session storage
try {
  const last = sessionStorage.getItem(SESSION_KEY);
  if (last) {
    const q = JSON.parse(last);
    if (q && q.text && q.category) {
      renderQuote(q);
    } else {
      showRandomQuote();
    }
  } else {
    showRandomQuote();
  }
} catch (e) {
  showRandomQuote();
}

// JSON import/export
function exportToJsonFile() {
  try {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('Failed to export quotes: ' + e.message);
  }
}

function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const imported = JSON.parse(ev.target.result);
      if (!Array.isArray(imported)) throw new Error('JSON must be an array of quotes');
      let added = 0;
      imported.forEach(q => {
        if (q && q.text && q.category) {
          quotes.push({ text: String(q.text), category: String(q.category).toLowerCase() });
          added++;
        }
      });
      if (added) {
        saveQuotes();
        populateCategorySelect();
        // Restore the previously selected category if it still exists
        try { restoreSelectedCategory(); } catch (e) { /* ignore */ }
        // Update displayed quote for the current selection
        try { showRandomQuote(); } catch (e) { /* ignore */ }
        alert(`Imported ${added} quotes successfully.`);
      } else {
        alert('No valid quotes were found in the file.');
      }
    } catch (err) {
      alert('Failed to import quotes: ' + err.message);
    }
  };
  reader.readAsText(file);
  // reset the input so the same file can be loaded again if desired
  event.target.value = '';
}

// Wire export/import controls
const exportBtn = document.getElementById('exportJson');
const importInput = document.getElementById('importFile');
if (exportBtn) exportBtn.addEventListener('click', exportToJsonFile);
if (importInput) importInput.addEventListener('change', importFromJsonFile);

// Export functions to global for inline button usage (if needed)
window.showRandomQuote = showRandomQuote;
window.createAddQuoteForm = createAddQuoteForm;
window.addQuote = addQuote;