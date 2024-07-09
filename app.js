document.addEventListener('DOMContentLoaded', () => {
    const authDiv = document.getElementById('auth');
    const tasksDiv = document.getElementById('tasks');

    let token = null;

    const registerForm = document.createElement('form');
    registerForm.innerHTML = `
        <h2>Register</h2>
        <input type="text" id="register-username" placeholder="Username" required>
        <input type="password" id="register-password" placeholder="Password" required>
        <button type="button" onclick="register()">Register</button>
    `;
    authDiv.appendChild(registerForm);

    const loginForm = document.createElement('form');
    loginForm.innerHTML = `
        <h2>Login</h2>
        <input type="text" id="login-username" placeholder="Username" required>
        <input type="password" id="login-password" placeholder="Password" required>
        <button type="button" onclick="login()">Login</button>
    `;
    authDiv.appendChild(loginForm);

    window.register = () => {
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;
        fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }).then(response => response.text()).then(data => {
            alert(data);
        });
    };

    window.login = () => {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }).then(response => response.json()).then(data => {
            if (data.auth) {
                token = data.token;
                authDiv.style.display = 'none';
                loadTasks();
            } else {
                alert('Invalid credentials');
            }
        });
    };

    const loadTasks = () => {
        fetch(`/tasks/1`, { // assuming user_id is 1 for now
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            tasksDiv.innerHTML = '<h2>Tasks</h2>';
            data.forEach(task => {
                const taskDiv = document.createElement('div');
                taskDiv.classList.add('task');
                taskDiv.innerHTML = `
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p class="status">${task.status}</p>
                `;
                tasksDiv.appendChild(taskDiv);
            });
        });
    };
});
