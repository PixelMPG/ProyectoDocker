from .database import Database

class Laboratorio:
    def __init__(self):
        self._database = Database()

    def insert(self, nombre, direccion, telefono):
        sql = """
        INSERT INTO laboratorios 
        (nombre, direccion, telefono) 
        VALUES (%s, %s, %s)
        RETURNING id_laboratorio
        """
        params = (nombre, direccion, telefono)
        
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
                "message": "Laboratorio creado exitosamente",
                "data": {"id_laboratorio": new_id}
            }, 201
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": None
            }, 500

    def get_all(self):
        sql = "SELECT * FROM laboratorios"
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
                "message": "Consulta exitosa",
                "data": data
            }, 200
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500