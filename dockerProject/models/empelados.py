from .database import Database


class Employee:
    def __init__(self, data=None):
        self._database = Database()

    def insert(self, nombre, apellido, direccion, telefono, encargado, id_farmacia):
        sql = """
        INSERT INTO public.empleados 
        (nombre, apellido, direccion, telefono, encargado, id_farmacia) 
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (nombre, apellido, direccion, telefono, encargado, id_farmacia)
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql, params)
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                "success": True,
                "message": "Empleado creado exitosamente",
                "data": None
            }, 201
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": None
            }, 500
        
    def get_all(self):
        sql = "SELECT * FROM public.empleados"
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql)
            results = cursor.fetchall()
            
            columns = [desc[0] for desc in cursor.description]
            data = [dict(zip(columns, row)) for row in results]

            cursor.close()
            conn.close()
            
            return {
                "success": True,
                "message": "Consulta empleados exitosa",
                "data": data
            }, 200
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500

    def filter(self, input_value):
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            
            if input_value == 'encargados':
                sql = "SELECT * FROM empleados WHERE encargado = TRUE"
                cursor.execute(sql)
            else:
                sql = """
                SELECT * FROM empleados 
                WHERE nombre ILIKE %s OR apellido ILIKE %s
                """
                cursor.execute(sql, (f'%{input_value}%', f'%{input_value}%'))
            
            results = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            data = [dict(zip(columns, row)) for row in results]

            cursor.close()
            conn.close()
            
            return {
                "success": True,
                "message": "Filtrado exitoso",
                "data": data
            }, 200
            
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500  
