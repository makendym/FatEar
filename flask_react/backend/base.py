# Import Flask Library
from flask import Flask, render_template, request, session, url_for, redirect, flash,  jsonify
import pymysql.cursors
from datetime import date

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

if __name__ == '__main__':
    api.run(debug=TRUE)



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


# @api.route('/registerAuth', methods=['POST'])
# def registerAuth():
#     # Grabs information from the form data
#     username = request.form['username']
#     password = request.form['password']

#     # Cursor used to send queries
#     cursor = conn.cursor()

#     # Executes query to check if the user exists
#     query = 'SELECT * FROM user WHERE username = %s'
#     cursor.execute(query, (username,))
#     data = cursor.fetchone()

#     # If the previous query returns data, then user exists
#     if data:
#         error = "This user already exists"
#         return jsonify({"error": error})
#     else:
#         # Inserts new user data into the database
#         ins = 'INSERT INTO user VALUES(%s, %s)'
#         cursor.execute(ins, (username, password))
#         conn.commit()
#         cursor.close()
#         return jsonify({"success": "User registered successfully"})




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
        ins = 'INSERT INTO user (username, pwd, fname, lname, nickname) VALUES (%s, %s, %s, %s, %s)'
        cursor.execute(ins, (username, pwd,fname,lname,nickname))
        conn.commit()
        cursor.close()
        return jsonify({"success": "User registered successfully"})


@api.route('/home')
def home():
    user = session.get('username')
    if user is None:
        return "User is not logged in", 401 
    return jsonify(username=user)

@api.route('/logout')
def logout():
    session.pop('username')
    return redirect('/')


@api.route('/search')
def search():
    genre = request.args.get('genre')
    search = request.args.get('search')
    rating = request.args.get('rating')
    cursor = conn.cursor()
    if genre and search:
        query = "SELECT song.songID, song.title, artist.fname, artist.lname, album.albumTitle, songGenre.genre, rateSong.stars \
                FROM song \
                JOIN artistPerformsSong ON song.songID = artistPerformsSong.songID \
                JOIN artist ON artist.artistID = artistPerformsSong.artistID \
                JOIN songInAlbum ON songInAlbum.songID = song.songID \
                JOIN album ON album.albumID = songInAlbum.albumID \
                JOIN songGenre ON songGenre.songID = song.songID \
                JOIN rateSong ON rateSong.songID = song.songID \
                WHERE songGenre.genre = %s AND artist.fname = %s"
        cursor.execute(query, (genre, search))
    elif genre:
        query = "SELECT song.songID, song.title, artist.fname, artist.lname, album.albumTitle, songGenre.genre, rateSong.stars  \
                FROM song \
                JOIN artistPerformsSong ON song.songID = artistPerformsSong.songID \
                JOIN artist ON artist.artistID = artistPerformsSong.artistID \
                JOIN songInAlbum ON songInAlbum.songID = song.songID \
                JOIN album ON album.albumID = songInAlbum.albumID \
                JOIN songGenre ON songGenre.songID = song.songID \
                JOIN rateSong ON rateSong.songID = song.songID \
                WHERE songGenre.genre = %s"
        cursor.execute(query, (genre,))
    
    elif search:
        query = "SELECT song.songID, song.title, artist.fname, artist.lname, album.albumTitle, rateSong.stars\
                FROM song JOIN artistPerformsSong ON song.songID  = artistPerformsSong.songID \
                JOIN artist ON artist.artistID = artistPerformsSong.artistID \
                JOIN songInAlbum ON songInAlbum.songID = song.songID\
                JOIN album ON album.albumID = songInAlbum.albumID\
                JOIN rateSong ON rateSong.songID = song.songID \
                WHERE artist.fname = %s"
        cursor.execute(query, (search,))
    elif rating:
        query = "SELECT song.title, artist.fname, artist.lname, AVG(rateSong.stars) AS stars\
                FROM song JOIN artistPerformsSong ON song.songID  = artistPerformsSong.songID\
                JOIN artist ON artist.artistID = artistPerformsSong.artistID\
                JOIN songInAlbum ON songInAlbum.songID = song.songID\
                JOIN album ON album.albumID = songInAlbum.albumID\
                JOIN rateSong ON rateSong.songID = song.songID\
                GROUP BY song.title, artist.fname, artist.lname\
                HAVING stars  >= %s"
        cursor.execute(query, (rating,))
    else:
        query = "SELECT * FROM song"
        cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)

@api.route('/genre', methods=['GET'])
def genre():
    cursor = conn.cursor()
    query = 'SELECT DISTINCT genre FROM songGenre'
    cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    return jsonify(genre=data)


@api.route('/create-playlist', methods=['POST'])
def createPlaylist():
    user = session['username']
    playlisttitle = request.json.get('playlisttitle')
    cursor = conn.cursor()
    if playlisttitle:
        query = 'INSERT INTO playlist (playlistTitle, username, createdAt) VALUES (%s, %s, %s)'
        cursor.execute(query, (playlisttitle, user, date.today()))
    else:
        return jsonify({"error": True, "message": "Missing playlist title"})
    conn.commit()
    cursor.close()
    return jsonify({"success": True})


@api.route('/list-user-playlist')
def listPlaylist():
    user = session['username']
    cursor = conn.cursor()
    query = 'SELECT playlistTitle FROM playlist WHERE playlist.username = %s'
    cursor.execute(query,(user))
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"success":True},data)

@api.route('/userprofile')
def userProfile():
    user = session['username']
    cursor = conn.cursor()
    query ='SELECT user.username, user.fname, user.lname, user.nickname\
            FROM user\
            WHERE user.username = %s'
    cursor.execute(query,(user))
    data = cursor.fetchall()

    query_artists = 'SELECT artist.fname, artist.lname\
                     FROM user JOIN userFanOfArtist ON user.username = userFanOfArtist.username JOIN artist ON userFanOfArtist.artistID = artist.artistID\
                     WHERE user.username = %s'
    cursor.execute(query_artists, (user,))
    artist_data = cursor.fetchall()
    cursor.close()
    return jsonify({"success":True, "user_data": data, "artist_data": artist_data})

@api.route('/followers')
def followers():
    user = session['username']
    cursor = conn.cursor()
    query ='SELECT u.fName, u.lName, u.username\
            FROM user u JOIN follows f ON u.username = f.follower\
            WHERE f.follows = %s'
    cursor.execute(query,(user))
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"success":True},data)

@api.route('/following')
def following():
    user = session['username']
    cursor = conn.cursor()
    query ='SELECT u.fName, u.lName, u.username\
            FROM user u JOIN follows f ON u.username = f.follows\
            WHERE f.follower = %s'     
    cursor.execute(query,(user))
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"success":True},data)

@api.route('/friends')
def friends():
    user = session['username']
    cursor = conn.cursor()
    query ='SELECT  f1.user2, u2.fname, u2.lname\
            FROM friend f1 INNER JOIN user u1 ON u1.username = f1.user1 INNER JOIN user u2 ON u2.username = f1.user2\
            WHERE f1.user1 = %s AND f1.acceptStatus = "Accepted"\
            UNION\
            SELECT  f1.user1, u1.fname, u1.lname\
            FROM friend f1 INNER JOIN user u1 ON u1.username = f1.user1 INNER JOIN user u2 ON u2.username = f1.user2\
            WHERE f1.user2 = %s AND f1.acceptStatus = "Accepted"'
    cursor.execute(query,(user,user))
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"success":True},data)


@api.route('/pending')
def pending():
    user = session['username']
    cursor = conn.cursor()
    query = 'SELECT u.fName, u.lName, u.username\
    FROM user u JOIN friend f ON u.username = f.user1\
    WHERE f.user2 = %s AND f.acceptStatus = "Pending"'
    cursor.execute(query,(user,))
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"success":True},data)

@api.route('/accept', methods=['POST'])
def accept():
    user = session['username']
    user2 = request.json.get('user2')
    cursor = conn.cursor()
    query = "UPDATE friend SET acceptStatus='Accepted', updatedAt=%s WHERE user1=%s AND user2=%s"
    cursor.execute(query, (date.today(), user2, user))
    conn.commit()
    cursor.close()
    return jsonify({"success": True},)


    
@api.route('/reject', methods=['POST'])
def reject():
    user = session['username']
    user2 = request.json.get('user2')
    cursor = conn.cursor()
    query = "UPDATE friend SET acceptStatus='Not accepted', updatedAt=%s WHERE user1=%s AND user2=%s"
    cursor.execute(query, (date.today(), user2, user))
    conn.commit()
    cursor.close()
    return jsonify({"success": True})


@api.route('/post-review', methods=['POST'])
def postReview():
    user = session['username']
    songId = request.json.get('songId')
    review = request.json.get('review')
    cursor = conn.cursor()
    query = "INSERT INTO reviewSong VALUES (%s, %s, %s, %s)"
    cursor.execute(query, (user, songId, review,date.today()))
    conn.commit()
    cursor.close()
    return jsonify({"success": True})

@api.route('/post-rating', methods=['POST'])
def postRating():
    user = session['username']
    songId = request.json.get('songId')
    stars = request.json.get('stars')
    cursor = conn.cursor()
    query = "INSERT INTO rateSong (username, songId, rating, date) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE rating = VALUES(rating), date = VALUES(date)"
    cursor.execute(query, (user, songId, stars,date.today()))
    conn.commit()
    cursor.close()
    return jsonify({"success": True})



@api.route('/addtoplaylist', methods=['POST'])
def add_to_playlist():
    user = session['username']
    playlistTitle = request.json.get('playlistTitle')
    songID = request.json.get('songID')
    cursor = conn.cursor()
    query = "SELECT * FROM songInPlaylist WHERE playlistTitle = %s AND username = %s AND songID = %s"
    cursor.execute(query, (playlistTitle, user, songID))
    result = cursor.fetchone()
    if result:
        cursor.close()
        return "Song is already in the playlist"
    else:
        query = "INSERT INTO songInPlaylist VALUES (%s, %s, %s)"
        cursor.execute(query, (playlistTitle, user, songID))
        conn.commit()
        cursor.close()
        return "Song added to playlist successfully"


@api.route('/show-playlist-songs')
def showPlaylistSongs():
    user = session.get('username')
    title = request.args.get('title')
    if not title or not user:
        return jsonify({'error': 'Missing playlist title or username'})
    cursor = conn.cursor()
    query = "SELECT song.title, artist.fname, artist.lname \
             FROM song \
             JOIN songInPlaylist ON song.songID = songInPlaylist.songID \
             JOIN artistPerformsSong ON artistPerformsSong.songID = song.songID \
             JOIN artist ON artist.artistID = artistPerformsSong.artistID \
             WHERE songInPlaylist.playlistTitle = %s AND songInPlaylist.username = %s"
    try:
        cursor.execute(query, (title, user))
        data = cursor.fetchall()
        cursor.close()
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)})


@api.route('/show-post')
def showPost():
    user = session.get('username')
    cursor = conn.cursor()
    query = """SELECT DISTINCT reviewAlbum.username, reviewAlbum.reviewText, reviewAlbum.reviewDate, 'Album' AS reviewType
            FROM reviewAlbum JOIN (
            SELECT f.follows
            FROM follows f
            WHERE f.follower = %s
            UNION
            SELECT f.follower 
            FROM follows f
            WHERE f.follows = %s
            UNION
            SELECT f2.follower
            FROM follows f1 JOIN follows f2 ON f1.follows = f2.follows
            WHERE f1.follower = %s
            UNION
            SELECT f.user1
            FROM user u JOIN friend f ON u.username = f.user1
            WHERE f.user1 = %s AND f.acceptStatus = 'Accepted'
            UNION
            SELECT f.user2
            FROM user u JOIN friend f ON u.username = f.user2
            WHERE f.user2 = %s AND f.acceptStatus = 'Accepted'
            ) u ON reviewAlbum.username = u.follows
            WHERE reviewAlbum.reviewDate >= (SELECT lastLogin FROM user WHERE username = %s)
            UNION
            SELECT DISTINCT reviewSong.username, reviewSong.reviewText, reviewSong.reviewDate, 'Song' AS reviewType
            FROM reviewSong JOIN (
            SELECT f.follows
            FROM follows f
            WHERE f.follower = %s
            UNION
            SELECT f.follower
            FROM follows f
            WHERE f.follows = %s
            UNION
            SELECT f2.follower FROM follows f1 JOIN follows f2 ON f1.follows = f2.follows
            WHERE f1.follower = %s
            UNION
            SELECT f.user1
            FROM user u JOIN friend f ON u.username = f.user1
            WHERE f.user1 = %s AND f.acceptStatus = 'Accepted'
            UNION
            SELECT f.user2
            FROM user u JOIN friend f ON u.username = f.user2
            WHERE f.user2 = %s AND f.acceptStatus = 'Accepted'
            ) u ON reviewSong.username = u.follows
            WHERE reviewSong.reviewDate >= (SELECT lastLogin FROM user WHERE username = %s)"""
    user_values = (user, )
    query_values = user_values * 12  # Repeat the user value 12 times
    cursor.execute(query, query_values)
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)


