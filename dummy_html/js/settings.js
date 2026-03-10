// js/settings.js

document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData();
    await renderSettings(data);
});


async function renderSettings(data) {
    // Render setting items from data.pages.settings.items
    await renderList('.settings-box', '/templates/lists/setting-item.html', data.pages.settings.items);

    // Render the save button (single template, no data)
    await renderTemplate('.settings-box', '/templates/lists/setting-button.html');
}