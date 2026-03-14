// load-content.js
// Generic engine — shared across all pages.
// Handles: shared structure (header, nav, footer) + utility functions.
// Each page has its own JS file that calls these utilities.


// ─── TEMPLATE LOADER ─────────────────────────────────────────────────────────
// Fetches an HTML file and returns a cloneable <template> element.

const BASE = '';

async function loadTemplate(url) {
    const response = await fetch(url);
    const text = await response.text();
    const template = document.createElement('template');
    template.innerHTML = text;
    return template;
}

// load-content.js

const Auth = {
    getUser: () => JSON.parse(sessionStorage.getItem('currentUser')),
    
    isLoggedIn: () => !!sessionStorage.getItem('currentUser'),
    
    isAdmin: () => {
        const user = Auth.getUser();
        return user && user.role === 'admin';
    },

    logout: () => {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }
};


// ─── DATA FETCHER ─────────────────────────────────────────────────────────────
// Fetches and returns the parsed data.json file.

async function fetchData() {
    const response = await fetch('/data.json');
    return response.json();
}



function basicFill(clone, item) {
    clone.querySelectorAll('[data-field]').forEach(el => {
        const field = el.getAttribute('data-field');
        const value = item[field];
        if (value === undefined) return;

        if (field === 'status') {
            el.classList.add(value);
            el.innerHTML = value === 'active' ? '&#10003;' : '&#10007;';
        } else {
            el.textContent = value;
        }
    });
}

async function renderList(containerSelector, templateUrl, items, customFiller, afterRender = null) {
    const container = document.querySelector(containerSelector);
    if (!container || !items) return;

    const tpl = await loadTemplate(templateUrl);
    const df = new DocumentFragment();

    items.forEach(item => {
        const clone = document.importNode(tpl.content, true);
        
        basicFill(clone, item);
        
        if (typeof customFiller === 'function') {
            customFiller(clone, item);
        }
        
        df.appendChild(clone);
    });

    container.innerHTML = ''; 
    container.appendChild(df);

    if (typeof afterRender === 'function') {
        afterRender(container);
    }
}
// ─── RENDER LIST ──────────────────────────────────────────────────────────────
// Generic function to render a list of items into a container.
// Fetches the template, clones it once per item, fills data-fields.

// load-content.js


// ─── RENDER TEMPLATE ──────────────────────────────────────────────────────────
// Generic function to render a single template (no data) into a container.

async function renderTemplate(containerSelector, templateUrl) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const tpl = await loadTemplate(templateUrl);
    container.appendChild(document.importNode(tpl.content, true));
}


// ─── SHARED STRUCTURE ─────────────────────────────────────────────────────────
// Inserts header (with nav inside) and footer into #wrapper on every page.
// Called automatically on DOMContentLoaded.

async function loadSharedStructure() {
    const wrapper = document.getElementById('wrapper');
    if (!wrapper) return;

    console.log('Loading from:', `${BASE}/templates/common/header.html`);  // ← aggiungi questa riga
    const headerTpl = await loadTemplate(`${BASE}/templates/common/header.html`);
    console.log('headerTpl:', headerTpl);
    wrapper.insertBefore(document.importNode(headerTpl.content, true), wrapper.firstChild);

    const headerEl = document.getElementById('main_header');
    if (headerEl) {
        const navTpl = await loadTemplate(`${BASE}/templates/common/nav.html`);
        headerEl.appendChild(document.importNode(navTpl.content, true));
    }

    const footerTpl = await loadTemplate(`${BASE}/templates/common/footer.html`);
    wrapper.appendChild(document.importNode(footerTpl.content, true));
}


// ─── AUTO-INIT ────────────────────────────────────────────────────────────────
// Loads shared structure on every page automatically.
// Each page JS file handles its own dynamic content on top of this.

// document.addEventListener('DOMContentLoaded', async function () {
    // await loadSharedStructure();
    // document.dispatchEvent(new Event('sharedStructureReady'));
// });

document.addEventListener('DOMContentLoaded', async function () {
    const protectedPages = [];
    // 'dashboard.html', 'team-detail.html'
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !Auth.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    await loadSharedStructure();
    updateAuthUI();
    
    document.dispatchEvent(new Event('sharedStructureReady'));
});

// load-content.js

function updateAuthUI() {
    const authLink = document.querySelector('a[href*="login"]');
    
    if (!authLink) console.log("Kurwaaaaaaaaaaaa");

    if (Auth.isLoggedIn()) {
        const user = Auth.getUser();
        authLink.textContent = `Logout (${user.username})`;
        authLink.href = '#'; // Blokujemy przeładowanie strony
        
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    } else {
        authLink.textContent = 'Login';
        authLink.href = 'login.html';
    }
}