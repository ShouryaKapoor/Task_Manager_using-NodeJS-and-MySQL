-- Active: 1720526564448@@127.0.0.1@3306@sk
CREATE DATABASE task_manager;

USE task_manager;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'to-do',
    FOREIGN KEY (user_id) REFERENCES users(id)
);
