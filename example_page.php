<?php
// Enable PHP error reporting (development only)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include init.php for DB connection, BASE_URL, and session
require_once(__DIR__ . '/Backend/init.php');

// Show the API base URL (debugging)
var_dump(BASE_URL);
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Interaction Example</title>
  <script type="text/javascript">
    // Set the base API URL from PHP
    const baseurl = "<?php echo BASE_URL; ?>";

    /**
     * Fetch users from the API (GET /users)
     * and display them in a list
     */
    function fetchUsers() {
      fetch(`${baseurl}/projects`)
        .then(response => response.json())
        .then(responseData => {
          console.log('Fetched data:', responseData);
          const userList = document.getElementById('user-list');
          userList.innerHTML = '';

          if (!Array.isArray(responseData.data)) {
            userList.innerHTML = '<li>Unexpected response format.</li>';
            return;
          }

          responseData.data.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
              <strong>ID:</strong> ${user.id}<br>
              <strong>Username:</strong> ${user.username}<br>
              <strong>Email:</strong> ${user.email}<br>
              <strong>Role:</strong> ${user.system_role}<br>
              <strong>Name:</strong> ${user.first_name} ${user.last_name}
            `;

            // Add Edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => populateEditForm(user);
            listItem.appendChild(document.createElement('br'));
            listItem.appendChild(editButton);

            userList.appendChild(listItem);
          });
        })
        .catch(error => {
          console.error('Error:', error);
          document.getElementById('user-list').innerHTML = '<li>Error fetching users.</li>';
        });
    }

    /**
     * Populate the Edit form with user info
     */
    function populateEditForm(user) {
      document.getElementById('edit-id').value = user.id;
      document.getElementById('edit-username').value = user.username;
      document.getElementById('edit-email').value = user.email;
      document.getElementById('edit-first-name').value = user.first_name;
      document.getElementById('edit-last-name').value = user.last_name;
      document.getElementById('edit-role').value = user.system_role;
    }

    // Set up event listeners once page is ready
    document.addEventListener('DOMContentLoaded', () => {

      // Handle Add User form submission (POST)
      document.getElementById('user-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(this);
        const user = {};
        formData.forEach((value, key) => {
          user[key] = value;
        });

        fetch(`${baseurl}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(data => {
          console.log('POST response:', data);
          fetchUsers();
          this.reset();
        })
        .catch(error => {
          console.error('Error posting user:', error);
        });
      });

      // Handle Edit User form submission (PUT)
      document.getElementById('edit-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const id = document.getElementById('edit-id').value;
        const updatedUser = {
          username: document.getElementById('edit-username').value,
          email: document.getElementById('edit-email').value,
          first_name: document.getElementById('edit-first-name').value,
          last_name: document.getElementById('edit-last-name').value,
          system_role: document.getElementById('edit-role').value
        };

        fetch(`${baseurl}/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser)
        })
        .then(response => response.json())
        .then(data => {
          console.log('PUT response:', data);
          fetchUsers();
          this.reset();
        })
        .catch(error => {
          console.error('Error updating user:', error);
        });
      });

      // Handle Delete User form submission (DELETE)
      document.getElementById('delete-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const id = document.getElementById('delete-id').value;

        fetch(`${baseurl}/users/${id}`, {
          method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
          console.log('DELETE response:', data);
          fetchUsers();
          this.reset();
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
      });

      // Load users when the page loads
      fetchUsers();
    });
  </script>
</head>
<body>

  <h1>User List</h1>

  <!-- User creation form (POST /users) -->
  <h2>Add New User</h2>
  <form id="user-form">
    <input type="text" name="username" placeholder="Username" required><br>
    <input type="email" name="email" placeholder="Email" required><br>
    <input type="text" name="first_name" placeholder="First Name" required><br>
    <input type="text" name="last_name" placeholder="Last Name" required><br>
    <input type="text" name="system_role" placeholder="Role (e.g. User)" required><br>
    <input type="password" name="password" placeholder="Password" required><br>
    <button type="submit">Add User</button>
  </form>
  <hr>

  <!-- User update form (PUT /users/{id}) -->
  <h2>Edit User</h2>
  <form id="edit-form">
    <input type="hidden" id="edit-id" name="id">
    <input type="text" id="edit-username" name="username" placeholder="Username" required><br>
    <input type="email" id="edit-email" name="email" placeholder="Email" required><br>
    <input type="text" id="edit-first-name" name="first_name" placeholder="First Name" required><br>
    <input type="text" id="edit-last-name" name="last_name" placeholder="Last Name" required><br>
    <input type="text" id="edit-role" name="system_role" placeholder="Role (e.g. User)" required><br>
    <button type="submit">Update User</button>
  </form>
  <hr>

  <!-- User deletion form (DELETE /users/{id}) -->
  <h2>Delete User</h2>
  <form id="delete-form">
    <input type="number" id="delete-id" name="id" placeholder="Enter user ID to delete" required><br>
    <button type="submit">Delete User</button>
  </form>
  <hr>

  <!-- Display fetched users -->
  <ul id="user-list">
    <!-- Users will be listed here -->
  </ul>

</body>
</html>
