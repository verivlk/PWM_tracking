// js/login.js

document.addEventListener('DOMContentLoaded', async function () {
    const data = await fetchData();
    await renderLogin(data);
});


async function renderLogin(data) {
    const form = document.querySelector('.login-box form');
    if (!form) return;

    // Login fields defined locally since they are always fixed (username + password)
    const fields = [
        { name: 'username', type: 'text',     label: 'Username' },
        { name: 'password', type: 'password', label: 'Password' }
    ];

    // Render input fields using the same input-space.html template
    await renderList('.login-box form', '/templates/lists/input-space.html', fields);

    // After renderList, find each input and set its correct type and id
    // (fillClone sets textContent/label, but type and id need extra handling)
    fields.forEach(field => {
        const label = form.querySelector(`[data-field="label"]`);
        const input = form.querySelector(`[data-field="input"]`);
        if (label) {
            label.textContent = field.label;
            label.setAttribute('for', field.name);
            label.removeAttribute('data-field');
        }
        if (input) {
            input.type = field.type;
            input.id = field.name;
            input.name = field.name;
            input.placeholder = `Enter ${field.label.toLowerCase()}`;
            input.required = true;
            input.removeAttribute('data-field');
        }
    });

    // Remove old placeholder link
    form.querySelector('a.btn')?.remove();

    // Submit button
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn';
    btn.textContent = 'Login';
    form.appendChild(btn);

    // Authentication against data.users
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