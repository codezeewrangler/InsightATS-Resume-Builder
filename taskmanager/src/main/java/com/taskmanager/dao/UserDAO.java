package com.taskmanager.dao;

import com.taskmanager.model.User;
import com.taskmanager.util.DBUtil;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDAO {

    // SQL for users table
    private static final String INSERT_USER_SQL = "INSERT INTO users (username, password) VALUES (?, ?)";
    private static final String SELECT_USER_SQL = "SELECT * FROM users WHERE username = ? AND password = ?";

    /**
     * Registers a new user in the database.
     */
    public boolean registerUser(User user) throws SQLException {
        boolean rowInserted = false;
        try (Connection connection = DBUtil.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_USER_SQL)) {
            
            preparedStatement.setString(1, user.getUsername());
            preparedStatement.setString(2, user.getPassword());
            
            rowInserted = preparedStatement.executeUpdate() > 0;
        } catch (SQLException e) {
            if (e.getSQLState().startsWith("23")) {
                System.err.println("Error: Username already exists.");
            } else {
                e.printStackTrace();
            }
        }
        return rowInserted;
    }

    /**
     * Validates a user's login credentials.
     */
    public User validateUser(String username, String password) {
        User user = null;
        try (Connection connection = DBUtil.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_USER_SQL)) {
            
            preparedStatement.setString(1, username);
            preparedStatement.setString(2, password);

            ResultSet rs = preparedStatement.executeQuery();

            if (rs.next()) {
                user = new User(
                    rs.getInt("id"),
                    rs.getString("username"),
                    rs.getString("password")
                );
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return user;
    }
}