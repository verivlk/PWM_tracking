// js/create-worker.js

document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData();
    await renderCreateWorker(data);
});


async function renderCreateWorker(data) {
    // Render one input field per entry in data.pages.create_worker.fields
    await renderList('.profile-form', '/templates/lists/input-space.html', data.pages.create_worker.fields);

    // Add submit button
    const form = document.querySelector('.profile-form');
    if (!form) return;

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn';
    btn.textContent = 'Create Worker';
    form.appendChild(btn);
}