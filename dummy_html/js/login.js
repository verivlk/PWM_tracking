fetch('../data.json')
    .then(res => res.json())
    .then(data => {

        // Fill the form fields
        const form = document.querySelector('.login-box form');
        const fields = [
            { name: "username", type: "text",     label: "Username", placeholder: "Enter username" },
            { name: "password", type: "password", label: "Password", placeholder: "Enter password" }
        ];

        fields.forEach(field => {
            const div = document.createElement('div');
            div.innerHTML = inputField(field);
            form.prepend(div);
        });

        // Handle login
        document.querySelector('.btn').addEventListener('click', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const user = data.users.find(u =>
                u.username === username && u.password === password
            );

            if (user) {
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid username or password');
            }
        });

    });