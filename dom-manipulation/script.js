// Dynamic Quote Generator - advanced DOM manipulation

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
const formContainer = document.getElementById('formContainer');

// Helpers
function getCategories() {
  const set = new Set(quotes.map(q => q.category));
  return ['all', ...Array.from(set)];
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
  showRandomQuote();
});

// Initialize UI
populateCategorySelect();
createAddQuoteForm();
// Show an initial random quote
showRandomQuote();

// Export functions to global for inline button usage (if needed)
window.showRandomQuote = showRandomQuote;
window.createAddQuoteForm = createAddQuoteForm;
window.addQuote = addQuote;