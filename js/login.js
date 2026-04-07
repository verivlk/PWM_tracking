// js/login.js

document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData();
    await renderLogin(data);
});


async function renderLogin(data) {
    const form = document.querySelector('.login-box form');
    if (!form) return;

    const fields = [
        { name: 'username', type: 'text',     label: 'Username', required: true },
        { name: 'password', type: 'password', label: 'Password', required: true }
    ];

    await renderList('.login-box form', '/templates/lists/input-space.html', fields, fillInputSpace);

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn';
    btn.textContent = 'Login';
    form.appendChild(btn);

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