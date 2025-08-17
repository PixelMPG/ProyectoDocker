from .database import Database


class DrugStore:
    def __init__(self, data=None):
        self._database = Database()

    def insert(self, nombre, direccion, ciudad, telefono):
        # Usamos RETURNING para obtener el ID generado
        sql = """
        INSERT INTO farmacias 
        (nombre, direccion, ciudad, telefono) 
        VALUES (%s, %s, %s, %s)
        RETURNING id_farmacia
        """
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql, (nombre, direccion, ciudad, telefono))
            result = cursor.fetchone()
            id_generado = result[0] if result else None
            conn.commit()
            cursor.close()
            conn.close()
            
            if id_generado:
                return {
                    "success": True,
                    "message": "Farmacia creada exitosamente",
                    "data": {"id_farmacia": id_generado}
                }, 201
            else:
                return {
                    "success": False,
                    "message": "No se pudo obtener el ID de la farmacia creada",
                    "data": None
                }, 500
            
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": None
            }, 500
        
    def get_all(self):
        sql = "SELECT * FROM farmacias"
        
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

    def get_columns(self, columns):
        sql = f"SELECT {', '.join(columns)} FROM farmacias"
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql)
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            
            data = [dict(zip(columns, row)) for row in results]
            
            return {
                "success": True,
                "message": "Columnas obtenidas",
                "data": data
            }, 200
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500

