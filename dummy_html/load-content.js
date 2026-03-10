// load-content.js
// Generic engine — shared across all pages.
// Handles: shared structure (header, nav, footer) + utility functions.
// Each page has its own JS file that calls these utilities.


// ─── TEMPLATE LOADER ─────────────────────────────────────────────────────────
// Fetches an HTML file and returns a cloneable <template> element.

async function loadTemplate(url) {
    const response = await fetch(url);
    const text = await response.text();
    const template = document.createElement('template');
    template.innerHTML = text;
    return template;
}


// ─── DATA FETCHER ─────────────────────────────────────────────────────────────
// Fetches and returns the parsed data.json file.

async function fetchData() {
    const response = await fetch('/data.json');
    return response.json();
}


// ─── FILL CLONE ───────────────────────────────────────────────────────────────
// Given a cloned template fragment and a data item,
// fills every [data-field] element with the matching value.

function fillClone(clone, item) {
    clone.querySelectorAll('[data-field]').forEach(el => {
        const field = el.getAttribute('data-field');
        const value = typeof item === 'object' ? item[field] : item;

        if (value === undefined) return;

        // Status field: add CSS class + symbol
        if (field === 'status') {
            el.classList.add(value);
            el.setAttribute('aria-label', value);
            el.innerHTML = value === 'active' ? '&#10003;' : '&#10007;';
            return;
        }

        // Checkbox id field
        if (field === 'id' && el.tagName === 'INPUT') {
            el.id = `setting-${value}`;
            return;
        }

        // Default: set text content
        el.textContent = value;
    });
}


// ─── RENDER LIST ──────────────────────────────────────────────────────────────
// Generic function to render a list of items into a container.
// Fetches the template, clones it once per item, fills data-fields.

async function renderList(containerSelector, templateUrl, items) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const tpl = await loadTemplate(templateUrl);
    const df = new DocumentFragment();

    items.forEach(item => {
        const clone = document.importNode(tpl.content, true);
        fillClone(clone, item);
        df.appendChild(clone);
    });

    container.appendChild(df);
}


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

    const headerTpl = await loadTemplate('/templates/common/header.html');
    wrapper.insertBefore(document.importNode(headerTpl.content, true), wrapper.firstChild);

    const headerEl = document.getElementById('main_header');
    if (headerEl) {
        const navTpl = await loadTemplate('/templates/common/nav.html');
        headerEl.appendChild(document.importNode(navTpl.content, true));
    }

    const footerTpl = await loadTemplate('/templates/common/footer.html');
    wrapper.appendChild(document.importNode(footerTpl.content, true));
}


// ─── AUTO-INIT ────────────────────────────────────────────────────────────────
// Loads shared structure on every page automatically.
// Each page JS file handles its own dynamic content on top of this.

document.addEventListener('DOMContentLoaded', async function () {
    await loadSharedStructure();
});