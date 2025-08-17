import psycopg2
import psycopg2.extras
import os
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        self._db_host     = os.getenv("DB_HOST", "db")
        self._db_name     = os.getenv("DB_NAME", "db_docker")
        self._db_user     = os.getenv("DB_USER", "postgres")  
        self._db_password = os.getenv("DB_PASSWORD", "admin123")

    def _get_connection(self): 
        conn = psycopg2.connect(
            host=self._db_host,
            database=self._db_name,
            user=self._db_user,
            password=self._db_password,
            port=5432
        )
        return conn 
    
    def execute_query(self, query, params=None):
        try:
            with self._get_connection() as conn:
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
                    cursor.execute(query, params or ())
                    if query.strip().upper().startswith("SELECT"):
                        return cursor.fetchall()
                    conn.commit()
                    return None
        except Exception as e:
            logger.error(f"Query failed: {query} | Error: {str(e)}")
            raise
