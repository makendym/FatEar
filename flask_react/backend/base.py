# Import Flask Library
from flask import Flask, render_template, request, session, url_for, redirect, flash,  jsonify
import pymysql.cursors
from datetime import date

# for uploading photo:
# from app import app
# from flask import Flask, flash, request, redirect, render_template
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])


api = Flask(__name__)
api.secret_key = "secret key"

# Configure MySQL
conn = pymysql.connect(host='localhost',
                       port=8889,
                       user='root',
                       password='root',
                       db='Project_pt2',
                       charset='utf8mb4',
                       cursorclass=pymysql.cursors.DictCursor)


if __name__ == '__main__':
    api.run(debug=TRUE)


def reconnect():
    global conn
    conn.close()
    conn = pymysql.connect(host='localhost',
                           port=8889,
                           user='root',
                           password='root',
                           db='Project_pt2',
                           charset='utf8mb4',
                           cursorclass=pymysql.cursors.DictCursor)


@api.route('/loginAuths', methods=['GET', 'POST'])
def loginAuths():
    # Grab information from the form
    username = request.form.get('username')
    pwd = request.form.get('pwd')

    reconnect()
    # Check if the username and password are valid
    cursor = conn.cursor()
    try:
        query = 'SELECT * FROM user WHERE username = %s AND pwd = %s'
        cursor.execute(query, (username, pwd))
        data = cursor.fetchone()

        # If the username and password are valid, store the username in the session
        if data:
            # Set lastLogin to today's date
            query = 'UPDATE user SET lastLogin = %s WHERE username = %s'
            cursor.execute(query, (date.today(), username,))
            conn.commit()
            cursor.close()
            session['username'] = username
            return jsonify({"success": "User logged in successfully."})

        # If the username and password are not valid, return an error message
        else:
            error = 'Invalid username or password.'
            return jsonify({"error": error})

    except pymysql.err.OperationalError:
        # Handle a dropped connection by reconnecting and retrying the query
        reconnect()
        cursor = conn.cursor()
        query = 'SELECT * FROM user WHERE username = %s AND pwd = %s'
        cursor.execute(query, (username, pwd))
        data = cursor.fetchone()

        # If the username and password are valid, store the username in the session
        if data:
            # Set lastLogin to today's date
            query = 'UPDATE user SET lastLogin = %s WHERE username = %s'
            cursor.execute(query, (date.today(), username,))
            conn.commit()
            cursor.close()
            session['username'] = username
            return jsonify({"success": "User logged in successfully."})

        # If the username and password are not valid, return an error message
        else:
            error = 'Invalid username or password.'
            return jsonify({"error": error})


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
    # Executes query to check if the username exists
    query = 'SELECT * FROM user WHERE username = %s'
    cursor.execute(query, (username,))
    data = cursor.fetchone()

    # If the previous query returns data, then user exists
    if data:
        error = "This username already exists"
        return jsonify({"error": error}), 400
    else:
        # Inserts new user data into the database
        ins = 'INSERT INTO user (username, pwd, fname, lname, lastlogin, nickname) VALUES (%s, %s, %s, %s, %s, %s)'
        if len(username) < 1 or len(username) > 10:
            error = "Username cannot exceed 10 characters."
            return jsonify({"error": error}), 400

        if len(pwd) > 15:
            error = "Password cannot exceed 15 characters."
            return jsonify({"error": error}), 400

        if len(fname) < 1 or len(fname) > 20:
            error = "First name must be between 1 and 20 characters."
            return jsonify({"error": error}), 400

        if len(lname) < 1 or len(lname) > 20:
            error = "Last name must be between 1 and 20 characters."
            return jsonify({"error": error}), 400

        if len(nickname) > 20:
            error = "Nickname cannot exceed 20 characters."
            return jsonify({"error": error}), 400

        cursor.execute(ins, (username, pwd, fname,lname, date.today(), nickname))
        conn.commit()
        cursor.close()
        return jsonify({"success": "User registered successfully"})

 

@api.route('/home')
def home():
    reconnect()
    user = session.get('username')
    if user is None:
        return "User is not logged in", 401
    return jsonify(username=user)


@api.route('/logout')
def logout():
    reconnect()
    session.pop('username')
    return redirect('/')


@api.route('/search')
def search():
    genre = request.args.get('genre')
    search = request.args.get('search')
    rating = request.args.get('rating')
    reconnect()
    cursor = conn.cursor()
    if genre and search:
        query = "SELECT song.songID, song.title, artist.fname, artist.lname, album.albumTitle, songGenre.genre\
                FROM song \
                JOIN artistPerformsSong ON song.songID = artistPerformsSong.songID \
                JOIN artist ON artist.artistID = artistPerformsSong.artistID \
                JOIN songInAlbum ON songInAlbum.songID = song.songID \
                JOIN album ON album.albumID = songInAlbum.albumID \
                JOIN songGenre ON songGenre.songID = song.songID \
                WHERE songGenre.genre = %s AND artist.fname = %s"
        cursor.execute(query, (genre, search))
    elif genre:
        cursor.execute("SET sql_mode=''")
        query = "SELECT song.songID, song.title, artist.fname, artist.lname, album.albumTitle, songGenre.genre, MAX(rateSong.stars) AS stars \
             FROM song \
             JOIN artistPerformsSong ON song.songID = artistPerformsSong.songID \
             JOIN artist ON artist.artistID = artistPerformsSong.artistID \
             JOIN songInAlbum ON songInAlbum.songID = song.songID \
             JOIN album ON album.albumID = songInAlbum.albumID \
             JOIN songGenre ON songGenre.songID = song.songID \
             JOIN (SELECT songID, MAX(ratingDate) AS maxDate FROM rateSong GROUP BY songID) AS latestRatings \
             ON latestRatings.songID = song.songID \
             JOIN rateSong ON rateSong.songID = song.songID AND rateSong.ratingDate = latestRatings.maxDate \
             WHERE songGenre.genre = %s \
             GROUP BY song.songID"
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
        cursor.execute("SET sql_mode=''")
        query = "SELECT DISTINCT song.songID, song.title, artist.fname, artist.lname, album.albumTitle, GROUP_CONCAT(songGenre.genre) AS genres, MAX(rateSong.stars) AS stars\
                FROM song\
                JOIN artistPerformsSong ON song.songID = artistPerformsSong.songID\
                JOIN artist ON artist.artistID = artistPerformsSong.artistID\
                JOIN songInAlbum ON songInAlbum.songID = song.songID\
                JOIN album ON album.albumID = songInAlbum.albumID\
                JOIN songGenre ON songGenre.songID = song.songID\
                LEFT JOIN rateSong ON rateSong.songID = song.songID\
                GROUP BY song.songID, song.title, artist.fname, artist.lname, album.albumTitle"
        cursor.execute(query)
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)


@api.route('/genre', methods=['GET'])
def genre():
    reconnect()
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
    reconnect()
    cursor = conn.cursor()

    # Check if playlist title already exists
    query = 'SELECT * FROM playlist WHERE playlistTitle = %s AND username = %s'
    cursor.execute(query, (playlisttitle, user))
    existing_playlist = cursor.fetchone()

    if existing_playlist:
        return jsonify({"error": True, "message": "Playlist title already exists"})

    if playlisttitle:
        query = 'INSERT INTO playlist (playlistTitle, username, createdAt) VALUES (%s, %s, %s)'
        cursor.execute(query, (playlisttitle, user, date.today().strftime('%Y-%m-%d')))
    else:
        return jsonify({"error": True, "message": "Missing playlist title"})

    conn.commit()
    cursor.close()
    return jsonify({"success": "successfully added to playlist"})



@api.route('/list-user-playlist')
def listPlaylist():
    user = session['username']
    reconnect()
    cursor = conn.cursor()
    query = 'SELECT playlistTitle FROM playlist WHERE playlist.username = %s'
    cursor.execute(query, (user))
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"success": True}, data)


@api.route('/userprofile')
def userProfile():
    user = session['username']
    reconnect()
    cursor = conn.cursor()
    query = 'SELECT user.username, user.fname, user.lname, user.nickname\
            FROM user\
            WHERE user.username = %s'
    cursor.execute(query, (user))
    data = cursor.fetchall()

    query_artists = 'SELECT artist.fname, artist.lname\
                     FROM user JOIN userFanOfArtist ON user.username = userFanOfArtist.username JOIN artist ON userFanOfArtist.artistID = artist.artistID\
                     WHERE user.username = %s'
    cursor.execute(query_artists, (user,))
    artist_data = cursor.fetchall()
    cursor.close()
    return jsonify({"success": True, "user_data": data, "artist_data": artist_data})


@api.route('/followers')
def followers():
    user = session['username']
    reconnect()
    cursor = conn.cursor()
    query = 'SELECT u.fName, u.lName, u.username\
            FROM user u JOIN follows f ON u.username = f.follower\
            WHERE f.follows = %s'
    cursor.execute(query, (user))
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"success": True}, data)


@api.route('/following')
def following():
    user = session['username']
    reconnect()
    cursor = conn.cursor()
    query = 'SELECT u.fName, u.lName, u.username\
            FROM user u JOIN follows f ON u.username = f.follows\
            WHERE f.follower = %s'
    cursor.execute(query, (user))
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"success": True}, data)


@api.route('/friends')
def friends():
    user = session['username']
    reconnect()
    cursor = conn.cursor()
    query = 'SELECT  f1.user2, u2.fname, u2.lname\
            FROM friend f1 INNER JOIN user u1 ON u1.username = f1.user1 INNER JOIN user u2 ON u2.username = f1.user2\
            WHERE f1.user1 = %s AND f1.acceptStatus = "Accepted"\
            UNION\
            SELECT  f1.user1, u1.fname, u1.lname\
            FROM friend f1 INNER JOIN user u1 ON u1.username = f1.user1 INNER JOIN user u2 ON u2.username = f1.user2\
            WHERE f1.user2 = %s AND f1.acceptStatus = "Accepted"'
    cursor.execute(query, (user, user))
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"success": True}, data)


@api.route('/pending')
def pending():
    user = session['username']
    reconnect()
    cursor = conn.cursor()
    query = 'SELECT u.fName, u.lName, u.username\
    FROM user u JOIN friend f ON u.username = f.user1\
    WHERE f.user2 = %s AND f.acceptStatus = "Pending"'
    cursor.execute(query, (user,))
    data = cursor.fetchall()
    cursor.close()
    return jsonify({"success": True}, data)


@api.route('/accept', methods=['POST'])
def accept():
    user = session['username']
    user2 = request.json.get('user2')
    reconnect()
    cursor = conn.cursor()
    try:
        query = "UPDATE friend SET acceptStatus='Accepted', updatedAt=%s WHERE user1=%s AND user2=%s"
        cursor.execute(query, (date.today(), user2, user))
        conn.commit()
        cursor.close()
        return jsonify({"success": "successfully accepted"})
    except Exception as e:
        cursor.close()
        return jsonify({"error": str(e)})



@api.route('/reject', methods=['POST'])
def reject():
    user = session['username']
    user2 = request.json.get('user2')
    reconnect()
    cursor = conn.cursor()
    query = "UPDATE friend SET acceptStatus='Not accepted', updatedAt=%s WHERE user1=%s AND user2=%s"
    cursor.execute(query, (date.today(), user2, user))
    conn.commit()
    cursor.close()
    return jsonify({"success": True})


@api.route('/post-review', methods=['POST'])
def postReview():
    user = session.get('username')
    songId = request.json.get('songID')
    review = request.json.get('review')
    reconnect()
    cursor = conn.cursor()

    # Check if user has already reviewed the song
    query = "SELECT * FROM reviewSong WHERE username = %s AND songID = %s"
    cursor.execute(query, (user, songId))
    existing_review = cursor.fetchone()

    # If user has already reviewed the song, ask if they want to update their review
    if existing_review:
        if len(review) > 100:
            cursor.close()
            return jsonify({"error": True, "message": "Review exceeds character limits"})
        else:
            query = "UPDATE reviewSong SET reviewText = %s, reviewDate = %s WHERE username = %s AND songID = %s"
            cursor.execute(query, (review, date.today(), user, songId))
            conn.commit()
            cursor.close()
            return jsonify({"success": True, "message": "Review updated successfully"})
    # If user has not reviewed the song, insert a new review
    else:
        # Check review character count
        if len(review) > 100:
            cursor.close()
            return jsonify({"error": True, "message": "Review exceeds character limitss"})
        else:
            query = "INSERT INTO reviewSong VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (user, songId, review, date.today()))
            conn.commit()
            cursor.close()
            return jsonify({"success": True})


@api.route('/post-rating', methods=['POST'])
def postRating():
    user = session['username']
    songId = request.json.get('songId')
    stars = request.json.get('stars')
    reconnect()
    cursor = conn.cursor()

    # Check if the user has already rated the song
    query = "SELECT * FROM rateSong WHERE username = %s AND songID = %s"
    cursor.execute(query, (user, songId))
    data = cursor.fetchone()

    # If the user has already rated the song, ask if they want to change their rating
    if data:
        # Check if stars value is valid (between 1 and 5)
        if stars is not None and 1 <= stars <= 5:
            query = "UPDATE rateSong SET stars = %s, ratingDate = %s WHERE username = %s AND songID = %s"
            cursor.execute(query, (stars, date.today(), user, songId))
            conn.commit()
            cursor.close()
            return jsonify({"success": "Your rating has been updated."})
        else:
            cursor.close()
            return jsonify({"error": "Invalid rating value. Enter a rating value between 1 and 5."})

    # If the user has not rated the song, insert a new rating
    else:
        # Check if stars value is valid (between 1 and 5)
        if stars is not None and 1 <= stars <= 5:
            query = "INSERT INTO rateSong (username, songID, stars, ratingDate) SELECT %s, %s, %s, %s WHERE NOT EXISTS (SELECT 1 FROM rateSong WHERE username = %s AND songID = %s)"
            cursor.execute(query, (user, songId, stars,
                           date.today(), user, songId))
            conn.commit()
            if cursor.rowcount == 0:
                return jsonify({"error": "You have already rated this song."})
            else:
                cursor.close()
                return jsonify({"success": "Your rating has been added."})
        else:
            cursor.close()
            return jsonify({"error": "Invalid rating value. Enter ratings between 1 and 5."})


# THIS IS FOR ALBUM REVIEW
@api.route('/post-album-review', methods=['POST'])
def postAlbumReview():
    user = session['username']
    songId = request.json.get('albumId')
    review = request.json.get('review')
    reconnect()
    cursor = conn.cursor()

    # Check if user has already reviewed the album
    query = "SELECT * FROM reviewAlbum WHERE username = %s AND albumId = %s"
    cursor.execute(query, (user, albumId))
    existing_review = cursor.fetchone()

    # If user has already reviewed the album, ask if they want to update their review
    if existing_review:
        if len(review) > 100:
            return jsonify({"error": True, "message": "Review exceeds character limit"})
        else:
            query = "UPDATE reviewAlbum SET review = %s, date = %s WHERE username = %s AND albumId = %s"
            cursor.execute(query, (review, date.today(), user, albumId))
            conn.commit()
            cursor.close()
            return jsonify({"success": True, "message": "Review updated successfully"})
    # If user has not reviewed the album, insert a new review
    else:
        # Check review character count
        if len(review) > 100:
            return jsonify({"error": True, "message": "Review exceeds character limit"})
        else:
            query = "INSERT INTO reviewAlbum VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (user, albumId, review, date.today()))
            conn.commit()
            cursor.close()
            return jsonify({"success": True})


# THIS IS FOR ALBUM RARING
@api.route('/post-album-rating', methods=['POST'])
def postAlbumRating():
    user = session['username']
    songId = request.json.get('albumId')
    stars = request.json.get('stars')
    reconnect()
    cursor = conn.cursor()

    # Check if the user has already rated the album
    query = "SELECT * FROM rateAlbum WHERE username = %s AND albumId = %s"
    cursor.execute(query, (user, albumId))
    data = cursor.fetchone()

    # If the user has already rated the album, ask if they want to change their rating
    if data:
        if 1 <= stars <= 5:
            query = "UPDATE rateAlbum SET rating = %s, date = %s WHERE username = %s AND albumId = %s"
            cursor.execute(query, (stars, date.today(), user, albumId))
            conn.commit()
            cursor.close()
            return jsonify({"success": "Your rating has been updated."})
        else:
            cursor.close()
            return jsonify({"error": "Invalid rating value. Enter a rating between 1 and 5."})

    # If the user has not rated the album, insert a new rating
    else:
        # Check if stars value is valid (between 1 and 5)
        if 1 <= stars <= 5:
            query = "INSERT INTO rateAlbum (username, albumId, rating, date) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (user, albumId, stars, date.today()))
            conn.commit()
            cursor.close()
            return jsonify({"success": "Your rating has been added."})
        else:
            cursor.close()
            return jsonify({"error": "Invalid rating value. Enter a rating between 1 and 5."})


@api.route('/addtoplaylist', methods=['POST'])
def add_to_playlist():
    user = session['username']
    playlistTitle = request.json.get('playlistTitle')
    songID = request.json.get('songID')
    reconnect()
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
    reconnect()
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
    reconnect()
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


@api.route('/search-users')
def search_users():
    user = session.get('username')
    search_query = request.args.get('q')
    if not search_query:
        return jsonify([])
    reconnect()
    cursor = conn.cursor()
    query = "SELECT user.fname, user.lname, user.username FROM user WHERE user.fName LIKE %s OR user.lname LIKE %s"
    search_term = "%" + search_query + "%"
    cursor.execute(query, (search_term, search_term))
    data = cursor.fetchall()
    cursor.close()
    return jsonify(data)


@api.route('/add-friend', methods=['POST'])
def addFriend():
    user = session.get('username')
    requestedUser = request.json.get('requestedUser')
    reconnect()
    cursor = conn.cursor()
    try:
        # Check if friend request already exists
        query = "SELECT * FROM friend WHERE user1=%s AND user2=%s AND acceptStatus='pending'"
        cursor.execute(query, (user, requestedUser))
        existing_request = cursor.fetchone()
        if existing_request:
            return jsonify({"error": "Friend request already sent"})
        # Check if the users are already friends
        query = "SELECT * FROM friend WHERE user1=%s AND user2=%s AND acceptStatus='accepted'"
        cursor.execute(query, (user, requestedUser))
        existing_friendship = cursor.fetchone()
        if existing_friendship:
            return jsonify({"error": "You are already friends"})
        # Insert the new friend request
        query = "INSERT INTO friend VALUES (%s, %s, 'pending', %s, %s, %s)"
        cursor.execute(query, (user, requestedUser,
                       user, date.today(), date.today()))
        conn.commit()
        cursor.close()
        return jsonify({'message': 'Friend request sent successfully'})
    except Exception as e:
        conn.rollback()
        cursor.close()
        return jsonify({'error': 'An error occurred while processing your request'})


@api.route('/get-notified', methods=['POST'])
def getNotified():
    # get the username from the request body
    user = session.get('username')

    # Query to get new songs by artists the user is a fan of
    new_songs_query = '''
        SELECT artist.fname, artist.lname, song.title
        FROM userFanOfArtist JOIN artist ON userFanOfArtist.artistID = artist.artistID
        JOIN artistPerformsSong ON artist.artistID = artistPerformsSong.artistID
        JOIN song ON artistPerformsSong.songID = song.songID
        JOIN user ON userFanOfArtist.username = user.username
        WHERE userFanOfArtist.username = %s AND song.releaseDate >= user.lastlogin
    '''

    # Query to get new friend requests
    new_friend_requests_query = '''
        SELECT u1.username, u1.fname, u1.lname
        FROM user u1 JOIN friend f ON u1.username = f.user1
        JOIN user u2 ON f.user2 = u2.username
        WHERE f.user2 = %s AND f.acceptStatus = 'Pending' AND f.createdAt >= u2.lastlogin
    '''

    # execute the queries and retrieve the results
    # reconnect()
    with conn.cursor() as cursor:
        cursor.execute(new_songs_query, (user,))
        new_songs = cursor.fetchall()

        cursor.execute(new_friend_requests_query, (user,))
        new_friend_requests = cursor.fetchall()

    # construct and return the response
    response = {
        'new_songs': new_songs,
        'new_friend_requests': new_friend_requests
    }

    return jsonify(response)
