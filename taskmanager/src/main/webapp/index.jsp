<%-- 1. SECURITY CHECK --%>
<%@ page import="com.taskmanager.model.User" %>
<%
    User loggedInUser = (User) session.getAttribute("loggedInUser");
    if (loggedInUser == null) {
        response.sendRedirect("login.jsp");
        return;
    }
%>

<%-- 2. PAGE IMPORTS --%>
<%@ page import="java.util.List" %>
<%@ page import="com.taskmanager.model.Task" %>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>TaskFlow</title>
    
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
    
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            background-color: #f8f9fa;
        }
        
        /* --- Layout --- */
        .sidebar {
            position: fixed;
            top: 0; left: 0;
            height: 100vh;
            width: 250px;
            padding: 20px;
            background-color: #f8f9fa;
            border-right: 1px solid #dee2e6;
            z-index: 100;
        }
        .sidebar-header {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .sidebar-nav .nav-link {
            color: #555;
            padding: 10px 15px;
            border-radius: 6px;
        }
        .sidebar-nav .nav-link.active,
        .sidebar-nav .nav-link:hover {
            background-color: #e9ecef;
            color: #000;
        }
        
        .main-content {
            margin-left: 250px;
            padding: 20px;
            transition: filter 0.3s ease-in-out;
            background-color: #ffffff;
            min-height: 100vh;
        }
        .main-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .search-bar { max-width: 400px; }
        .user-profile { font-weight: bold; text-align: right; }

        /* --- Card Styles --- */
        .card { 
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out; 
            position: relative; 
            cursor: grab;
        }
        .card:hover { 
            transform: translateY(-5px); 
            box-shadow: 0 8px 16px rgba(0,0,0,0.2); 
        }
        
        .column-header {
            padding: 10px 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            color: #ffffff;
        }
        .header-todo { background-color: #6c757d; }
        .header-inprogress { background-color: #007bff; }
        .header-completed { background-color: #28a745; }

        .card-pending { border-left: 5px solid #6c757d; }
        .card-in-progress { border-left: 5px solid #007bff; }
        .card-completed { border-left: 5px solid #28a745; }

        .card-actions {
            position: absolute;
            bottom: 10px;
            right: 15px;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            cursor: default;
        }
        .card:hover .card-actions {
            opacity: 1;
        }
        .action-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            text-decoration: none;
            color: white;
            margin-left: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.15);
        }
        .action-btn-edit { background-color: #007bff; }
        .action-btn-delete { background-color: #dc3545; }
        .action-btn:hover { opacity: 0.8; }
        
        .task-column {
            min-height: 200px; 
        }

        /* Smooth drag visual helpers */
        .sortable-ghost {
            opacity: 0.6;
            transform: scale(0.98);
            box-shadow: 0 12px 24px rgba(0,0,0,0.18) !important;
            z-index: 9999;
        }
        .sortable-chosen {
            cursor: grabbing;
            box-shadow: 0 6px 14px rgba(0,0,0,0.14) !important;
        }

        /* --- Floating Action Button (FAB) --- */
        .fab {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #007bff;
            color: white;
            border-radius: 50%;
            font-size: 30px;
            line-height: 60px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 101;
            cursor: pointer;
            transition: background-color 0.2s;
            text-decoration: none;
        }
        .fab:hover {
            background-color: #0056b3;
            color: white;
        }

        /* --- Modal Styles --- */
        .modal-backdrop {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 102;
        }
        .main-content.blur-background {
            filter: blur(5px) brightness(0.8);
            pointer-events: none;
        }
        .task-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.25);
            z-index: 103;
            width: 90%;
            max-width: 500px;
        }
        .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            font-weight: bold;
            color: #aaa;
            cursor: pointer;
            text-decoration: none;
        }
        .close-btn:hover { color: #333; }
    </style>
</head>
<body>

    <div class="sidebar">
        <div class="sidebar-header">
            TaskFlow
        </div>
        <ul class="nav flex-column sidebar-nav">
            <li class="nav-item">
                <a class="nav-link active" href="#">
                    <i class="bi bi-grid-fill"></i> Dashboard
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <i class="bi bi-folder-fill"></i> Projects
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">
                    <i class="bi bi-people-fill"></i> Team
                </a>
            </li>
        </ul>
    </div>

    <div class="main-content" id="mainPageContent">

        <header class="main-header">
            <div class="search-bar">
                <input type="text" class="form-control" placeholder="Search tasks...">
            </div>
            <div class="user-profile">
                Welcome, <b><%= loggedInUser.getUsername() %></b>!
                &nbsp; | &nbsp;
                <a href="LogoutServlet">Logout</a>
            </div>
        </header>
        
        <hr>

        <h2>Task Board</h2>
        <div class="row">
            <% List<Task> taskList = (List<Task>) request.getAttribute("taskList"); %>
            
            <div id="column-pending" class="col-md-4 task-column" data-status="Pending">
                <h3 class="column-header header-todo">To Do</h3>
                <%
                    if (taskList != null) {
                        for (Task task : taskList) {
                            if ("Pending".equals(task.getStatus())) {
                %>
                                <div class="card mb-3 card-pending" data-task-id="<%= task.getId() %>">
                                    <div class="card-body">
                                        <h5 class="card-title"><%= task.getTitle() %></h5>
                                        <h6 class="card-subtitle mb-2 text-muted"><%= task.getDueDate() %></h6>
                                        <p class="card-text"><%= task.getDescription() %></p>
                                        <div class="card-actions">
                                            <a href="TaskController?action=edit&id=<%= task.getId() %>" class="action-btn action-btn-edit"><i class="bi bi-pencil-fill"></i></a>
                                            <a href="TaskController?action=delete&id=<%= task.getId() %>" class="action-btn action-btn-delete"><i class="bi bi-trash-fill"></i></a>
                                        </div>
                                    </div>
                                </div>
                <%
                            }
                        }
                    }
                %>
            </div>
            
            <div id="column-inprogress" class="col-md-4 task-column" data-status="In Progress">
                <h3 class="column-header header-inprogress">In Progress</h3>
                <%
                    if (taskList != null) {
                        for (Task task : taskList) {
                            if ("In Progress".equals(task.getStatus())) {
                %>
                                <div class="card mb-3 card-in-progress" data-task-id="<%= task.getId() %>">
                                    <div class="card-body">
                                        <h5 class="card-title"><%= task.getTitle() %></h5>
                                        <h6 class="card-subtitle mb-2 text-muted"><%= task.getDueDate() %></h6>
                                        <p class="card-text"><%= task.getDescription() %></p>
                                        <div class="card-actions">
                                            <a href="TaskController?action=edit&id=<%= task.getId() %>" class="action-btn action-btn-edit"><i class="bi bi-pencil-fill"></i></a>
                                            <a href="TaskController?action=delete&id=<%= task.getId() %>" class="action-btn action-btn-delete"><i class="bi bi-trash-fill"></i></a>
                                        </div>
                                    </div>
                                </div>
                <%
                            }
                        }
                    }
                %>
            </div>
            
            <div id="column-completed" class="col-md-4 task-column" data-status="Completed">
                <h3 class="column-header header-completed">Completed</h3>
                <%
                    if (taskList != null) {
                        for (Task task : taskList.toArray(new Task[0])) {
                            if ("Completed".equals(task.getStatus())) {
                %>
                                <div class="card mb-3 card-completed" data-task-id="<%= task.getId() %>">
                                    <div class="card-body">
                                        <h5 class="card-title"><%= task.getTitle() %></h5>
                                        <h6 class="card-subtitle mb-2 text-muted"><%= task.getDueDate() %></h6>
                                        <p class="card-text"><%= task.getDescription() %></p>
                                        <div class="card-actions">
                                            <a href="TaskController?action=edit&id=<%= task.getId() %>" class="action-btn action-btn-edit"><i class="bi bi-pencil-fill"></i></a>
                                            <a href="TaskController?action=delete&id=<%= task.getId() %>" class="action-btn action-btn-delete"><i class="bi bi-trash-fill"></i></a>
                                        </div>
                                    </div>
                                </div>
                <%
                            }
                        }
                    }
                %>
            </div>
            
        </div> </div> <div class="task-modal" id="addTaskModal">
        <a href="#" class="close-btn" id="closeModalBtn">&times;</a>
        <form action="TaskController" method="post">
            <input type="hidden" name="action" value="insert" />
            <h2>Add New Task</h2>
    
            <div class="mb-3">
                <label for="title" class="form-label">Title:</label>
                <input type="text" class="form-control" id="title" name="title" required>
            </div>
            <div class="mb-3">
                <label for="description" class="form-label">Description:</label>
                <textarea class="form-control" id="description" name="description" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <label for="status" class="form-label">Status:</label>
                <select class="form-select" id="status" name="status">
                    <option value="Pending">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="dueDate" class="form-label">Due Date:</label>
                <input type="date" class="form-control" id="dueDate" name="dueDate" required>
            </div>
    
            <button type="submit" class="btn btn-primary">Add Task</button>
        </form>
    </div>
    
    <div class="modal-backdrop" id="modalBackdrop"></div>
    <a href="#" id="fab" class="fab">+</a>
    
    <script>
        // --- Modal Logic ---
        var fab = document.getElementById("fab");
        var modal = document.getElementById("addTaskModal");
        var backdrop = document.getElementById("modalBackdrop");
        var mainContent = document.getElementById("mainPageContent");
        var closeBtn = document.getElementById("closeModalBtn");

        function openModal() {
            modal.style.display = "block";
            backdrop.style.display = "block";
            mainContent.classList.add("blur-background");
        }
        function closeModal() {
            modal.style.display = "none";
            backdrop.style.display = "none";
            mainContent.classList.remove("blur-background");
        }
        fab.onclick = openModal;
        closeBtn.onclick = closeModal;
        backdrop.onclick = closeModal;

        // --- 🔴 CORRECTED Drag-and-Drop Logic 🔴 ---
        
        var columns = document.querySelectorAll(".task-column");

        // Helper function to update the database (returns a Promise)
        // Performs a POST and resolves true on success, false on failure.
        // If `optimisticOldClasses` is provided and the server fails, it will revert the card's classes.
        function updateTaskStatus(taskId, newStatus, cardElement, optimisticOldClasses) {
            console.log(`Sending update: taskId=${taskId}, newStatus=${newStatus}`);

            // encode body values to be safe
            var body = 'action=dragUpdate&taskId=' + encodeURIComponent(taskId)
                     + '&newStatus=' + encodeURIComponent(newStatus);

            return fetch("TaskController", {
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            })
            .then(response => {
                if (!response.ok) {
                    console.error("Server responded with an error:", response.status);
                    throw new Error("Server error");
                }
                // attempt to parse JSON, but guard against non-JSON responses
                return response.text().then(txt => {
                    try { return JSON.parse(txt); }
                    catch (e) { throw new Error('Invalid JSON response'); }
                });
            })
            .then(data => {
                if (data && data.status === "success") {
                    console.log("SUCCESS: Server confirmed update.");

                    // ensure classes reflect final server state (idempotent)
                    cardElement.classList.remove("card-pending", "card-in-progress", "card-completed");
                    if (newStatus === "Pending") cardElement.classList.add("card-pending");
                    else if (newStatus === "In Progress") cardElement.classList.add("card-in-progress");
                    else if (newStatus === "Completed") cardElement.classList.add("card-completed");

                    return true;
                } else {
                    console.error("FAILURE: Server returned an error message.");
                    throw new Error('Server failure');
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                // revert optimistic UI if we were optimistic
                if (optimisticOldClasses && Array.isArray(optimisticOldClasses)) {
                    cardElement.classList.remove("card-pending", "card-in-progress", "card-completed");
                    optimisticOldClasses.forEach(function(c) { cardElement.classList.add(c); });
                }
                return false;
            });
        }

        // Initialize Sortable.js for each column
        columns.forEach(column => {
            new Sortable(column, {
                group: 'shared', // This links all columns
                animation: 180, // slightly smoother animation
                easing: 'cubic-bezier(.2, .8, .2, 1)',
                ghostClass: 'sortable-ghost', // class for the dragged (ghost) element
                chosenClass: 'sortable-chosen', // class for the chosen element
                dragClass: 'sortable-drag',
                fallbackOnBody: true,
                swapThreshold: 0.65,
                scroll: true,
                scrollSensitivity: 40,
                scrollSpeed: 10,
                // FIX: Filter headers AND action buttons to prevent dragging them
                filter: '.column-header, .card-actions',
                preventOnFilter: true, // Stop drag from starting
                
                // This function is called when a card is dropped
                onEnd: function (event) {
                    var card = event.item;
                    var taskId = card.getAttribute('data-task-id');
                    var newColumn = event.to;
                    var newStatus = newColumn.getAttribute('data-status');

                    console.log("Drag ended. Card dropped.");

                    // Save existing status classes so we can revert if server update fails
                    var oldClasses = [];
                    if (card.classList.contains('card-pending')) oldClasses.push('card-pending');
                    if (card.classList.contains('card-in-progress')) oldClasses.push('card-in-progress');
                    if (card.classList.contains('card-completed')) oldClasses.push('card-completed');

                    // Optimistic UI: immediately update the card's class so color changes on drop
                    card.classList.remove('card-pending', 'card-in-progress', 'card-completed');
                    if (newStatus === 'Pending') card.classList.add('card-pending');
                    else if (newStatus === 'In Progress') card.classList.add('card-in-progress');
                    else if (newStatus === 'Completed') card.classList.add('card-completed');

                    // Send update; if it fails the promise will revert the classes
                    updateTaskStatus(taskId, newStatus, card, oldClasses).then(function(success) {
                        if (!success) {
                            // Optionally notify the user here
                            console.warn('Failed to persist task status; UI reverted.');
                        }
                    });
                }
            });
        });
    </script>
</body>
</html>