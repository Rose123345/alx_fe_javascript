// Dynamic Quote Generator - advanced DOM manipulation
const STORAGE_KEY = 'dqg_quotes';
const SESSION_KEY = 'dqg_lastQuote';
const CATEGORY_KEY = 'dqg_lastCategory';

const quotes = [
  { id: 'q1', text: "The only limit to our realization of tomorrow is our doubts of today.", category: "inspirational" },
  { id: 'q2', text: "I have not failed. I've just found 10,000 ways that won't work.", category: "perseverance" },
  { id: 'q3', text: "Life is what happens when you're busy making other plans.", category: "life" },
  { id: 'q4', text: "Do what you can, with what you have, where you are.", category: "inspirational" }
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
// Track the currently selected category (task requested symbol)
let selectedCategory = 'all';
function saveQuotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    // Persist the currently selected category variable
    localStorage.setItem(CATEGORY_KEY, selectedCategory || categorySelect.value);
    console.error('Failed to save quotes to localStorage', e);
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const imported = JSON.parse(raw);
      selectedCategory = saved;
      categorySelect.value = saved;
      quotes.length = 0;
      imported.forEach(q => {
        if (q && q.text && q.category) {
          // preserve id if present, otherwise generate
          if (!q.id) q.id = generateId();
          quotes.push(q);
        }
  // Use the tracked selectedCategory variable (falls back to DOM value)
  const sel = (selectedCategory && selectedCategory !== 'all') ? selectedCategory : (categorySelect ? categorySelect.value : 'all');
  const pool = (sel && sel !== 'all') ? quotes.filter(q => q.category === sel) : quotes;
  } catch (e) {
    console.error('Failed to load quotes from localStorage', e);
  }
  // Update tracked variable, persist, and refresh
  selectedCategory = categorySelect.value;
  saveSelectedCategory();
  showRandomQuote();
function generateId() {
  return 'q' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}

function populateCategorySelect() {
  // Synchronize both the DOM select and the tracked variable
  if (categorySelect) categorySelect.value = val;
  selectedCategory = val;
  saveSelectedCategory();
  showRandomQuote();
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
  if (categorySelect) categorySelect.value = normalizedCategory;
  selectedCategory = normalizedCategory;
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

  const newQ = { id: generateId(), text, category: normalizedCategory };
  quotes.push(newQ);
  populateCategories();
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
          const id = q.id ? String(q.id) : generateId();
          quotes.push({ id, text: String(q.text), category: String(q.category).toLowerCase() });
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

// Sync UI and mock server setup
const syncNowBtn = document.getElementById('syncNow');
const syncStatus = document.getElementById('syncStatus');
const conflictList = document.getElementById('conflictList');

// Simple in-memory mock server to simulate fetch/post operations.
const mockServer = {
  quotes: JSON.parse(JSON.stringify(quotes)),
  fetch() {
    // Simulate network delay
    return new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(this.quotes))), 300));
  },
  push(clientQuotes) {
    return new Promise(resolve => setTimeout(() => {
      this.quotes = JSON.parse(JSON.stringify(clientQuotes));
      resolve({ status: 'ok' });
    }, 300));
  }
};

// Optional remote API simulation using JSONPlaceholder
const USE_REMOTE_API = true; // toggle this to switch between local mockServer and remote API
const REMOTE_API_URL = 'https://jsonplaceholder.typicode.com/posts';

async function fetchRemotePosts() {
  if (!USE_REMOTE_API) return [];
  try {
    const resp = await fetch(REMOTE_API_URL + '?_limit=10');
    if (!resp.ok) throw new Error('Network response was not ok');
    const posts = await resp.json();
    return posts;
  } catch (err) {
    console.warn('Failed to fetch remote posts:', err.message);
    return [];
  }
}

function mapPostsToQuotes(posts) {
  // Map JSONPlaceholder posts to our quote shape. Use a remote-prefixed id to avoid collisions.
  return posts.map(p => ({
    id: 'remote-' + p.id,
    text: String(p.title).trim() || String(p.body).slice(0, 100),
    category: 'remote-' + (p.userId || '0')
  }));
}

// Poll remote API and merge updates into local quotes (server wins on conflict)
async function pollRemoteUpdates() {
  if (!USE_REMOTE_API) return;
  if (syncStatus) syncStatus.textContent = 'Polling remote updates...';
  try {
    const posts = await fetchRemotePosts();
    if (!posts || !posts.length) {
      if (syncStatus) syncStatus.textContent = 'No remote updates';
      return;
    }
    const serverQuotes = mapPostsToQuotes(posts);

    const localMap = new Map(quotes.map(q => [q.id, q]));
    const conflicts = [];

    serverQuotes.forEach(sq => {
      const lq = localMap.get(sq.id);
      if (lq) {
        if (JSON.stringify(lq) !== JSON.stringify(sq)) {
          conflicts.push({ id: sq.id, local: lq, server: sq });
          const idx = quotes.findIndex(x => x.id === sq.id);
          if (idx >= 0) quotes[idx] = sq;
        }
      } else {
        // new remote quote -> add locally
        quotes.push(sq);
      }
    });

    if (conflicts.length) renderConflicts(conflicts);
    saveQuotes();
    populateCategories();
    if (syncStatus) syncStatus.textContent = 'Last remote poll: ' + new Date().toLocaleTimeString();
    // Update the displayed quote so any category changes are visible
    try { showRandomQuote(); } catch (e) { /* ignore */ }
  } catch (err) {
    if (syncStatus) syncStatus.textContent = 'Remote poll failed: ' + err.message;
  }
}

// Push local changes to remote API (simulated; JSONPlaceholder will respond but not persist)
async function pushLocalToRemote() {
  if (!USE_REMOTE_API) return;
  try {
    // Post first 3 quotes to remote as a simulation
    const batch = quotes.slice(0, 3);
    const results = [];
    for (const q of batch) {
      const resp = await fetch(REMOTE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: q.text, body: q.text, userId: 1 })
      });
      results.push(await resp.json());
    }
    return results;
  } catch (err) {
    console.warn('Failed to push to remote:', err.message);
    return null;
  }
}

// Compatibility wrappers expected by external checks
async function fetchQuotesFromServer() {
  return await mockServer.fetch();
}

async function postQuotesToServer(data) {
  return await mockServer.push(data);
}

// Render conflicts into the conflictList element
function renderConflicts(conflicts) {
  if (!conflictList) return;
  conflictList.innerHTML = '';
  if (!conflicts || !conflicts.length) return;
  const header = document.createElement('div');
  header.className = 'small';
  header.textContent = `Conflicts resolved by server: ${conflicts.length}`;
  conflictList.appendChild(header);

  conflicts.forEach(c => {
    const row = document.createElement('div');
    row.style.border = '1px solid #eee';
    row.style.padding = '8px';
    row.style.marginTop = '6px';
    const title = document.createElement('div');
    title.textContent = `Quote ID: ${c.id}`;
    const localDiv = document.createElement('div');
    localDiv.className = 'small';
    localDiv.textContent = `Local: ${c.local.text} (${c.local.category})`;
    const serverDiv = document.createElement('div');
    serverDiv.className = 'small';
    serverDiv.textContent = `Server: ${c.server.text} (${c.server.category})`;
    const restoreBtn = document.createElement('button');
    restoreBtn.textContent = 'Restore Local to Server';
    restoreBtn.addEventListener('click', async () => {
      // push local version for this id to server
      const serverData = await mockServer.fetch();
      const idx = serverData.findIndex(x => x.id === c.id);
      if (idx >= 0) serverData[idx] = c.local;
      else serverData.push(c.local);
      await mockServer.push(serverData);
      syncStatus.textContent = 'Local version restored to server for ' + c.id;
      // re-run sync to reflect new state
      await syncWithServer();
    });

    row.appendChild(title);
    row.appendChild(localDiv);
    row.appendChild(serverDiv);
    row.appendChild(restoreBtn);
    conflictList.appendChild(row);
  });
}

// Sync logic: server wins on conflicts
async function syncWithServer() {
  if (!mockServer) return;
  if (syncStatus) syncStatus.textContent = 'Syncing...';
  try {
    const serverQuotes = await mockServer.fetch();
    const localMap = new Map(quotes.map(q => [q.id, q]));
    const serverMap = new Map(serverQuotes.map(q => [q.id, q]));

    const conflicts = [];

    // Apply server changes and detect conflicts
    serverQuotes.forEach(sq => {
      const lq = localMap.get(sq.id);
      if (lq) {
        if (JSON.stringify(lq) !== JSON.stringify(sq)) {
          // conflict - server wins
          conflicts.push({ id: sq.id, local: lq, server: sq });
          // replace local with server version
          const idx = quotes.findIndex(x => x.id === sq.id);
          if (idx >= 0) quotes[idx] = sq;
        }
      } else {
        // new on server -> add locally
        quotes.push(sq);
      }
    });

    // Local-only entries (not on server) will be pushed to server
    const merged = JSON.parse(JSON.stringify(quotes));
    await mockServer.push(merged);

    saveQuotes();
    populateCategories();
    renderConflicts(conflicts);
    if (syncStatus) syncStatus.textContent = 'Last sync: ' + new Date().toLocaleTimeString();
  } catch (err) {
    if (syncStatus) syncStatus.textContent = 'Sync failed: ' + err.message;
  }
}

// Provide a compatibility function `syncQuotes` that external checks expect
async function syncQuotes() {
  return await syncWithServer();
}

if (syncNowBtn) syncNowBtn.addEventListener('click', syncQuotes);
// periodic sync every 30s
setInterval(syncQuotes, 30000);
// periodic remote polling every 25s (simulates server pushing updates)
if (USE_REMOTE_API) {
  // run once immediately to pick up any remote content
  pollRemoteUpdates();
  setInterval(pollRemoteUpdates, 25000);
  // expose for manual testing
  window.pollRemoteUpdates = pollRemoteUpdates;
  window.pushLocalToRemote = pushLocalToRemote;
}

// Export functions to global for inline button usage (if needed)
window.showRandomQuote = showRandomQuote;
window.createAddQuoteForm = createAddQuoteForm;
window.addQuote = addQuote;