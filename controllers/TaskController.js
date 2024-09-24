const { v4: uuidv4 } = require('uuid');
const { db } = require('../database');

// Get all tasks for the authenticated user
exports.getTasks = (req, res) => {
  const userId = req.userId;
  const query = `SELECT * FROM tasks WHERE user_id = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching tasks' });
    res.json(rows);
  });
};

// Create a new task
exports.createTask = (req, res) => {
  const { title, description, status } = req.body;
  const taskId = uuidv4();
  const userId = req.userId;

  const query = `INSERT INTO tasks (id, user_id, title, description, status) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [taskId, userId, title, description, status], (err) => {
    if (err) return res.status(500).json({ message: 'Error creating task' });
    res.status(201).json({ message: 'Task created' });
  });
};

// Update a task
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const userId = req.userId;

  const query = `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?`;
  db.run(query, [title, description, status, id, userId], function (err) {
    if (err) return res.status(500).json({ message: 'Error updating task' });
    if (this.changes === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task updated' });
  });
};

// Delete a task
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const query = `DELETE FROM tasks WHERE id = ? AND user_id = ?`;
  db.run(query, [id, userId], function (err) {
    if (err) return res.status(500).json({ message: 'Error deleting task' });
    if (this.changes === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  });
};
