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

    el.addEventListener('click', function (e) {
        if (e.target.tagName.toLowerCase() === 'input' || e.target.classList.contains('toggle')) {
            return;
        }

        document.querySelectorAll('.setting-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        updateRightPanel(item);
    });
}

function updateRightPanel(item) {
    const panel = document.getElementById('right-panel');
    const backButton = `<button class="back-btn" onclick="closeSettingsPanel()">← Back to List</button>`;

    if (!item.fields || item.fields.length === 0) {
        panel.innerHTML = `
            ${backButton}
            <h2>${item.label.toUpperCase()}</h2>
            <p class="right-panel-hint">${item.description || 'No additional settings for this option.'}</p>
        `;
    } else {
        let formHtml = `<form class="right-panel-form" onsubmit="handleFormSubmit(event)">`;
        
        item.fields.forEach(field => {
            const requiredAttr = field.required ? 'required' : '';
            const minLengthAttr = field.minlength ? `minlength="${field.minlength}"` : '';
            const patternAttr = field.pattern ? `pattern="${field.pattern}"` : '';
            const type = field.type || 'text';

            formHtml += `
                <div class="form-group" style="margin-bottom: 15px;">
                    <label >${field.label}</label>
                    <input 
                        name="${field.name || field.label.toLowerCase().replace(/\s/g, '_')}"
                        type="${type}" 
                        placeholder="${field.placeholder || ''}" 
                        ${requiredAttr} 
                        ${minLengthAttr} 
                        ${patternAttr}
                        style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;"
                    />
                </div>
            `;
        });

        const btnText = item.submitText || 'Save Changes';
        formHtml += `<button type="submit" class="panel-btn">${btnText}</button></form>`;

        panel.innerHTML = `
            ${backButton}
            <h2>${item.label.toUpperCase()}</h2>
            <p style="margin-bottom:20px; color:var(--text-muted);">${item.description}</p>
            ${formHtml}
        `;
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