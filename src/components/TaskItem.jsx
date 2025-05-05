import { useState } from 'react';

const TaskItem = ({ task, updateTask, deleteTask, toggleComplete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);

  const handleUpdate = () => {
    if (newTitle.trim()) {
      updateTask(task.id, newTitle);
      setIsEditing(false);
    }
  };

  return (
    <li className="card flex items-center p-4 mb-3">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
        className="mr-3 h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
      />
      {isEditing ? (
        <div className="flex-1 flex items-center">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button onClick={handleUpdate} className="ml-2 btn-secondary">
            Save
          </button>
        </div>
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`flex-1 cursor-pointer ${
            task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
          }`}
        >
          {task.title}
        </span>
      )}
      <button onClick={() => deleteTask(task.id)} className="ml-2 btn-danger">
        Delete
      </button>
    </li>
  );
};

export default TaskItem;