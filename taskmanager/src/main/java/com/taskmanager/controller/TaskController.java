package com.taskmanager.controller;

import java.io.IOException;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import com.taskmanager.dao.TaskDAO;
import com.taskmanager.model.Task;
import com.taskmanager.model.User;

@WebServlet("/TaskController")
public class TaskController extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private TaskDAO taskDAO;

    public void init() {
        taskDAO = new TaskDAO();
    }

    // Handles GET requests
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loggedInUser") == null) {
            response.sendRedirect("login.jsp");
            return; 
        }
        
        User loggedInUser = (User) session.getAttribute("loggedInUser");
        int userId = loggedInUser.getId();

        String action = request.getParameter("action");

        try {
            if (action != null && action.equals("delete")) {
                int id = Integer.parseInt(request.getParameter("id"));
                taskDAO.deleteTask(id, userId);
                response.sendRedirect("TaskController");
            
            } else if (action != null && action.equals("edit")) {
                int id = Integer.parseInt(request.getParameter("id"));
                Task existingTask = taskDAO.selectTaskById(id, userId);
                request.setAttribute("taskToEdit", existingTask);
                request.getRequestDispatcher("edit-task-form.jsp").forward(request, response);
            
            } else {
                // Default action: list all tasks
                listTasks(request, response, userId);
            }
        } catch (SQLException e) {
            throw new ServletException(e);
        }
    }

    // Handles POST requests (inserts, updates, AND drag-and-drop)
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loggedInUser") == null) {
        // If it's a background request, send a JSON error
            if ("dragUpdate".equalsIgnoreCase(request.getParameter("action"))) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401 Error
                response.getWriter().write("{\"status\":\"error\", \"message\":\"Not logged in\"}");
            } else {
                response.sendRedirect("login.jsp");
            }
            return;
        }

        User loggedInUser = (User) session.getAttribute("loggedInUser");
        int userId = loggedInUser.getId();

        String action = request.getParameter("action"); 

        try {
            if (action != null && action.equalsIgnoreCase("insert")) {
                insertTask(request, response, userId);

            } else if (action != null && action.equalsIgnoreCase("update")) {
                updateTask(request, response, userId);

            // 🔴 NEW: Handle the drag-and-drop update 🔴
            } else if (action != null && action.equalsIgnoreCase("dragUpdate")) {
                handleDragUpdate(request, response, userId);

            } else {
            doGet(request, response);
            }
        } catch (SQLException e) {
            throw new ServletException(e);
        }
    } 
    // --- HELPER METHODS ---

    private void listTasks(HttpServletRequest request, HttpServletResponse response, int userId) 
            throws ServletException, IOException {
        
        // This now correctly calls selectAllTasks
        List<Task> taskList = taskDAO.selectAllTasks(userId); 
        request.setAttribute("taskList", taskList);
        request.getRequestDispatcher("index.jsp").forward(request, response);
    }

    private void updateTask(HttpServletRequest request, HttpServletResponse response, int userId) 
            throws IOException, SQLException {
        
        int id = Integer.parseInt(request.getParameter("id"));
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String status = request.getParameter("status");
        LocalDate dueDate = LocalDate.parse(request.getParameter("dueDate"));

        Task taskToUpdate = new Task(id, title, description, status, dueDate, userId);
        
        taskDAO.updateTask(taskToUpdate);
        response.sendRedirect("TaskController");
    }

    private void insertTask(HttpServletRequest request, HttpServletResponse response, int userId) 
            throws IOException, SQLException {
        
        String title = request.getParameter("title");
        String description = request.getParameter("description");
        String status = request.getParameter("status");
        LocalDate dueDate = LocalDate.parse(request.getParameter("dueDate")); 

        Task newTask = new Task(title, description, status, dueDate, userId);
        
        taskDAO.insertTask(newTask);
        response.sendRedirect("TaskController"); 
    }
    /**
     * Handles the background request from the drag-and-drop JavaScript.
     */
    private void handleDragUpdate(HttpServletRequest request, HttpServletResponse response, int userId) 
            throws IOException, SQLException {

        // 1. Get parameters from the JavaScript fetch request
        int taskId = Integer.parseInt(request.getParameter("taskId"));
        String newStatus = request.getParameter("newStatus");

        // 2. Call the new DAO method
        boolean success = taskDAO.updateTaskStatus(taskId, newStatus, userId);

        // 3. Send a JSON response back to the JavaScript
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (success) {
            response.getWriter().write("{\"status\":\"success\"}");
        } else {
            response.getWriter().write("{\"status\":\"error\"}");
        }
    }
}