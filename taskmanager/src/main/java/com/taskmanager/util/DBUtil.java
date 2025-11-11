package com.taskmanager.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBUtil {

    // Load DB configuration from classpath properties (recommended) or environment variables
    private static final String DEFAULT_JDBC_DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String DEFAULT_DB_URL = "jdbc:mysql://localhost:3306/task_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";

    private static final String JDBC_DRIVER;
    private static final String DB_URL;
    private static final String USER;
    private static final String PASS;

    static {
        java.util.Properties props = new java.util.Properties();
        String driver = null;
        String url = null;
        String user = null;
        String pass = null;

        // 1) attempt to load from classpath application.properties
        try (java.io.InputStream in = DBUtil.class.getClassLoader().getResourceAsStream("application.properties")) {
            if (in != null) {
                props.load(in);
                driver = props.getProperty("jdbc.driver");
                url = props.getProperty("jdbc.url");
                user = props.getProperty("jdbc.user");
                pass = props.getProperty("jdbc.password");
            }
        } catch (Exception e) {
            // ignore and fallback to env/defaults
        }

        // 2) fallback to environment variables if not present in properties
        if (driver == null || driver.isEmpty()) driver = System.getenv("JDBC_DRIVER");
        if (url == null || url.isEmpty()) url = System.getenv("DB_URL");
        if (user == null || user.isEmpty()) user = System.getenv("DB_USER");
        if (pass == null || pass.isEmpty()) pass = System.getenv("DB_PASS");

        // 3) final fallback to sensible defaults (no secret values in repo)
        JDBC_DRIVER = (driver != null && !driver.isEmpty()) ? driver : DEFAULT_JDBC_DRIVER;
        DB_URL = (url != null && !url.isEmpty()) ? url : DEFAULT_DB_URL;
        USER = (user != null && !user.isEmpty()) ? user : "root";
        PASS = (pass != null && !pass.isEmpty()) ? pass : ""; // default empty; avoid committing real password
    }

    /**
     * Establishes and returns a connection to the database.
     */
    public static Connection getConnection() {
        Connection conn = null;
        try {
            // 1. Load the JDBC Driver
            Class.forName(JDBC_DRIVER);

            // 2. Establish the connection
            conn = DriverManager.getConnection(DB_URL, USER, PASS);
        } catch (ClassNotFoundException e) {
            System.err.println("MySQL JDBC Driver not found!");
            e.printStackTrace();
        } catch (SQLException e) {
            System.err.println("Connection Failed! Check console for details.");
            e.printStackTrace();
        }
        return conn;
    }

    /**
     * Helper method to close the connection to prevent resource leaks.
     */
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
}