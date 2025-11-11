package com.taskmanager.controller;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession; // Import the HttpSession class

import com.taskmanager.dao.UserDAO;
import com.taskmanager.model.User;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserDAO userDAO;

    public void init() {
        userDAO = new UserDAO();
    }

    // Handle GET by showing the login page
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher("login.jsp").forward(request, response);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Get parameters from the login form
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        // 2. Validate the user with the DAO
        User user = userDAO.validateUser(username, password);

        // 3. Check if validation was successful
        if (user != null) {
            // SUCCESS: User credentials are correct
            
            // 4. Create a new session (or get the existing one)
            HttpSession session = request.getSession();
            
            // 5. Store the user object in the session
            // This is how we "remember" the user is logged in
            session.setAttribute("loggedInUser", user);

            // 6. Send the user to the main task list
            response.sendRedirect("TaskController");
            
        } else {
            // FAILURE: Invalid username or password
            
            // 7. Send the user back to the login page
            // (In a real app, you would add an error message here)
            response.sendRedirect("login.jsp");
        }
    }
}