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
        enableSmartView 
    );
}

function enableSmartView(container) {
    const wrappers = container.querySelectorAll('.worker-wrapper');
    const detailsView = document.getElementById('details-view');
    if (detailsView && window.innerWidth >= 900) {
        const first = wrappers[0];
        if (first) {
            first.classList.add('open');
            updateBigDisplay(first);
        }
    }

    wrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const isMobile = window.innerWidth < 900;
            
            if (isMobile || !detailsView) {
                wrapper.classList.toggle('open');
            } else {
                wrappers.forEach(w => w.classList.remove('open'));
                wrapper.classList.add('open');
                updateBigDisplay(wrapper);
            }
        });
    });
}