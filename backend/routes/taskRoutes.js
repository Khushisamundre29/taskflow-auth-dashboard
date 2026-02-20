const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");

// All task routes are protected
router.use(protect);

// @route  POST /api/tasks
router.post("/", createTask);

// @route  GET /api/tasks
router.get("/", getTasks);

// @route  PUT /api/tasks/:id
router.put("/:id", updateTask);

// @route  DELETE /api/tasks/:id
router.delete("/:id", deleteTask);

module.exports = router;