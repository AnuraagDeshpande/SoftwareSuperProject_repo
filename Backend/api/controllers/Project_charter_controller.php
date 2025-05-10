<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

// Database connection
$servername = "localhost"; 
$username = "root";        
$password = "";           //ur own password 
$dbname = "softwareproject"; //database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Handle the HTTP request method
$method = $_SERVER['REQUEST_METHOD'];
$pathInfo = $_SERVER['PATH_INFO'] ?? '';
$requestUri = explode('/', trim($pathInfo, '/'));
$project_id = isset($requestUri[1]) ? intval($requestUri[1]) : null; // Get project_id from URL, if available

// Handle the API request based on the method
switch ($method) {
    case 'GET':
        if ($project_id) {
            getProjectCharter($project_id);
        } else {
            getAllProjectCharters();
        }
        break;

    case 'POST':
        createProjectCharter();
        break;

    case 'PUT':
        if ($project_id) {
            updateProjectCharter($project_id);
        } else {
            echo json_encode(["error" => "Project ID is required for update"]);
        }
        break;

    case 'DELETE':
        if ($project_id) {
            deleteProjectCharter($project_id);
        } else {
            echo json_encode(["error" => "Project ID is required for deletion"]);
        }
        break;

    default:
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

// Function to fetch all project charters
function getAllProjectCharters() {
    global $conn;
    $sql = "SELECT pc.*, p.title, p.description
        FROM project_charters pc
        JOIN projects p ON pc.project_id = p.id";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $charters = [];
        while ($row = $result->fetch_assoc()) {
            $charters[] = formatCharter($row);
        }
        echo json_encode($charters);
    } else {
        echo json_encode(["message" => "No project charters found"]);
    }
}

// Function to fetch a specific project charter by project_id
function getProjectCharter($project_id) {
    global $conn;
    $sql = "SELECT pc.*, p.title, p.description
        FROM project_charters pc
        JOIN projects p ON pc.project_id = p.id
        WHERE pc.project_id = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $project_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $charter = $result->fetch_assoc();
        echo json_encode(formatCharter($charter));
    } else {
        echo json_encode(["message" => "Project charter not found"]);
    }
}

// Function to format the data into the structure expected by the frontend
function formatCharter($row) {
    // Decode JSON fields
    $purpose = json_decode($row['purpose'], true);
    $deliverables = json_decode($row['deliverables'], true);
    $assumptions = json_decode($row['assumptions'], true);
    $constraints = json_decode($row['constraints'], true);
    $risks = json_decode($row['risks'], true);

    // Extract purpose string if it's an object with 'main'
    $purposeText = is_array($purpose) && isset($purpose['main']) ? $purpose['main'] : $row['purpose'];

    return [
        'project_id' => $row['project_id'],
        'project_title' => $row['title'],
        'project_desc' => $row['description'],
        'project_purpose' => $purposeText,
        'project_objective' => $row['objective'],
        'project_deadline' => $row['deadline'],
        'project_deliverables' => $deliverables,
        'project_assumptions' => $assumptions,
        'project_constraints' => $constraints,
        'project_risks' => $risks,
    ];
}


// Function to create a new project charter
function createProjectCharter() {
    global $conn;
    $data = json_decode(file_get_contents('php://input'), true); // Get POST data

    $project_id = $data['id'];
    $title = $data['title'];
    $desc = $data['desc'];
    $purpose = json_encode($data['purpose']);
    $objective = $data['objective'];
    $deadline = $data['deadline'];
    $deliverables = json_encode($data['deliverables']);
    $assumptions = json_encode($data['assumptions']);
    $constraints = json_encode($data['constraints']);
    $risks = json_encode($data['risks']);

    $sql = "INSERT INTO project_charters (project_id, title, description, purpose, objective, deadline, deliverables, assumptions, constraints, risks)
            VALUES ('$project_id', '$title', '$desc', '$purpose', '$objective', '$deadline', '$deliverables', '$assumptions', '$constraints', '$risks')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "New project charter created successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
}

// Function to update an existing project charter
function updateProjectCharter($project_id) {
    global $conn;
    $data = json_decode(file_get_contents('php://input'), true); // Get PUT data

    $title = $data['title'];
    $desc = $data['desc'];
    $purpose = json_encode($data['purpose']);
    $objective = $data['objective'];
    $deadline = $data['deadline'];
    $deliverables = json_encode($data['deliverables']);
    $assumptions = json_encode($data['assumptions']);
    $constraints = json_encode($data['constraints']);
    $risks = json_encode($data['risks']);

    $sql = "UPDATE project_charters SET title = '$title', description = '$desc', purpose = '$purpose', objective = '$objective',
            deadline = '$deadline', deliverables = '$deliverables', assumptions = '$assumptions',
            constraints = '$constraints', risks = '$risks' WHERE project_id = $project_id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Project charter updated successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
}

// Function to delete a project charter by project_id
function deleteProjectCharter($project_id) {
    global $conn;
    $sql = "DELETE FROM project_charters WHERE project_id = $project_id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Project charter deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
}

// Close connection
$conn->close();
?>
