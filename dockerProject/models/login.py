from .database import Database


class Login:
    def __init__(self, data=None):
        #self.username = username
        self._database = Database()
        #self.password = password

    def validate(self , email, password):
        sql = "SELECT nombre, correo FROM public.usuarios"
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql)
            results = cursor.fetchall()
            cursor.close()
            conn.close()
            columns = ["nombre", "correo"]
            data = [dict(zip(columns, row)) for row in results]

            return {
                "success": True,
                "message": "consulta exitosa",
                "data": data
            }, 200
        
        except Exception as e:
            return {
                "success": False,
                "message": str(e),
                "data": []
            }, 500