# Usage Guide: Interacting with the Project API

## 1. Fetch All Projects

To retrieve a list of all projects, send a GET request to the following URL:

```bash
GET http://localhost/SoftwareSuperProject_repo/project_controller.php?action=get
```

## 2. Create a New Project

To create a new project, send a POST request to the following URL:

```bash
POST http://localhost/SoftwareSuperProject_repo/project_controller.php?action=add
```

Example Request:

```bash
{
  "projectName": "New Project",
  "desc": "This is a new project description.",
  "status": "active",
  "owner": ["ownerUsername"],
  "participants": ["user1", "user2"]
}
```

Response:

- `success`: `true` if the project was created successfully.

- `project_id`: The ID of the newly created project.

Example Response:

```bash
{
  "success": true,
  "message": "Project created",
  "project_id": 1
}
```

## 3. Delete a Project

To delete an existing project, send a POST request to the following URL:

```bash
POST http://localhost/SoftwareSuperProject_repo/project_controller.php?action=delete
```

Required Data:

- `id`: The ID of the project to be deleted.

Example Request:

```bash
{
  "id": 1
}
```

Response:

- `success`: `true` if the project was deleted successfully.

- `error`: If the project could not be deleted, an error message is returned.

Example Response (Success):

```bash
{
  "success": true,
  "message": "Project deleted successfully"
}
```

Example Response (Error):

```bash
{
  "success": false,
  "error": "Failed to delete delete the project"
}
```


## 4. Example Usage in Frontend (JavaScript)

### Fetching All Projects:

```bash
fetch('http://localhost/SoftwareSuperProject_repo/project_controller.php?action=get')
  .then(response => response.json())
  .then(data => {
    console.log('Projects:', data);
  })
  .catch(error => {
    console.error('Error fetching projects:', error);
  });
```

### Creating a New Project:

```bash
const newProject = {
  projectName: "New Project",
  desc: "A description for the new project",
  status: "active",
  owner: ["ownerUsername"],
  participants: ["user1", "user2"]
};

fetch('http://localhost/SoftwareSuperProject_repo/project_controller.php?action=add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newProject)
})
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Project created with ID:', data.project_id);
    } else {
      console.error('Error:', data.error);
    }
  })
  .catch(error => {
    console.error('Error creating project:', error);
  });
```

### Deleting a Project:

```bash
// Example project ID
const projectIdToDelete = 1;

fetch('http://localhost/SoftwareSuperProject_repo/project_controller.php?action=delete', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ id: projectIdToDelete })
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Project deleted successfully');
    // Optionally, refresh the project list on the UI
  } else {
    console.error('Failed to delete project:', data.error);
  }
})
.catch(error => {
  console.error('Error deleting project:', error);
});
```