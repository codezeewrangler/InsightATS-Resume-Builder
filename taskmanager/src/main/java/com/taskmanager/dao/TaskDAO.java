package com.taskmanager.dao;

import com.taskmanager.model.Task;
import com.taskmanager.util.DBUtil;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

// This class ONLY handles Tasks
public class TaskDAO {

    // All SQL queries should reference the 'tasks' table
    private static final String INSERT_TASK_SQL = "INSERT INTO tasks (title, description, status, due_date, user_id) VALUES (?, ?, ?, ?, ?)";
    private static final String SELECT_TASK_BY_ID_SQL = "SELECT id, title, description, status, due_date, user_id FROM tasks WHERE id = ? AND user_id = ?";
    private static final String SELECT_ALL_TASKS_SQL = "SELECT * FROM tasks WHERE user_id = ?";
    private static final String DELETE_TASK_SQL = "DELETE FROM tasks WHERE id = ? AND user_id = ?";
    private static final String UPDATE_TASK_SQL = "UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ? AND user_id = ?";
    // SQL for updating only the status (for drag-and-drop)
    private static final String UPDATE_TASK_STATUS_SQL = "UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?";

    // --- Insert Task ---
    public void insertTask(Task task) throws SQLException {
        try (Connection connection = DBUtil.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_TASK_SQL)) {
            
            preparedStatement.setString(1, task.getTitle());
            preparedStatement.setString(2, task.getDescription());
            preparedStatement.setString(3, task.getStatus());
            preparedStatement.setDate(4, Date.valueOf(task.getDueDate()));
            preparedStatement.setInt(5, task.getUserId());
            
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // --- Select All Tasks ---
    public List<Task> selectAllTasks(int userId) { 
        List<Task> tasks = new ArrayList<>();
        try (Connection connection = DBUtil.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_ALL_TASKS_SQL)) {
            
            preparedStatement.setInt(1, userId);
            ResultSet rs = preparedStatement.executeQuery();

            while (rs.next()) {
                int id = rs.getInt("id");
                String title = rs.getString("title");
                String description = rs.getString("description");
                String status = rs.getString("status");
                LocalDate dueDate = rs.getDate("due_date").toLocalDate();
                
                tasks.add(new Task(id, title, description, status, dueDate, userId));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return tasks;
    }

    // --- Select Task By ID ---
    public Task selectTaskById(int id, int userId) {
        Task existingTask = null;
        try (Connection connection = DBUtil.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_TASK_BY_ID_SQL)) {
            
            preparedStatement.setInt(1, id);
            preparedStatement.setInt(2, userId);
            ResultSet rs = preparedStatement.executeQuery();

            if (rs.next()) {
                String title = rs.getString("title");
                String description = rs.getString("description");
                String status = rs.getString("status");
                LocalDate dueDate = rs.getDate("due_date").toLocalDate();
                
                existingTask = new Task(id, title, description, status, dueDate, userId);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return existingTask;
    }

    // --- Update Task ---
    public boolean updateTask(Task task) throws SQLException {
        boolean rowUpdated = false;
        try (Connection connection = DBUtil.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(UPDATE_TASK_SQL)) {
            
            preparedStatement.setString(1, task.getTitle());
            preparedStatement.setString(2, task.getDescription());
            preparedStatement.setString(3, task.getStatus());
            preparedStatement.setDate(4, Date.valueOf(task.getDueDate()));
            preparedStatement.setInt(5, task.getId());
            preparedStatement.setInt(6, task.getUserId());

            rowUpdated = preparedStatement.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rowUpdated;
    }
    
    public boolean updateTaskStatus(int taskId, String newStatus, int userId) throws SQLException {
        boolean rowUpdated = false;
        try (Connection connection = DBUtil.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(UPDATE_TASK_STATUS_SQL)) {

            preparedStatement.setString(1, newStatus);
            preparedStatement.setInt(2, taskId);
            preparedStatement.setInt(3, userId);

            rowUpdated = preparedStatement.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rowUpdated;
    }

    // --- Delete Task ---
    public boolean deleteTask(int id, int userId) throws SQLException {
        boolean rowDeleted = false;
        try (Connection connection = DBUtil.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(DELETE_TASK_SQL)) {
            
            preparedStatement.setInt(1, id);
            preparedStatement.setInt(2, userId);
            rowDeleted = preparedStatement.executeUpdate() > 0;
            
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rowDeleted;
    }
}