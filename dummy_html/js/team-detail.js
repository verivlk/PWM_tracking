document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData();
    await renderTeamDetail(data);
});

async function renderTeamDetail(data) {
    await renderList('#worker-list', '/templates/lists/worker-row.html', data.workers, enableSmartView);
}

function enableSmartView(container) {
    const wrappers = container.querySelectorAll('.worker-wrapper');
    
    wrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const isMobile = window.innerWidth < 900;
            
            if (isMobile) {
                wrapper.classList.toggle('open');
            } else {
                wrappers.forEach(w => w.classList.remove('open'));
                wrapper.classList.add('open');
                updateBigDisplay(wrapper);
            }
        });
    });
}

function updateBigDisplay(wrapper) {
    const display = document.getElementById('details-view');
    const name = wrapper.querySelector('[data-field="name"]').textContent;
    const statusHtml = wrapper.querySelector('.status').innerHTML;

    display.innerHTML = `
        <div class="big-card">
            <div class="big-avatar"></div>
            <h1>${name}</h1>
            <p>Status: ${statusHtml}</p>
            <div class="info-grid">
                <div><strong>Role:</strong><br>Team Member</div>
                <div><strong>Email:</strong><br>${name.toLowerCase().replace(' ', '.')}@app.com</div>
                <div><strong>Phone:</strong><br>+48 000 000 000</div>
                <div><strong>Location:</strong><br>Main Office</div>
            </div>
        </div>
    `;
}