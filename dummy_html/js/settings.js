document.addEventListener('sharedStructureReady', async function () {
    const data = await fetchData();
    const role = Auth.getUser()?.role;
    const settingsData = data.pages.settings;
    const container = document.getElementById('settings-container');

    // Map which HTML template to use for each section
    const templates = {
        account: '/templates/lists/setting-button.html',
        appearance: '/templates/lists/setting-item-new.html',
        management: '/templates/lists/setting-button.html'
    };

    // Dynamically build the left panel based on data.json
    for (const [sectionKey, items] of Object.entries(settingsData)) {
        // Hide management section from non-admins
        if (sectionKey === 'management' && role !== 'admin') continue;

        // Skip emergency if it's still in the JSON but you don't want it
        if (sectionKey === 'emergency') continue;

        // 1. Create Section Heading
        const header = document.createElement('h2');
        header.className = 'section-title';
        header.textContent = sectionKey.toUpperCase();
        container.appendChild(header);

        // 2. Create the Settings Box Container
        const box = document.createElement('div');
        box.className = 'settings-box';
        const boxId = `settings-${sectionKey}`;
        box.id = boxId;
        container.appendChild(box);

        // 3. Render the items into the new box
        await renderList(
            `#${boxId}`,
            templates[sectionKey] || '/templates/lists/setting-button.html', // fallback template
            items,
            attachSettingClickHandler
        );
    }

    // Auto-click the first available setting to populate the right panel immediately
    const firstSetting = document.querySelector('.setting-item');
    if (firstSetting && window.innerWidth > 768) { 
        firstSetting.click();
    }
});


// ─── RIGHT PANEL VIEWS ───────────────────────────────────────────────────────
const settingPanels = {
    'Change Password': `
        <h2>CHANGE PASSWORD</h2>
        <form class="right-panel-form" onsubmit="return false">
            <div class="form-group">
                <label>Current Password</label>
                <input type="password" required placeholder="Enter current password" />
            </div>
            <div class="form-group">
                <label>New Password</label>
                <input type="password" required minlength="8" placeholder="At least 8 characters" />
            </div>
            <div class="form-group">
                <label>Confirm New Password</label>
                <input type="password" required minlength="8" placeholder="Confirm new password" />
            </div>
            <button type="submit" class="panel-btn">Save</button>
        </form>`,

    'Change Email': `
        <h2>CHANGE EMAIL</h2>
        <form class="right-panel-form" onsubmit="return false">
            <div class="form-group">
                <label>New Email Address</label>
                <input type="email" required placeholder="Enter new email" />
            </div>
            <div class="form-group">
                <label>Confirm Password</label>
                <input type="password" required placeholder="Confirm your password" />
            </div>
            <button type="submit" class="panel-btn">Save</button>
        </form>`,

    'Add a Worker': `
        <h2>ADD A WORKER</h2>
        <form class="right-panel-form" onsubmit="return false">
            <div class="form-group">
                <label>First Name</label>
                <input type="text" required placeholder="First name" />
            </div>
            <div class="form-group">
                <label>Last Name</label>
                <input type="text" required placeholder="Last name" />
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" required placeholder="Worker email" />
            </div>
            <button type="submit" class="panel-btn">Register Worker</button>
        </form>`,

    'Register an Admin': `
        <h2>REGISTER AN ADMIN</h2>
        <form class="right-panel-form" onsubmit="return false">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" required placeholder="Admin full name" />
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" required placeholder="Admin email" />
            </div>
            <div class="form-group">
                <label>Temporary Password</label>
                <input type="password" required placeholder="Set a temporary password" />
            </div>
            <button type="submit" class="panel-btn">Create Admin</button>
        </form>`
};


// ─── CLICK HANDLERS & LOGIC ──────────────────────────────────────────────────
function attachSettingClickHandler(clone, item) {
    const el = clone.querySelector('.setting-item');
    if (!el) return;

    // --- NEW: Dark Mode Specific Logic ---
    if (item.label === 'Dark Mode') {
        const checkbox = el.querySelector('input[type="checkbox"]');
        if (checkbox) {
            // 1. Set the initial visual state of the toggle based on saved preference
            checkbox.checked = localStorage.getItem('darkMode') === 'enabled';

            // 2. Listen for clicks on the toggle
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
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
        // Prevent triggering the right panel update if the user is just clicking the toggle switch
        if (e.target.tagName.toLowerCase() === 'input' || e.target.classList.contains('toggle')) {
            return;
        }

        // Remove active state from all items
        document.querySelectorAll('.setting-item').forEach(i => i.classList.remove('active'));
        // Add active state to clicked item
        this.classList.add('active');

        // Update the right panel content
        updateRightPanel(item.label);
    });
}

function updateRightPanel(label) {
    const panel = document.getElementById('right-panel');
    const content = settingPanels[label];

    if (content === null) return;

    const backButton = `<button class="back-btn" onclick="closeSettingsPanel()">← Back to List</button>`;

    if (content === undefined) {
        panel.innerHTML = `${backButton}<h2>${label.toUpperCase()}</h2><p class="right-panel-hint">No details available yet.</p>`;
    } else {
        panel.innerHTML = backButton + content;
    }

    // Jeśli jesteśmy na mobile, pokaż panel
    if (window.innerWidth <= 768) {
        panel.classList.add('show');
    }
}

function closeSettingsPanel() {
    document.getElementById('right-panel').classList.remove('show');
    document.querySelectorAll('.setting-item').forEach(i => i.classList.remove('active'));
}