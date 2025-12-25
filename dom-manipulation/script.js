// =====================================
// Load Quotes from Local Storage
// =====================================
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "Success is not final, failure is not fatal.", category: "Motivation" },
  { id: 2, text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" },
  { id: 3, text: "Education is the most powerful weapon.", category: "Education" }
];

// DOM References
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");
const categoryFilter = document.getElementById("categoryFilter");
const syncStatus = document.getElementById("syncStatus");

// =====================================
// Save Quotes
// =====================================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// =====================================
// Populate Categories
// =====================================
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const saved = localStorage.getItem("selectedCategory");
  if (saved) categoryFilter.value = saved;
}

// =====================================
// Show Random Quote
// =====================================
function showRandomQuote() {
  const selected = categoryFilter.value;
  const list = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  if (list.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }

  const quote = list[Math.floor(Math.random() * list.length)];
  quoteDisplay.innerHTML = `"${quote.text}" <br /><small>${quote.category}</small>`;
  sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote));
}

// =====================================
// Filter Quotes
// =====================================
function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  quoteDisplay.innerHTML = "";

  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);

  filtered.forEach(q => {
    quoteDisplay.innerHTML += `"${q.text}" <br /><small>${q.category}</small><hr />`;
  });
}

// =====================================
// Create Add Quote Form
// =====================================
function createAddQuoteForm() {
  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const btn = document.createElement("button");
  btn.textContent = "Add Quote";
  btn.addEventListener("click", addQuote);

  formContainer.append(textInput, categoryInput, btn);
}

// =====================================
// Add Quote
// =====================================
function addQuote() {
  const text = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (!text || !category) return alert("All fields required.");

  quotes.push({
    id: Date.now(),
    text,
    category
  });

  saveQuotes();
  populateCategories();
  filterQuotes();
}

// =====================================
// EXPORT / IMPORT JSON
// =====================================
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    filterQuotes();
    alert("Quotes imported successfully!");
  };
  reader.readAsText(event.target.files[0]);
}

// =====================================
// SERVER SYNC SIMULATION (REQUIRED)
// =====================================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from server
async function fetchFromServer() {
  const response = await fetch(SERVER_URL);
  const data = await response.json();

  // Convert posts → quotes
  return data.slice(0, 5).map(post => ({
    id: post.id,
    text: post.title,
    category: "Server"
  }));
}

// Sync Logic (SERVER WINS)
async function syncWithServer() {
  try {
    const serverQuotes = await fetchFromServer();

    // Conflict Resolution: Server takes precedence
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();

    syncStatus.textContent = "✔ Data synced with server (server version applied)";
    setTimeout(() => (syncStatus.textContent = ""), 3000);
  } catch (error) {
    syncStatus.textContent = "⚠ Sync failed";
  }
}

// =====================================
// Periodic Sync (REQUIRED)
// =====================================
setInterval(syncWithServer, 30000); // every 30 seconds

// =====================================
// Event Listener
// =====================================
newQuoteButton.addEventListener("click", showRandomQuote);

// =====================================
// Initialize App
// =====================================
createAddQuoteForm();
populateCategories();
filterQuotes();
syncWithServer();
