from .database import Database

class Stock:
    def __init__(self):
        self._database = Database()

    def insert(self, id_farmacia, id_medicamento, id_laboratorio, stock_med):
        sql = """
        INSERT INTO stock 
        (id_farmacia, id_medicamento, id_laboratorio, stock_med) 
        VALUES (%s, %s, %s, %s)
        RETURNING id_stock
        """
        params = (id_farmacia, id_medicamento, id_laboratorio, stock_med)
        
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
                "message": "Stock creado exitosamente",
                "data": {"id_stock": new_id}
            }, 201
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": None
            }, 500

    def filtrar(self, termino):
        sql = """
        SELECT 
            s.id_stock,
            f.nombre AS nombre_farmacia,
            lab.nombre AS nombre_laboratorio,
            med.nombre AS nombre_medicamento,
            s.presentacion_med,
            s.stock_med
        FROM stock s
        JOIN farmacias f ON s.id_farmacia = f.id_farmacia
        JOIN laboratorios lab ON s.id_laboratorio = lab.id_laboratorio
        JOIN farmacos med ON s.id_medicamento = med.id_farmaco
        WHERE 
            f.nombre ILIKE %s OR
            lab.nombre ILIKE %s OR
            med.nombre ILIKE %s OR
            s.presentacion_med ILIKE %s
        """
        term = f"%{termino}%"
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql, (term, term, term, term))
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
        