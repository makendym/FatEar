# Import Flask Library
from flask import Flask, render_template, request, session, url_for, redirect, flash,  jsonify
import pymysql.cursors


# for uploading photo:
# from app import app
# from flask import Flask, flash, request, redirect, render_template
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])


# Initialize the app from Flask
# app = Flask(__name__)
# app.secret_key = "secret key"

# Configure MySQL
conn = pymysql.connect(host='localhost',
                       port=8889,
                       user='root',
                       password='root',
                       db='FlaskDemo',
                       charset='utf8mb4',
                       cursorclass=pymysql.cursors.DictCursor)

api = Flask(__name__)
api.secret_key = "secret key"

@api.route('/profile')
def my_profile():
    response_body = {
        "name": "Nagato",
        "about": "Hello! I'm a full stack developer that loves python and javascript"
    }

    return response_body


@api.route('/')
def hello():
    return render_template('index.html')


@api.route('/register')
def register():
    return render_template('register.html')


# Authenticates the login
@api.route('/loginAuth', methods=['GET', 'POST'])
def loginAuth():
    # grabs information from the forms
    username = request.form.get('username',"admin")
    password = request.form.get('password',"test123")

    # cursor used to send queries
    cursor = conn.cursor()
    # executes query
    query = 'SELECT * FROM user WHERE username = %s and password = %s'
    cursor.execute(query, (username, password))
    # stores the results in a variable
    data = cursor.fetchone()
    # use fetchall() if you are expecting more than 1 data row
    cursor.close()
    error = None
    if (data):
        # creates a session for the the user
        # session is a built in
        session['username'] = username
        return jsonify({"success": "User registered successfully"})
    else:
        # returns an error message to the html page
        error = 'Invalid login or username'
        return jsonify({"error": error})

# Authenticates the register


@api.route('/registerAuth', methods=['POST'])
def registerAuth():
    # Grabs information from the form data
    username = request.form['username']
    password = request.form['password']

    # Cursor used to send queries
    cursor = conn.cursor()

    # Executes query to check if the user exists
    query = 'SELECT * FROM user WHERE username = %s'
    cursor.execute(query, (username,))
    data = cursor.fetchone()

    # If the previous query returns data, then user exists
    if data:
        error = "This user already exists"
        return jsonify({"error": error})
    else:
        # Inserts new user data into the database
        ins = 'INSERT INTO user VALUES(%s, %s)'
        cursor.execute(ins, (username, password))
        conn.commit()
        cursor.close()
        return jsonify({"success": "User registered successfully"})


@api.route('/home')
def home():
    user = session['username']
    cursor = conn.cursor();
    query = 'SELECT ts, blog_post FROM blog WHERE username = %s ORDER BY ts DESC'
    cursor.execute(query, (user))
    data = cursor.fetchall()
    cursor.close()
    return jsonify(username=user, posts=data)