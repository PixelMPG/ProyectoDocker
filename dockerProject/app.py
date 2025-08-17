from flask import Flask, render_template
from flask import request, redirect, url_for,jsonify
from models.login import Login

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    try:
        email = request.args.get("email")
        password= request.args.get('password')
 
        #if not email or not password:
        #    return jsonify({"message": "Debe proporcionar un correo y/o contraseña" , "success": False}),400
        model = Login()
        response, status = model.validate(email, password)
        return jsonify(response), status
    except Exception as e:
        return jsonify({
            "message": str(e),
            "success": False
        }), 500 
    



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
    