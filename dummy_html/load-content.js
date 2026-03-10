// load-content.js
// Loads shared structure (header, nav, footer) and injects dynamic content
// from data.json into each page based on the current page's DOM.

// ─── 1. TEMPLATE LOADER ──────────────────────────────────────────────────────
// Fetches an HTML file and returns it as a ready-to-insert DocumentFragment.

async function loadTemplate(url) {
    const response = await fetch(url);
    const text = await response.text();
    const template = document.createElement('template');
    template.innerHTML = text;
    return document.importNode(template.content, true);
}


// ─── 2. SHARED STRUCTURE ─────────────────────────────────────────────────────
// Inserts header (with nav inside) and footer into #wrapper on every page.

async function loadSharedStructure() {
    const wrapper = document.getElementById('wrapper');
    if (!wrapper) return;

    // Header (contains <header id="main_header">)
    const header = await loadTemplate('/templates/common/header.html');
    wrapper.insertBefore(header, wrapper.firstChild);

    // Nav injected inside the header
    const headerEl = document.getElementById('main_header');
    if (headerEl) {
        const nav = await loadTemplate('/templates/common/nav.html');
        headerEl.appendChild(nav);
    }

    // Footer
    const footer = await loadTemplate('/templates/common/footer.html');
    wrapper.appendChild(footer);
}


// ─── 3. DATA FETCHER ─────────────────────────────────────────────────────────

async function fetchData() {
    const response = await fetch('/data.json');
    return response.json();
}


// ─── 4. PAGE DETECTORS ───────────────────────────────────────────────────────
// Identifies the current page by checking for unique DOM elements.

const Pages = {
    isLogin:         () => !!document.querySelector('.login-box'),
    isDashboard:     () => !!document.getElementById('workers-panel') && !!document.getElementById('map-panel'),
    isTeamDetail:    () => !!document.getElementById('workers-panel') && !document.getElementById('map-panel'),
    isCreateWorker:  () => !!document.querySelector('.profile-form'),
    isSettings:      () => !!document.querySelector('.settings-box'),
};


// ─── 5. PAGE RENDERERS ───────────────────────────────────────────────────────

// LOGIN — builds username + password inputs and authenticates against data.json users
function renderLogin(data) {
    const form = document.querySelector('.login-box form');
    if (!form) return;

    // Remove all xlu placeholder divs
    form.querySelectorAll('[xlu-include-file]').forEach(el => el.remove());
    // Remove the old <a href> login link
    form.querySelector('a.btn')?.remove();

    const df = new DocumentFragment();

    // Username
    const userGroup = document.createElement('div');
    userGroup.className = 'input-group';
    userGroup.innerHTML = `
        <label for="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter username" required>
    `;
    df.appendChild(userGroup);

    // Password
    const passGroup = document.createElement('div');
    passGroup.className = 'input-group';
    passGroup.innerHTML = `
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter password" required>
    `;
    df.appendChild(passGroup);

    // Submit button
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn';
    btn.textContent = 'Login';
    df.appendChild(btn);

    form.appendChild(df);

    // Authentication: validate against users array in data.json
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const match = data.users.find(u => u.username === username && u.password === password);

        if (match) {
            sessionStorage.setItem('currentUser', JSON.stringify(match));
            window.location.href = 'dashboard.html';
        } else {
            let errorMsg = form.querySelector('.error-msg');
            if (!errorMsg) {
                errorMsg = document.createElement('p');
                errorMsg.className = 'error-msg';
                form.appendChild(errorMsg);
            }
            errorMsg.textContent = 'Invalid username or password.';
        }
    });
}


// DASHBOARD & TEAM DETAIL — both use workerRow() from workerRow.js
// Builds worker list using the exact same HTML structure as worker-row-active/inactive.html
function renderWorkerList(data) {
    const workerList = document.getElementById('worker-list');
    if (!workerList) return;

    // Clear any static xlu placeholder divs
    workerList.querySelectorAll('[xlu-include-file]').forEach(el => el.remove());

    // Use workerRow() from workerRow.js — same HTML as the .html templates
    const df = new DocumentFragment();
    data.workers.forEach(worker => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = workerRow(worker);
        df.appendChild(wrapper.firstElementChild);
    });

    workerList.appendChild(df);
}


// DASHBOARD — loads search bar template + worker list
async function renderDashboard(data) {
    // Load search bar into <search> element
    const searchEl = document.querySelector('search[xlu-include-file]');
    if (searchEl) {
        const searchFragment = await loadTemplate('/templates/search.html');
        searchEl.removeAttribute('xlu-include-file');
        searchEl.appendChild(searchFragment);
    }

    renderWorkerList(data);
}


// CREATE WORKER — builds form fields from pages.create_worker.fields in data.json
function renderCreateWorker(data) {
    const form = document.querySelector('.profile-form');
    if (!form) return;

    form.querySelectorAll('[xlu-include-file]').forEach(el => el.remove());

    const fields = data.pages.create_worker.fields;
    const df = new DocumentFragment();

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <label for="${field.name}">${field.label}</label>
            <input type="${field.type}" id="${field.name}" name="${field.name}"
                   placeholder="Enter ${field.label.toLowerCase()}" required>
        `;
        df.appendChild(div);
    });

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn';
    btn.textContent = 'Create Worker';
    df.appendChild(btn);

    form.appendChild(df);
}


// SETTINGS — builds setting items from pages.settings.items in data.json
// Matches the structure of setting-item.html and setting-button.html
function renderSettings(data) {
    const settingsBox = document.querySelector('.settings-box');
    if (!settingsBox) return;

    settingsBox.querySelectorAll('[xlu-include-file]').forEach(el => el.remove());

    const items = data.pages.settings.items;
    const df = new DocumentFragment();

    // Setting items — mirrors setting-item.html structure
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'setting-item';
        div.innerHTML = `
            <div class="text-group">
                <span class="label">${item.label}</span>
                <span class="description">Manage your ${item.label.toLowerCase()} preferences</span>
            </div>
            <div class="toggle">
                <input type="checkbox" id="setting-${item.id}">
            </div>
        `;
        df.appendChild(div);
    });

    // Save button — mirrors setting-button.html structure
    const btnWrapper = document.createElement('div');
    btnWrapper.className = 'setting-button';
    btnWrapper.innerHTML = `
        <span>Settings</span>
        <button type="button" class="btn">Save</button>
    `;
    df.appendChild(btnWrapper);

    settingsBox.appendChild(df);
}


// ─── 6. MAIN ENTRY POINT ─────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async function () {

    await loadSharedStructure();

    const data = await fetchData();

    if      (Pages.isLogin())        renderLogin(data);
    else if (Pages.isDashboard())    renderDashboard(data);
    else if (Pages.isTeamDetail())   renderWorkerList(data);
    else if (Pages.isCreateWorker()) renderCreateWorker(data);
    else if (Pages.isSettings())     renderSettings(data);
    // map.html — only shared structure needed, no dynamic content

});