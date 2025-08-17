from .database import Database



class MedDrug:
    def __init__(self, data=None):
        self._database = Database()
    
    def insert(self, nombre, presentacion, efecto, consumo, precio, id_laboratorio):
        sql = """
        INSERT INTO farmacos 
        (nombre, presentacion, efecto, consumo, precio, id_laboratorio) 
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id_farmaco
        """
        params = (nombre, presentacion, efecto, consumo, precio, id_laboratorio)
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql, params)
            new_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                "success": True,
                "message": "Medicamento creado exitosamente",
                "data": {"id_farmaco": new_id}
            }, 201
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": None
            }, 500

    def get_all(self):
        sql = """
        SELECT f.*, l.nombre AS nombre_laboratorio 
        FROM farmacos f
        JOIN laboratorios l ON f.id_laboratorio = l.id_laboratorio
        """
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql)
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            
            columns = [desc[0] for desc in cursor.description]
            data = [dict(zip(columns, row)) for row in results]
            
            return {
                "success": True,
                "message": "Consulta exitosa",
                "data": data
            }, 200
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500

    def filter(self, input_value):
        sql = """
        SELECT f.*, l.nombre AS nombre_laboratorio 
        FROM farmacos f
        JOIN laboratorios l ON f.id_laboratorio = l.id_laboratorio
        WHERE 
            f.nombre ILIKE %s OR 
            f.presentacion ILIKE %s OR 
            f.consumo ILIKE %s OR 
            l.nombre ILIKE %s OR 
            f.efecto ILIKE %s
        """
        term = f"%{input_value}%"
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql, (term, term, term, term, term))
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            
            columns = [desc[0] for desc in cursor.description]
            data = [dict(zip(columns, row)) for row in results]
            
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

    def get_id_by_name(self, nombre):
        sql = f"SELECT id_laboratorio FROM farmacos WHERE nombre = '{nombre}'"
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql)
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            return {
                "success": True,
                "message": "ID obtenido",
                "data": result[0] if result else None
            }, 200
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": None
            }, 500

    def get_presentation_by_name(self, nombre):
        sql = f"SELECT presentacion FROM farmacos WHERE nombre = '{nombre}'"
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql)
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            return {
                "success": True,
                "message": "Presentación obtenida",
                "data": result[0] if result else None
            }, 200
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": None
            }, 500

    def get_by_id(self, id_farmaco):
        sql = "SELECT * FROM farmacos WHERE id_farmaco = %s"
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql, (id_farmaco,))
            result = cursor.fetchone()
            cursor.close()
            conn.close()
            
            if result:
                columns = [desc[0] for desc in cursor.description]
                data = dict(zip(columns, result))
                return {
                    "success": True,
                    "message": "Medicamento obtenido",
                    "data": data
                }, 200
            else:
                return {
                    "success": False,
                    "message": "Medicamento no encontrado",
                    "data": None
                }, 404
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": None
            }, 500
