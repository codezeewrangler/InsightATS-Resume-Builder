package com.taskmanager.controller;

import java.io.IOException;
import java.sql.SQLException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.taskmanager.dao.UserDAO;
import com.taskmanager.model.User;

@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserDAO userDAO;

    public void init() {
        userDAO = new UserDAO();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Get parameters from the registration form
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        // 2. Create a new User object
        User newUser = new User(username, password);

        try {
            // 3. Attempt to register the user
            boolean isRegistered = userDAO.registerUser(newUser);

            if (isRegistered) {
                // 4. If successful, send them to the login page
                response.sendRedirect("login.jsp");
            } else {
                // 5. If it fails (e.g., username taken), send them back to register
                // You could also add an error message here
                response.sendRedirect("register.jsp");
            }
        } catch (SQLException e) {
            throw new ServletException(e);
        }
    }
}