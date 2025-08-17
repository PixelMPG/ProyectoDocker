// Cargar las opciones de los selects automaticamente
async function cargarDatosSelects() {
    try {
        // Cargar farmacias
        const resFarmacias = await fetch('/api/farmacias');
        const dataFarmacias = await resFarmacias.json();
        
        const selectFarmacias = document.getElementById('selectFarmacia');
        if (selectFarmacias) {
            selectFarmacias.innerHTML = '<option value="">Seleccione una farmacia</option>';
            
            if (dataFarmacias.success) {
                dataFarmacias.data.forEach(farmacia => {
                    const option = document.createElement('option');
                    option.value = farmacia.id_farmacia;
                    option.textContent = `${farmacia.nombre} (${farmacia.id_farmacia})`;
                    selectFarmacias.appendChild(option);
                });
            }
        }
        
        // Cargar medicamentos
        const resFarmacos = await fetch('/api/farmacos');
        const dataFarmacos = await resFarmacos.json();
        
        const selectMedicamentos = document.getElementById('selectMedicamento');
        if (selectMedicamentos) {
            selectMedicamentos.innerHTML = '<option value="">Seleccione un medicamento</option>';
            
            if (dataFarmacos.success) {
                dataFarmacos.data.forEach(farmaco => {
                    const option = document.createElement('option');
                    option.value = farmaco.id_farmaco;
                    option.textContent = `${farmaco.nombre} (${farmaco.presentacion})`;
                    option.setAttribute('data-laboratorio', farmaco.id_laboratorio);
                    selectMedicamentos.appendChild(option);
                });
            }
        }
        
        // Cargar laboratorios
        const resLaboratorios = await fetch('/api/laboratorios');
        const dataLaboratorios = await resLaboratorios.json();

        const selectLaboratorios = document.getElementById('selectLaboratorio');
        if (selectLaboratorios) {
            selectLaboratorios.innerHTML = '<option value="">Seleccione un laboratorio</option>';
            
            if (dataLaboratorios.success) {
                dataLaboratorios.data.forEach(lab => {
                    const option = document.createElement('option');
                    option.value = lab.id_laboratorio;
                    option.textContent = `${lab.nombre} (${lab.id_laboratorio})`;
                    selectLaboratorios.appendChild(option);
                });
            }
        }
        
    } catch (error) {
        console.error('Error cargando datos:', error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener('DOMContentLoaded', cargarDatosSelects);

// Funcionalidad del modal
const stockModal = document.getElementById('stockModal');
const openStockModalBtn = document.getElementById('openStockModal');
const closeModalBtn = document.querySelector('.close-modal');

openStockModalBtn.addEventListener('click', () => {
    stockModal.style.display = 'flex';
    setTimeout(() => {
        stockModal.classList.add('modal-open');
    }, 10);
});

closeModalBtn.addEventListener('click', () => {
    stockModal.classList.remove('modal-open');
    setTimeout(() => {
        stockModal.style.display = 'none';
    }, 400);
});

// Cerrar modal al hacer clic fuera del contenido
stockModal.addEventListener('click', (e) => {
    if (e.target === stockModal) {
        stockModal.classList.remove('modal-open');
        setTimeout(() => {
            stockModal.style.display = 'none';
        }, 400);
    }
});

// Simulación de búsqueda
const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('.stock-table tbody tr');
    
    rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        if (rowText.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Efecto hover en tarjetas de farmacias
const pharmacyCards = document.querySelectorAll('.pharmacy-card');
pharmacyCards.forEach(card => {
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


// Funciones para gestionar empleados de farmacia
async function guardar(){
    const farmaciaData = {
        nombre: document.getElementById('name_establishment').value,
        direccion: document.getElementById('address_establishment').value,
        ciudad: document.getElementById('city_establishment').value,
        telefono: document.getElementById('number_establishment').value
    };

    try {
        // 1. Guardar farmacia primero
        const resFarmacia = await fetch('/api/farmacias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(farmaciaData)
        });
        
        const dataFarmacia = await resFarmacia.json();
        
        if (!dataFarmacia.success) {
            alert(`Error guardando farmacia: ${dataFarmacia.message}`);
            return;
        }
        
        // Obtener el ID de farmacia generado por la base de datos
        const idFarmacia = dataFarmacia.data.id_farmacia;

        // 2. Preparar datos de empleados con el ID real
        const cantidad = parseInt(document.getElementById('num_employes').value);
        const datosEmpleados = [];

        for (let i = 1; i <= cantidad; i++) {
            datosEmpleados.push({
                Nombre: document.getElementById("name_employes_" + i).value,
                Apellido: document.getElementById("last_employes_" + i).value,
                Direccion: document.getElementById("address_employes_" + i).value,
                Telefono: document.getElementById("number_employes_" + i).value,
                Encargado: document.getElementById("name_farma_" + i).checked,
                ID_sucursal: idFarmacia  // Usamos el ID real generado
            });
        }

        // 3. Guardar empleados
        const resEmpleados = await fetch('/api/empleados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosEmpleados)
        });
        
        const dataEmpleados = await resEmpleados.json();
        
        if (!dataEmpleados.success) {
            alert(`Error guardando empleados: ${dataEmpleados.message}`);
            return;
        }
        
        alert('Farmacia y empleados guardados exitosamente!');
        setTimeout(() => location.reload(), 1000);
        
    } catch (error) {
        console.error('Error en el proceso:', error);
        alert('Error en el proceso de guardado');
    }
}

function eliminarElementos() {
    var contenedor = document.getElementById('contenedor_farmacias');
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
    }
}

function crear_elementos() {
    eliminarElementos()
    var cantidad = parseInt(document.getElementById('num_employes').value);
    var cantidad_dt = document.getElementById('num_employes').value;

    if (cantidad_dt != null){
        var contenedor = document.getElementById('contenedor_farmacias');

        for (let i = 1; i <= cantidad; i++) {
            // Contenedor para cada empleado
            var empleadoContainer = document.createElement('div');
            empleadoContainer.className = 'employee-form-group';
            
            // Título del empleado
            var empleadoTitle = document.createElement('h3');
            empleadoTitle.textContent = 'Empleado ' + i;
            empleadoTitle.style.color = 'white';
            empleadoTitle.style.marginBottom = '10px';
            empleadoContainer.appendChild(empleadoTitle);
            
            // Nombre del empleado
            var nombreContainer = document.createElement('div');
            var texto_nombre_empleado = document.createElement('label');
            texto_nombre_empleado.textContent = 'Nombre:';
            texto_nombre_empleado.className = 'employee-label';
            var nombre_empleado = document.createElement('input');
            nombre_empleado.type = 'text';
            nombre_empleado.className = 'employee-input';
            nombre_empleado.id = "name_employes_" + i;
            nombreContainer.appendChild(texto_nombre_empleado);
            nombreContainer.appendChild(nombre_empleado);
            empleadoContainer.appendChild(nombreContainer);
            
            // Apellido del empleado
            var apellidoContainer = document.createElement('div');
            var texto_apellido_empleado = document.createElement('label');
            texto_apellido_empleado.textContent = 'Apellido:';
            texto_apellido_empleado.className = 'employee-label';
            var apellido_empleado = document.createElement('input');
            apellido_empleado.type = 'text';
            apellido_empleado.className = 'employee-input';
            apellido_empleado.id = 'last_employes_' + i;
            apellidoContainer.appendChild(texto_apellido_empleado);
            apellidoContainer.appendChild(apellido_empleado);
            empleadoContainer.appendChild(apellidoContainer);
            
            // Dirección del empleado
            var direccionContainer = document.createElement('div');
            var texto_direccion_empleado = document.createElement('label');
            texto_direccion_empleado.textContent = 'Dirección:';
            texto_direccion_empleado.className = 'employee-label';
            var direccion_empleado = document.createElement('input');
            direccion_empleado.type = 'text';
            direccion_empleado.className = 'employee-input';
            direccion_empleado.id = 'address_employes_' + i;
            direccionContainer.appendChild(texto_direccion_empleado);
            direccionContainer.appendChild(direccion_empleado);
            empleadoContainer.appendChild(direccionContainer);
            
            // Teléfono del empleado
            var telefonoContainer = document.createElement('div');
            var texto_telefono_empleado = document.createElement('label');
            texto_telefono_empleado.textContent = 'Teléfono:';
            texto_telefono_empleado.className = 'employee-label';
            var telefono_empleado = document.createElement('input');
            telefono_empleado.type = 'text';
            telefono_empleado.className = 'employee-input';
            telefono_empleado.id = 'number_employes_' + i;
            telefonoContainer.appendChild(texto_telefono_empleado);
            telefonoContainer.appendChild(telefono_empleado);
            empleadoContainer.appendChild(telefonoContainer);
            
            // Encargado
            var encargadoContainer = document.createElement('div');
            var texto_encargado_empleado = document.createElement('label');
            texto_encargado_empleado.textContent = 'Encargado de sucursal:';
            texto_encargado_empleado.className = 'employee-label';
            var encargado_empleado = document.createElement('input');
            encargado_empleado.type = 'checkbox';
            encargado_empleado.id = 'name_farma_' + i;
            encargado_empleado.style.marginLeft = '10px';
            encargadoContainer.appendChild(texto_encargado_empleado);
            encargadoContainer.appendChild(encargado_empleado);
            empleadoContainer.appendChild(encargadoContainer);
            
            contenedor.appendChild(empleadoContainer);
        }

        var boton_enviar = document.createElement('button');
        boton_enviar.className = 'submit-btn';
        boton_enviar.textContent = 'Guardar Farmacia y Empleados';
        boton_enviar.onclick = guardar;
        contenedor.appendChild(boton_enviar);
    }
}

// Función para cargar y filtrar stock
async function cargarStock(filtro = '') {
    try {
        const response = await fetch(`/api/stock/filtrar?termino=${encodeURIComponent(filtro)}`);
        const data = await response.json();
        
        const tbody = document.querySelector('.stock-table tbody');
        tbody.innerHTML = '';
        
        if (data.success && data.data.length > 0) {
            data.data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.nombre_medicamento}</td>
                    <td>${item.presentacion_med}</td>
                    <td>${item.nombre_farmacia}</td>
                    <td>${item.nombre_laboratorio}</td>
                    <td>${item.stock_med}</td>
                `;
                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="5" class="has-text-centered">No se encontraron resultados</td></tr>';
        }
    } catch (error) {
        console.error('Error cargando stock:', error);
    }
}

// Evento de búsqueda
document.querySelector('.search-input').addEventListener('input', function() {
    cargarStock(this.value);
});

// Cargar stock al inicio
document.addEventListener('DOMContentLoaded', () => {
    cargarStock();
    cargarDatosSelects();
});

// Función para obtener laboratorio de un medicamento
async function obtenerLaboratorioMedicamento(id_medicamento) {
    try {
        const response = await fetch(`/api/farmacos/${id_medicamento}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            return data.data.id_laboratorio;
        }
        return null;
    } catch (error) {
        console.error('Error obteniendo laboratorio:', error);
        return null;
    }
}

// Evento cuando se selecciona un medicamento
document.getElementById('selectMedicamento').addEventListener('change', async function() {
    const medicamentoId = this.value;
    const selectLaboratorio = document.getElementById('selectLaboratorio');
    
    if (medicamentoId) {
        // Obtener laboratorio del medicamento
        const idLaboratorio = await obtenerLaboratorioMedicamento(medicamentoId);
        
        if (idLaboratorio) {
            // Seleccionar automáticamente el laboratorio
            selectLaboratorio.value = idLaboratorio;
            
            // Deshabilitar el select para que no se pueda cambiar
            selectLaboratorio.disabled = true;
        } else {
            selectLaboratorio.disabled = false;
        }
    } else {
        selectLaboratorio.disabled = false;
        selectLaboratorio.value = '';
    }
});

// Función para guardar nuevo stock
async function guardarStock() {
    const farmaciaId = document.getElementById('selectFarmacia').value;
    const medicamentoId = document.getElementById('selectMedicamento').value;
    const cantidad = document.getElementById('cantidadStock').value;
    const laboratorioId = document.getElementById('selectLaboratorio').value;
    
    if (!farmaciaId || !medicamentoId || !cantidad || !laboratorioId) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    try {
        const response = await fetch('/api/stock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_farmacia: farmaciaId,
                id_medicamento: medicamentoId,
                id_laboratorio: laboratorioId,
                stock_med: cantidad
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Stock agregado exitosamente!');
            cargarStock(); // Recargar tabla
            
            // Limpiar formulario
            document.getElementById('selectFarmacia').value = '';
            document.getElementById('selectMedicamento').value = '';
            document.querySelector('#stockModal input[type="number"]').value = '';
            document.getElementById('selectLaboratorio').value = '';
            document.getElementById('selectLaboratorio').disabled = false;
            
            // Cerrar modal
            stockModal.classList.remove('modal-open');
            setTimeout(() => {
                stockModal.style.display = 'none';
            }, 400);
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error guardando stock:', error);
        alert('Error guardando stock');
    }
}

// Asignar evento al botón de guardar stock
document.querySelector('#stockModal .action-btn').addEventListener('click', guardarStock);