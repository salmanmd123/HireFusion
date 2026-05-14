document.addEventListener('DOMContentLoaded', () => {
    const authSection = document.getElementById('auth-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const authForm = document.getElementById('auth-form');
    const toggleBtn = document.getElementById('toggle-auth');
    let isLogin = true;

    toggleBtn.addEventListener('click', () => {
        isLogin = !isLogin;
        document.getElementById('auth-title').innerText = isLogin ? 'Login' : 'Register';
        document.getElementById('reg-fields').classList.toggle('hidden', isLogin);
    });

    const checkUser = async () => {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (data.loggedIn) {
            authSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
            loadHistory();
        }
    };
    checkUser();

    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const appPassword = document.getElementById('appPassword')?.value;
        const apolloKey = document.getElementById('apolloKey')?.value;

        const endpoint = isLogin ? '/api/login' : '/api/register';
        const body = isLogin ? { email, password } : { email, password, appPassword, apolloKey };

        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            if (!isLogin) {
                alert("Registered! Please login.");
                toggleBtn.click();
            } else {
                checkUser();
            }
        } else {
            alert("Auth failed.");
        }
    });

    document.getElementById('automation-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const log = (msg) => {
            const box = document.getElementById('status-console');
            box.innerHTML += `<div>> ${msg}</div>`;
            box.scrollTop = box.scrollHeight;
        };

        log("🚀 Starting Apollo-Enriched Pipeline...");
        const formData = new FormData(e.target);

        try {
            const res = await fetch('/api/automate', { method: 'POST', body: formData });
            const data = await res.json();
            log(`✅ Success: Sent ${data.emailResults.successCount} applications.`);
            loadHistory();
        } catch (err) {
            log("🛑 Pipeline Error.");
        }
    });
});