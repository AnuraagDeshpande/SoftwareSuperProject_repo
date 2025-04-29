CREATE DATABASE IF NOT EXISTS project_management;
USE project_management;

-- Users table: Stores all users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    LoginPasscode VARCHAR(255) NOT NULL, -- Hashed password
    profile_picture VARCHAR(255), -- Optional path to profile picture
    system_role ENUM('Admin', 'User') NOT NULL DEFAULT 'User', -- System-wide role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table: Stores all project details
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Active', 'Finished', 'Failed') DEFAULT 'Active',
    deadline DATE, -- Nullable deadline
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Members table: Links users to projects with project-specific roles
CREATE TABLE project_members (
    user_id INT NOT NULL,
    project_id INT NOT NULL,
    role ENUM('Owner', 'Manager', 'Participant') NOT NULL,
    PRIMARY KEY (user_id, project_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Tasks table: Stores all tasks within a project
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Task Assignment table: Links users to tasks
CREATE TABLE task_assignments (
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (task_id, user_id),
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Project Stakeholders Table: Tracks stakeholders assigned to a project
CREATE TABLE project_stakeholders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role VARCHAR(50) NOT NULL, -- e.g., Sponsor, Client, Consultant
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Project Charter Table: Stores project objectives and status updates
CREATE TABLE project_charters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    objective TEXT NOT NULL,
    sponsor_info TEXT NOT NULL,
    status ENUM('Draft', 'Authorized') DEFAULT 'Draft',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
