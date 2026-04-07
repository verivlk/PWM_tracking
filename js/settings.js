// settings.js

document.addEventListener('sharedStructureReady', async function () {
    const data = await fetchData();
    const role = Auth.getUser()?.role;
    
    const settingsData = data.pages.settings;
    const container = document.getElementById('settings-container');

    const templates = {
        account: '/templates/lists/setting-button.html',
        appearance: '/templates/lists/setting-item-new.html',
        management: '/templates/lists/setting-button.html'
    };

    container.innerHTML = '';

    for (const [sectionKey, items] of Object.entries(settingsData)) {
        if (sectionKey === 'management' && role !== 'admin') continue;

        const header = document.createElement('h2');
        header.className = 'section-title';
        header.textContent = sectionKey.toUpperCase();
        container.appendChild(header);

        const box = document.createElement('div');
        box.className = 'settings-box';
        const boxId = `settings-${sectionKey}`;
        box.id = boxId;
        container.appendChild(box);

        await renderList(
            `#${boxId}`,
            templates[sectionKey] || templates.account,
            items,
            (clone, item) => fillSettingItem(clone, item, sectionKey)
        );
    }
});


function fillSettingItem(clone, item, sectionKey) {
    const el = clone.querySelector('.setting-item');
    
    const labelEl = el.querySelector('.label');
    const descEl = el.querySelector('.description');
    if (labelEl) labelEl.textContent = item.label;
    if (descEl) descEl.textContent = item.description;

    if (sectionKey === 'appearance') {
        const checkbox = el.querySelector('input[type="checkbox"]');
        if (checkbox) {
            checkbox.checked = localStorage.getItem('darkMode') === 'enabled';
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'disabled');
                }
            });
        }
    }

    el.addEventListener('click', async function (e) {
        if (e.target.tagName.toLowerCase() === 'input' || e.target.classList.contains('toggle')) {
            return;
        }

        document.querySelectorAll('.setting-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        updateRightPanel(item);
    });
}

async function updateRightPanel(item) {
    const panel = document.getElementById('right-panel');
    const backButton = `<button class="btn back-btn" onclick="closeSettingsPanel()">← Back to List</button>`;

    if (!item.fields || item.fields.length === 0) {
        panel.innerHTML = `
            ${backButton}
            <h2>${item.label.toUpperCase()}</h2>
            <p class="right-panel-hint">${item.description || 'No additional settings for this option.'}</p>
        `;
    } else {
        panel.innerHTML = `
            ${backButton}
            <h2>${item.label.toUpperCase()}</h2>
            <p>${item.description}</p>
            <form class="right-panel-form" id="settings-form" onsubmit="handleFormSubmit(event)">
            </form>
        `;

        await renderList('#settings-form', '/templates/lists/input-space.html', item.fields, fillInputSpace);

        const form = document.getElementById('settings-form');
        const btnText = item.submitText || 'Save Changes';
        
        const btn = document.createElement('button');
        btn.type = 'submit';
        btn.className = 'btn panel-btn';
        btn.textContent = btnText;
        form.appendChild(btn);
    }

    if (window.innerWidth <= 768) {
        panel.classList.add('show');
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
}

function closeSettingsPanel() {
    document.getElementById('right-panel').classList.remove('show');
    document.querySelectorAll('.setting-item').forEach(i => i.classList.remove('active'));
}