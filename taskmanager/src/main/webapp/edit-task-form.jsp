<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="com.taskmanager.model.Task" %>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Edit Task</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        form { border: 1px solid #ccc; padding: 20px; border-radius: 8px; max-width: 500px; }
        div { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"], input[type="date"], textarea, select {
            width: 100%; padding: 8px; box-sizing: border-box; 
        }
        button { background-color: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        a { color: #007bff; text-decoration: none; }
    </style>
</head>
<body>
    <%
        // Get the Task object that the Controller passed to this page
        Task existingTask = (Task) request.getAttribute("taskToEdit");
    %>

    <h1>Edit Task</h1>

    <form action="TaskController" method="post">
    
        <input type="hidden" name="action" value="update" />
        
        <input type="hidden" name="id" value="<%= existingTask.getId() %>" />

        <div>
            <label for="title">Title:</label>
            <input type-="text" id="title" name="title" value="<%= existingTask.getTitle() %>" required>
        </div>
        
        <div>
            <label for="description">Description:</label>
            <textarea id="description" name="description" rows="3"><%= existingTask.getDescription() %></textarea>
        </div>
        
        <div>
            <label for="status">Status:</label>
            <select id="status" name="status">
                <option value="Pending" <%= "Pending".equals(existingTask.getStatus()) ? "selected" : "" %>>To Do</option>
                <option value="In Progress" <%= "In Progress".equals(existingTask.getStatus()) ? "selected" : "" %>>In Progress</option>
                <option value="Completed" <%= "Completed".equals(existingTask.getStatus()) ? "selected" : "" %>>Completed</option>
            </select>
        </div>
        
        <div>
            <label for="dueDate">Due Date:</label>
            <input type="date" id="dueDate" name="dueDate" value="<%= existingTask.getDueDate() %>" required>
        </div>
        
        <div>
            <button type="submit">Save Changes</button>
        </div>
    </form>
    
    <p><a href="TaskController">Back to Task List</a></p>

</body>
</html>