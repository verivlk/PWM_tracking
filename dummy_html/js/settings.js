document.addEventListener('sharedStructureReady', async function () {
    const data = await fetchData();
    await renderSettings(data);
});

async function renderSettings(data) {
    await renderList('.settings-box', '/templates/lists/setting-item-new.html', data.pages.settings.items);
    await renderTemplate('.settings-box', '/templates/lists/setting-button.html');
}
