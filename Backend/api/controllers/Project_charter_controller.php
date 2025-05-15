<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../../../db_connection.php');

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Handle the HTTP request method
$method = $_SERVER['REQUEST_METHOD'];
$project_id = isset($_GET['project_id']) ? intval($_GET['project_id']) : null;

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

function formatCharter($row) {
    return [
        'project_id' => $row['project_id'],
        'project_title' => $row['title'],
        'project_desc' => $row['description'],
        'project_purpose' => json_decode($row['purpose'], true),
        'project_objective' => $row['objective'],
        'project_deadline' => $row['deadline'],
        'project_deliverables' => json_decode($row['deliverables'], true),
        'project_assumptions' => json_decode($row['assumptions'], true),
        'project_acceptance' => $row['acceptance'],
        'project_constraints' => json_decode($row['constraints'], true),
        'project_risks' => json_decode($row['risks'], true),
    ];
}

function createProjectCharter() {
    global $conn;
    $data = json_decode(file_get_contents('php://input'), true);

    // Sanitize incoming data
    $project_id = $conn->real_escape_string($data['id']);
    //$title = $conn->real_escape_string($data['title']);
    //$desc = $conn->real_escape_string($data['desc']);
    $purpose = $conn->real_escape_string(($data['purpose']));
    $objective = $conn->real_escape_string($data['objective']);
    $deadline = $conn->real_escape_string($data['deadline']);
    $deliverables = $conn->real_escape_string(json_encode($data['deliverables']));
    $assumptions = $conn->real_escape_string(json_encode($data['assumptions']));
    $acceptance = $conn->real_escape_string($data['acceptance']);
    $constraints = $conn->real_escape_string(json_encode($data['constraints']));
    $risks = $conn->real_escape_string(json_encode($data['risks']));

    $sql = "INSERT INTO project_charters (project_id, purpose, objective, deadline, deliverables, assumptions, acceptance, constraints, risks)
            VALUES ('$project_id', '$purpose', '$objective', '$deadline', '$deliverables', '$assumptions', '$acceptance', '$constraints', '$risks')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "New project charter created successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
}

function updateProjectCharter($project_id) {
    global $conn;
    $data = json_decode(file_get_contents('php://input'), true);

    // Sanitize incoming data
    $title = $conn->real_escape_string($data['title']);
    $desc = $conn->real_escape_string($data['desc']);
    $purpose = $conn->real_escape_string(json_encode($data['purpose']));
    $objective = $conn->real_escape_string($data['objective']);
    $deadline = $conn->real_escape_string($data['deadline']);
    $deliverables = $conn->real_escape_string(json_encode($data['deliverables']));
    $assumptions = $conn->real_escape_string(json_encode($data['assumptions']));
    $acceptance = $conn->real_escape_string($data['acceptance']);
    $constraints = $conn->real_escape_string(json_encode($data['constraints']));
    $risks = $conn->real_escape_string(json_encode($data['risks']));

    // Update the projects table for title and description
    $sql_projects = "UPDATE projects 
                     SET title = '$title', description = '$desc' 
                     WHERE id = $project_id";
    
    if ($conn->query($sql_projects) === FALSE) {
        echo json_encode(["error" => "Error updating project: " . $conn->error]);
        return;
    }

    // Update the project_charters table for other project details
    $sql_charters = "UPDATE project_charters 
                     SET objective = '$objective', purpose = '$purpose', deadline = '$deadline',
                         deliverables = '$deliverables', assumptions = '$assumptions',
                         acceptance = '$acceptance', constraints = '$constraints', risks = '$risks'
                     WHERE project_id = $project_id";

    if ($conn->query($sql_charters) === TRUE) {
        echo json_encode(["message" => "Project charter updated successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
}


function deleteProjectCharter($project_id) {
    global $conn;
    $sql = "DELETE FROM project_charters WHERE project_id = $project_id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "Project charter deleted successfully"]);
    } else {
        echo json_encode(["error" => "Error: " . $conn->error]);
    }
}

$conn->close();
?>
