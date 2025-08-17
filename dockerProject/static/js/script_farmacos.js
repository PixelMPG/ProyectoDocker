// Función para cargar laboratorios en el select
async function cargarLaboratorios() {
    try {
        const response = await fetch('/api/laboratorios');
        const data = await response.json();
        
        const selectLaboratorio = document.querySelector('.form-section .select-input');
        if (selectLaboratorio && data.success) {
            selectLaboratorio.innerHTML = '<option value="">Seleccione un laboratorio</option>';
            
            data.data.forEach(lab => {
                const option = document.createElement('option');
                option.value = lab.id_laboratorio;
                option.textContent = lab.nombre;
                selectLaboratorio.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando laboratorios:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarLaboratorios();
    cargarFarmacos();
});

// Función para cargar fármacos
async function cargarFarmacos(filtro = '') {
    try {
        const url = filtro 
            ? `/api/farmacos/filtrar?termino=${encodeURIComponent(filtro)}`
            : '/api/farmacos';
            
        const response = await fetch(url);
        const data = await response.json();
        
        const tbody = document.querySelector('.drugs-table tbody');
        tbody.innerHTML = '';
        
        if (data.success && data.data.length > 0) {
            data.data.forEach(farmaco => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${farmaco.nombre}</td>
                    <td>${farmaco.presentacion}</td>
                    <td>${farmaco.efecto}</td>
                    <td>${farmaco.consumo}</td>
                    <td class="price-cell">$${farmaco.precio}</td>
                    <td>${farmaco.nombre_laboratorio}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6" class="has-text-centered">No se encontraron fármacos</td></tr>';
        }
    } catch (error) {
        console.error('Error cargando fármacos:', error);
    }
}

// Funcionalidad del modal
const labModal = document.getElementById('labModal');
const openLabModalBtn = document.getElementById('openLabModal');
const closeModalBtn = document.querySelector('.close-modal');

openLabModalBtn.addEventListener('click', () => {
    labModal.style.display = 'flex';
    setTimeout(() => {
        labModal.classList.add('modal-open');
    }, 10);
});

closeModalBtn.addEventListener('click', () => {
    labModal.classList.remove('modal-open');
    setTimeout(() => {
        labModal.style.display = 'none';
    }, 400);
});

// Cerrar modal al hacer clic fuera del contenido
labModal.addEventListener('click', (e) => {
    if (e.target === labModal) {
        labModal.classList.remove('modal-open');
        setTimeout(() => {
            labModal.style.display = 'none';
        }, 400);
    }
});

// Evento de búsqueda
document.querySelector('.search-input').addEventListener('input', function() {
    cargarFarmacos(this.value);
});

// Guardar nuevo fármaco
async function guardarFarmaco() {
    const nombre = document.getElementById('nombreFarmaco').value;
    const presentacion = document.getElementById('presentacionFarmaco').value;
    const efecto = document.getElementById('efectoFarmaco').value;
    const consumo = document.getElementById('consumoFarmaco').value;
    const precio = document.getElementById('precioFarmaco').value;
    const idLaboratorio = document.getElementById('laboratorioFarmaco').value;
    
    if (!nombre || !presentacion || !efecto || !consumo || !precio || !idLaboratorio) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    try {
        const response = await fetch('/api/farmacos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                presentacion,
                efecto,
                consumo,
                precio,
                id_laboratorio: idLaboratorio
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Fármaco registrado exitosamente');
            // Limpiar formulario
            document.querySelectorAll('.form-section input').forEach(input => input.value = '');
            // Recargar tabla
            cargarFarmacos();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar el fármaco');
    }
}

// Asignar evento al botón de registrar fármaco
document.querySelector('.form-section .action-btn').addEventListener('click', guardarFarmaco);

// Guardar nuevo laboratorio
async function guardarLaboratorio() {
    const nombre = document.querySelector('#nombreModLab').value;
    const telefono = document.querySelector('#telefonoModLab').value;
    const direccion = document.querySelector('#direcciónModLab').value;
    
    if (!nombre || !telefono || !direccion) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    try {
        const response = await fetch('/api/laboratorios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                telefono,
                direccion
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Laboratorio registrado exitosamente');
            // Limpiar formulario
            document.querySelectorAll('#labModal input').forEach(input => input.value = '');
            // Cerrar modal
            closeModalBtn.click();
            alert('Laboratorio registrado exitosamente!!!')
            // Recargar laboratorios
            cargarLaboratorios();
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar el laboratorio');
    }
}

// Asignar evento al botón de registrar laboratorio
document.querySelector('#labModal .action-btn').addEventListener('click', guardarLaboratorio);

// Efecto hover en tarjetas de laboratorios
const labCards = document.querySelectorAll('.lab-card');
labCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        card.style.borderColor = '#4f46e5';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
});