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
                       db='Project_pt2',
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


# # Authenticates the login
# @api.route('/loginAuth', methods=['GET', 'POST'])
# def loginAuth():
#     # grabs information from the forms
#     username = request.form('username')
#     password = request.form('password')

#     # cursor used to send queries
#     cursor = conn.cursor()
#     # executes query
#     query = 'SELECT * FROM user WHERE username = %s and password = %s'
#     cursor.execute(query, (username, password))
#     # stores the results in a variable
#     data = cursor.fetchone()
#     # use fetchall() if you are expecting more than 1 data row
#     cursor.close()
#     error = None
#     if (data):
#         # creates a session for the the user
#         # session is a built in
#         session['username'] = username
#         return jsonify({"success": "User registered successfully"})
#     else:
#         # returns an error message to the html page
#         error = 'Invalid login or username'
#         return jsonify({"error": error})

# Authenticates the register


# Authenticates the login
@api.route('/loginAuth', methods=['GET', 'POST'])
def loginAuth():
    # Grab information from the form
    username = request.form.get('username')
    password = request.form.get('password')

    # Check if the username and password are valid
    cursor = conn.cursor()
    query = 'SELECT * FROM user WHERE username = %s AND password = %s'
    cursor.execute(query, (username, password))
    data = cursor.fetchone()
    cursor.close()

    # If the username and password are valid, store the username in the session
    if data:
        session['username'] = username
        return jsonify({"success": "User logged in successfully."})

    # If the username and password are not valid, return an error message
    else:
        error = 'Invalid login or username.'
        return jsonify({"error": error})

@api.route('/loginAuths', methods=['GET', 'POST'])
def loginAuths():
    # Grab information from the form
    username = request.form.get('username')
    pwd = request.form.get('pwd')

    # Check if the username and password are valid
    cursor = conn.cursor()
    query = 'SELECT * FROM user WHERE username = %s AND pwd = %s'
    cursor.execute(query, (username, pwd))
    data = cursor.fetchone()
    cursor.close()

    # If the username and password are valid, store the username in the session
    if data:
        session['username'] = username
        return jsonify({"success": "User logged in successfully."})

    # If the username and password are not valid, return an error message
    else:
        error = 'Invalid login or username.'
        return jsonify({"error": error})


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




@api.route('/registerAuths', methods=['POST'])
def registerAuths():
    # Grabs information from the form data
    username = request.form['username']
    pwd = request.form['pwd']
    fname = request.form['fname']
    lname = request.form['lname']
    nickname = request.form['nickname']
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
        ins = 'INSERT INTO user VALUES(%s,%s,%s,%s)'
        cursor.execute(ins, (username, pwd,fname,lname,nickname))
        conn.commit()
        cursor.close()
        return jsonify({"success": "User registered successfully"})


@api.route('/home')
def home():
    user = session['username']
    cursor = conn.cursor()
    query = 'SELECT user.username, song.title, rateSong.stars, rateSong.ratingDate FROM user JOIN rateSong ON user.username = rateSong.username JOIN song ON song.songID = rateSong.songID WHERE %s = user.username ORDER by rateSong.ratingDate'
    cursor.execute(query, (user))
    data = cursor.fetchall()
    cursor.close()
    return jsonify(username=user, posts=data)

@api.route('/logout')
def logout():
    session.pop('username')
    return redirect('/')