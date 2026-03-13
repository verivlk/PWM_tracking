// js/dashboard.js

document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData();
    await renderDashboard(data);
});

async function renderDashboard(data) {
    await renderTemplate('#workers-panel search', '/templates/lists/input-space.html');
    await renderTemplate('#workers-panel search', '/templates/search.html');

    await renderList(
        '#worker-list', 
        '/templates/lists/worker-row.html', 
        data.workers, 
        enableAccordion 
    );
}

function enableAccordion(container) {
    const wrappers = container.querySelectorAll('.worker-wrapper');
    
    wrappers.forEach(wrapper => {
        const btn = wrapper.querySelector('.expand');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                wrapper.classList.toggle('open');
            });
        }
    });
}