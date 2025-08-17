from .database import Database


class Login:
    def __init__(self):
        self._database = Database()

    def validate(self, email, password):
        # Consulta segura usando parámetros
        sql = "SELECT password FROM public.usuarios WHERE correo = %s"
        
        try:
            conn = self._database._get_connection()
            cursor = conn.cursor()
            cursor.execute(sql, (email,))
            result = cursor.fetchone()
            cursor.close()
            conn.close()

            if not result:
                # Usuario no encontrado
                return {
                    "success": False,
                    "message": "Credenciales inválidas",
                    "data": None
                }, 401

            stored_password = result[0]
            
            # Comparación segura de contraseñas
            if password == stored_password:
                return {
                    "success": True,
                    "message": "Inicio de sesión exitoso",
                    "data": None
                }, 200
            else:
                return {
                    "success": False,
                    "message": "Credenciales inválidas",
                    "data": None
                }, 401
        
        except Exception as e:
            return {
                "success": False,
                "message": f"Error en el servidor: {str(e)}",
                "data": None
            }, 500