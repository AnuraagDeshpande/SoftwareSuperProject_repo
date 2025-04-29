// Fetching all users
fetch('http://localhost/SE_REPO/SoftwareSuperProject_repo/Backend/api/users')
  .then(response => response.json())
  .then(data => console.log(data));

// Registering a new user
fetch('http://localhost/SE_REPO/SoftwareSuperProject_repo/Backend/api/auth/signup.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    first_name: 'User',
    last_name: '1',
    username: 'User1',
    email: 'user.1@user.com',
    password: 'password123',
    profile_picture: 'images/profiles/user.jpg',
    system_role: 'User'
  })
})

//GET - RETRIEVEING ALL USERS
 
fetch('http://localhost/SE_REPO/SoftwareSuperProject_repo/Backend/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

//GET - By ID

const userId = 1; // Replace with the desired user ID
fetch(`http://localhost/SE_REPO/SoftwareSuperProject_repo/Backend/api/users/${userId}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


//GET - SEARCHING USERS

const query = 'alice'; // Replace with your search term
fetch(`http://localhost/SE_REPO/SoftwareSuperProject_repo/Backend/api/users?q=${encodeURIComponent(query)}`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


//POST - REGISTERING A USER

const newUser = {
    first_name: 'User',
    last_name: '1',
    username: 'User1',
    email: 'user.1@user.com',
    password: 'password123',
    profile_picture: 'images/profiles/user.jpg',
    system_role: 'User'
};

fetch('http://localhost/SE_REPO/SoftwareSuperProject_repo/Backend/api/auth/signup.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newUser)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


  // PUT - UPDATING AN EXISTING USER

  const userId = 1;
  const updatedUser = {
  first_name: "Alice",
  last_name: "Johnson",
  email: "alice.johnson@example.com"
};

fetch(`http://localhost/SE_REPO/SoftwareSuperProject_repo/Backend/api/users/${userId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updatedUser)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));


  //DELETE - REMOVING A USER

  const userId = 1; // Replace with the user ID to delete
fetch(`http://localhost/SE_REPO/SoftwareSuperProject_repo/Backend/api/users/${userId}`, {
  method: 'DELETE'
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
