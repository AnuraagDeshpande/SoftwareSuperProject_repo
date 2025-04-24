from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import mysql.connector
from mysql.connector import pooling, Error

app = Flask(__name__)
app.secret_key = 'new_password'  # Replace with your actual secret key

# MySQL database config
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "new_password",
    "database": "project_management"
}

# Set up MySQL connection pool
try:
    mysql_pool = pooling.MySQLConnectionPool(
        pool_name="mypool",
        pool_size=5,
        pool_reset_session=True,
        **db_config
    )
except Error as e:
    print("Failed to create MySQL pool:", e)
    mysql_pool = None


@app.route('/')
def home():
    # Check if user is logged in and fetch user data
    return render_template('index.html',
                           user_logged_in='user' in session,
                           username=session.get('user'))


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        full_name = request.form['full_name']
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        try:
            conn = mysql_pool.get_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            if cursor.fetchone():
                flash("Username already exists.")
                return redirect(url_for('signup'))

            cursor.execute(
                "INSERT INTO users (fullname, username, email, u_password) VALUES (%s, %s, %s, %s)",
                (full_name, username, email, password)
            )
            conn.commit()
            flash("Signup successful! Please login.")

        except Error as e:
            flash(f"Database error: {e}")
            return redirect(url_for('signup'))

        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        try:
            conn = mysql_pool.get_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
            user = cursor.fetchone()
            
            if user and user['u_password'] == password:
                session['user'] = user['username']
                session['user_id'] = user['id']  # Store user ID in session
                flash("Login successful!")
                return redirect(url_for('home'))
            else:
                flash("Invalid username or password")
                return redirect(url_for('login'))
        except Error as e:
            flash(f"Database error: {e}")
        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()
    
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('user', None)
    session.pop('user_id', None)  # Remove user ID from session as well
    flash("Logged out.")
    return redirect(url_for('login'))


@app.route('/add_project', methods=['GET', 'POST'])
def add_project():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        deadline = request.form['deadline']
        
        # Set the status to "Active" by default
        status = "Active"

        # Prepare member data
        members = []
        
        # Add the current user as the project owner
        members.append({'user_id': session['user_id'], 'role': 'Owner'})

        # Add other members from the form
        for i in range(0, len(request.form)//2):  # Loop through the submitted members
            username = request.form.get(f'username_{i}')
            role = request.form.get(f'role_{i}')

            # Find the user ID based on the username
            try:
                conn = mysql_pool.get_connection()
                cursor = conn.cursor(dictionary=True)
                cursor.execute("SELECT id FROM users WHERE username = %s", (username,))
                user = cursor.fetchone()

                if user:
                    members.append({'user_id': user['id'], 'role': role})
                else:
                    flash(f"User with username '{username}' not found.")
            except Error as e:
                flash(f"Database error: {e}")
            finally:
                if cursor:
                    cursor.close()
                if conn and conn.is_connected():
                    conn.close()

        # Insert the new project into the database
        try:
            conn = mysql_pool.get_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute(
                "INSERT INTO projects (title, description, status, deadline) VALUES (%s, %s, %s, %s)",
                (title, description, status, deadline)
            )
            project_id = cursor.lastrowid  # Get the ID of the newly inserted project

            # Insert members and roles into the project_members table
            for member in members:
                cursor.execute(
                    "INSERT INTO project_members (project_id, user_id, role) VALUES (%s, %s, %s)",
                    (project_id, member['user_id'], member['role'])
                )

            conn.commit()
            flash("Project added successfully!")

            # After adding the project, redirect to the project list page
            return redirect(url_for('project_list'))

        except Error as e:
            flash(f"Database error: {e}")
        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    return render_template(
    'add_project.html',
    user_logged_in=True,
    username=session.get('user')
)



@app.route('/project_list', methods=['GET'])
def project_list():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    search_query = request.args.get('search', '').strip()  # Get search query from the request

    try:
        conn = mysql_pool.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Modify query to filter based on the search query if provided
        if search_query:
            cursor.execute("""
                SELECT p.id, p.title, p.description, pm.role
                FROM projects p
                JOIN project_members pm ON p.id = pm.project_id
                WHERE pm.user_id = %s AND p.title LIKE %s
            """, (session['user_id'], f"%{search_query}%"))
        else:
            # Default query if no search query is provided
            cursor.execute("""
                SELECT p.id, p.title, p.description, pm.role
                FROM projects p
                JOIN project_members pm ON p.id = pm.project_id
                WHERE pm.user_id = %s
            """, (session['user_id'],))
        
        projects = cursor.fetchall()

        return render_template(
            'project_list.html',
            projects=projects,
            user_logged_in=True,
            username=session.get('user')
        )

    except Error as e:
        flash(f"Database error: {e}")
        return redirect(url_for('index'))
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

# New route to handle search suggestions dynamically
@app.route('/projects/search', methods=['GET'])
def search_projects():
    if 'user_id' not in session:
        return jsonify({'projects': []})

    search_query = request.args.get('query', '').strip()

    if not search_query:
        return jsonify({'projects': []})

    try:
        conn = mysql_pool.get_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch project names matching the search query where the user is a participant
        cursor.execute("""
            SELECT p.title
            FROM projects p
            JOIN project_members pm ON p.id = pm.project_id
            WHERE pm.user_id = %s AND p.title LIKE %s
        """, (session['user_id'], f"%{search_query}%"))

        projects = cursor.fetchall()

        # Return the matching project names as a JSON response
        return jsonify({'projects': [{'title': project['title']} for project in projects]})

    except Error as e:
        return jsonify({'projects': []})
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()



@app.route('/delete_project/<int:project_id>', methods=['POST'])
def delete_project(project_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    try:
        conn = mysql_pool.get_connection()
        cursor = conn.cursor()

        # Check ownership before deletion (only owner can delete)
        cursor.execute("""
            SELECT role FROM project_members
            WHERE project_id = %s AND user_id = %s
        """, (project_id, session['user_id']))
        role = cursor.fetchone()

        if not role or role[0] != 'Owner':
            flash("You don't have permission to delete this project.")
            return redirect(url_for('project_list'))

        # First delete from project_members table
        cursor.execute("DELETE FROM project_members WHERE project_id = %s", (project_id,))
        # Then delete from projects table
        cursor.execute("DELETE FROM projects WHERE id = %s", (project_id,))
        conn.commit()
        flash("Project deleted successfully.")
    except Error as e:
        flash(f"Error deleting project: {e}")
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

    return redirect(url_for('project_list'))

if __name__ == '__main__':
    app.run(debug=True)
