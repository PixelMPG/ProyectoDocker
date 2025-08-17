document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch("/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'email': email,
                'password': password
            })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = "/empleados";
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Error de conexión con el servidor");
    }
});