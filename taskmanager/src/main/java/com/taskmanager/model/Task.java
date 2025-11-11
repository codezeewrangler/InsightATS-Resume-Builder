package com.taskmanager.model;

import java.time.LocalDate;

public class Task {
    private int id;
    private String title;
    private String description;
    private String status;
    private LocalDate dueDate;
    private int userId;

    // 1. Constructor for creating NEW tasks (this one fixes your error)
    public Task(String title, String description, String status, LocalDate dueDate, int userId) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate;
        this.userId = userId;
    }

    // 2. Constructor for retrieving tasks FROM the database
    // (Your TaskDAO will need this one later)
    public Task(int id, String title, String description, String status, LocalDate dueDate, int userId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate;
        this.userId = userId;
    }

    // 3. Getters and Setters (needed for JSPs and DAOs)
    
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
}