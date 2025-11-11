# TaskManager

A small Java Servlet + JSP task manager app.

This README covers how to run the app locally, how to securely provide DB credentials, build & deploy steps, and quick troubleshooting tips.

## Local setup (macOS, zsh)

1. Copy the example application properties (do NOT commit the real file):

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
nano src/main/resources/application.properties
```

Fill in `jdbc.user` and `jdbc.password` with your local DB user.

2. OR: export environment variables instead of creating a file (works well for CI or Tomcat):

```bash
export DB_URL='jdbc:mysql://localhost:3306/task_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true'
export DB_USER='your_db_user'
export DB_PASS='your_db_password'
export JDBC_DRIVER='com.mysql.cj.jdbc.Driver'   # optional
```

To persist these, add them to `~/.zshrc`.

## Build

```bash
mvn -f /Users/yashovardhantiwari/Documents/Projects/taskmanager/pom.xml package
# artifact: target/taskmanager.war
```

## Deploy to Tomcat (example)

```bash
cp target/taskmanager.war /path/to/tomcat/webapps/
sh /path/to/tomcat/bin/shutdown.sh
sh /path/to/tomcat/bin/startup.sh
```

If you prefer environment variables with Tomcat, create `setenv.sh` in `$TOMCAT_HOME/bin`:

```bash
cat > $TOMCAT_HOME/bin/setenv.sh <<'SH'
#!/bin/sh
export DB_URL='jdbc:mysql://localhost:3306/task_db?useSSL=false&serverTimezone=UTC'
export DB_USER='your_db_user'
export DB_PASS='your_db_password'
export JDBC_DRIVER='com.mysql.cj.jdbc.Driver'
SH
chmod +x $TOMCAT_HOME/bin/setenv.sh
```

Then restart Tomcat.

## Quick troubleshooting

- If you see `NullPointerException` where `connection` is null, tail Tomcat logs for the real cause (SQLException or ClassNotFound):

```bash
tail -F /path/to/tomcat/logs/catalina.out
```

- If DB credentials are wrong you will see `Access denied` errors in logs. If driver missing you'll see `ClassNotFoundException`.

- Check that `src/main/resources/application.properties` exists and was copied into `target/classes` after `mvn package`.

```bash
ls -l target/classes/application.properties || echo 'no properties in target/classes'
```

## Security notes

- `src/main/resources/application.properties` is ignored by `.gitignore` — DO NOT commit it.
- Use environment variables for CI and production.
- If you accidentally committed secrets, rotate credentials and remove them from git history (I can help with commands for that).

## Development notes

- Drag-and-drop on the task board uses Sortable.js and updates task status via background POST to `TaskController?action=dragUpdate`.
- If you want visual feedback on failed updates, open the browser console — fetch errors are logged there.

---

If you'd like, I can also:
- Add a startup check to `DBUtil` that logs whether credentials were loaded from properties or environment (without printing the password)
- Add a short `CONTRIBUTING.md` or expand this README with screenshots
- Help remove any secrets from git history if needed

Which of those should I do next?