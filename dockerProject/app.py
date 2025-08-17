from flask import Flask, render_template
from flask import request, redirect, url_for, jsonify
from models.login import Login
from models.empelados import Employee
from models.farmacias import DrugStore
from models.farmacos import MedDrug
from models.stock import Stock
from models.laboratorios import Laboratorio

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    try:
        # Obtener datos del formulario
        email = request.form.get("email")
        password = request.form.get('password')
 
        if not email or not password:
            return jsonify({
                "message": "Debe proporcionar correo y contraseña",
                "success": False
            }), 400
            
        model = Login()
        response, status = model.validate(email, password)
        return jsonify(response), status
        
    except Exception as e:
        return jsonify({
            "message": f"Error inesperado: {str(e)}",
            "success": False
        }), 500
        
# Renderizar la vista HTML
@app.route('/empleados')
def empleados():
    return render_template('empleados.html')

# Cambia el nombre del endpoint de la API
@app.route('/api/empleados', methods=['GET'])
def api_empleados():  # Usa un nombre diferente
    try:
        model = Employee()
        filtro = request.args.get('filtro', None)
        
        if filtro == 'encargados':
            datos, status = model.filter('encargados')
        elif filtro:
            datos, status = model.filter(filtro)
        else:
            datos, status = model.get_all()
            
        return jsonify(datos), status
    except Exception as e:
        return jsonify({
            "message": str(e),
            "success": False
        }), 500
    
@app.route('/farmacos', methods=['POST', 'GET'])
def farmacos():
    return render_template('farmacos.html')

# Endpoint para crear un nuevo fármaco
@app.route('/api/farmacos', methods=['POST'])
def api_crear_farmaco():
    try:
        data = request.json
        model = MedDrug()
        response, status = model.insert(
            data['nombre'],
            data['presentacion'],
            data['efecto'],
            data['consumo'],
            data['precio'],
            data['id_laboratorio']
        )
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

# Endpoint para crear un nuevo laboratorio
@app.route('/api/laboratorios', methods=['POST'])
def api_crear_laboratorio():
    try:
        data = request.json
        model = Laboratorio()
        response, status = model.insert(
            data['nombre'],
            data['direccion'],
            data['telefono']
        )
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

# Endpoint para filtrar fármacos
@app.route('/api/farmacos/filtrar', methods=['GET'])
def api_filtrar_farmacos():
    try:
        termino = request.args.get('termino', '')
        model = MedDrug()
        response, status = model.filter(termino)
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e),
            "data": []
        }), 500

@app.route('/farmacias', methods=['POST', 'GET'])
def farmacias():
    return render_template('farmacias.html')

@app.route('/api/farmacias', methods=['POST'])
def api_crear_farmacia():
    try:
        data = request.json
        model = DrugStore()
        response, status = model.insert(
            data['nombre'],
            data['direccion'],
            data['ciudad'],
            data['telefono']
        )
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/api/empleados', methods=['POST'])
def api_crear_empleados():
    try:
        empleados = request.json
        model = Employee()
        
        # Validar que solo haya un encargado por farmacia
        encargados_por_farmacia = {}
        for emp in empleados:
            if emp['Encargado']:
                farmacia_id = emp['ID_sucursal']
                if farmacia_id in encargados_por_farmacia:
                    return jsonify({
                        "success": False,
                        "message": f"Solo puede haber un encargado por farmacia. Farmacia {farmacia_id} ya tiene encargado"
                    }), 400
                encargados_por_farmacia[farmacia_id] = True
        
        # Guardar cada empleado
        for emp in empleados:
            response, status = model.insert(
                emp['Nombre'],
                emp['Apellido'],
                emp['Direccion'],
                emp['Telefono'],
                emp['Encargado'],
                emp['ID_sucursal']  # Solo 6 parámetros ahora
            )
            if not response['success']:
                return jsonify(response), status
        
        return jsonify({
            "success": True,
            "message": "Todos los empleados guardados exitosamente"
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@app.route('/api/farmacias', methods=['GET'])
def api_obtener_farmacias():
    try:
        model = DrugStore()
        response, status = model.get_all()
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e),
            "data": []
        }), 500

@app.route('/api/farmacos', methods=['GET'])
def api_obtener_farmacos():
    try:
        model = MedDrug()
        response, status = model.get_all()
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e),
            "data": []
        }), 500

# Endpoint para crear nuevo stock
@app.route('/api/stock', methods=['POST'])
def api_crear_stock():
    try:
        data = request.json
        model = Stock()
        response, status = model.insert(
            data['id_farmacia'],
            data['id_medicamento'],
            data['id_laboratorio'],
            data['stock_med']
        )
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@app.route('/api/stock/filtrar', methods=['GET'])
def api_filtrar_stock():
    try:
        termino = request.args.get('termino', '')
        model = Stock()
        response, status = model.filtrar(termino)
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e),
            "data": []
        }), 500
    
@app.route('/api/laboratorios', methods=['GET'])
def api_obtener_laboratorios():
    try:
        model = Laboratorio()
        response, status = model.get_all()
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e),
            "data": []
        }), 500

# Endpoint para obtener un fármaco por ID
@app.route('/api/farmacos/<int:id_farmaco>', methods=['GET'])
def api_obtener_farmaco(id_farmaco):
    try:
        model = MedDrug()
        response, status = model.get_by_id(id_farmaco)
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e),
            "data": None
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

