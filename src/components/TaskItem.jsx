import { useState } from 'react';
import { format } from 'date-fns';

const TaskItem = ({ task, updateTask, deleteTask, toggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [newDueDate, setNewDueDate] = useState(task.dueDate || '');

  const handleUpdate = () => {
    if (newTitle.trim()) {
      updateTask(task._id, newTitle, newDueDate);
      setIsEditing(false);
    }
  };

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  return (
    <li className="card flex items-center p-4 mb-3">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task._id)}
          className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
          aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
        />
        {isOverdue && (
          <span
            className="w-3 h-3 rounded-full bg-red-500"
            aria-label="Task overdue"
          ></span>
        )}
      </div>
      {isEditing ? (
        <div className="flex-1 space-y-3 ml-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            aria-label="Edit task title"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Edit task due date"
          />
          <button onClick={handleUpdate} className="btn-secondary">
            Save
          </button>
        </div>
      ) : (
        <div className="flex-1 cursor-pointer ml-3" onClick={() => setIsEditing(true)}>
          <span
            className={`block ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}
          >
            {task.title}
          </span>
          {task.dueDate && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </p>
          )}
        </div>
      )}
      <button
        onClick={() => deleteTask(task._id)}
        className="ml-2 btn-danger"
        aria-label={`Delete ${task.title}`}
      >
        Delete
      </button>
    </li>
  );
};

export default TaskItem;