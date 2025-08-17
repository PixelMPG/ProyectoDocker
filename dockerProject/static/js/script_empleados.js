document.addEventListener('DOMContentLoaded', async () => {
    await loadEmployees();
    
    // Botón de encargados
    document.querySelector('.filter-controls button').addEventListener('click', async () => {
        await loadEmployees('encargados');
    });
    
    // Buscador por texto
    const searchInput = document.querySelector('.filter-controls input');
    searchInput.addEventListener('keyup', async (e) => {
        if (e.key === 'Enter') {
            await loadEmployees(searchInput.value.trim());
        }
    });
});

async function loadEmployees(filter = null) {
    try {
        let url = '/api/empleados';
        if (filter) {
            url += `?filtro=${encodeURIComponent(filter)}`;
        }

        const response = await fetch(url, { method: 'GET' });
        const datos = await response.json();
        const tabla = document.querySelector('#employees-table tbody');
        tabla.innerHTML = '';

        if (datos.success && datos.data.length > 0) {
            datos.data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id_empleado}</td>
                    <td>${item.nombre}</td>
                    <td>${item.apellido}</td>
                    <td>${item.direccion}</td>
                    <td>${item.telefono}</td>
                    <td>${item.encargado ? 'Encargado' : 'Empleado'}</td>
                    <td>${item.id_farmacia}</td>
                `;
                tabla.appendChild(row);
            });
        } else {
            tabla.innerHTML = `<tr><td colspan="7" class="has-text-centered">No se encontraron empleados</td></tr>`;
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión");
    }
}
