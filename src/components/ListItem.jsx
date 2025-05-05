import { useState } from 'react';
import { format } from 'date-fns';

const ListItem = ({ list, updateList, deleteList, selectList }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(list.name);
  const [newDueDate, setNewDueDate] = useState(list.dueDate || '');
  const [newColor, setNewColor] = useState(list.color || 'blue');

  const handleUpdate = () => {
    if (newName.trim()) {
      updateList(list.id, newName, newDueDate, newColor);
      setIsEditing(false);
    }
  };

  const colors = [
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
    { name: 'Red', value: 'red', bg: 'bg-red-500' },
    { name: 'Green', value: 'green', bg: 'bg-green-500' },
    { name: 'Purple', value: 'purple', bg: 'bg-purple-500' },
    { name: 'Orange', value: 'orange', bg: 'bg-orange-500' },
  ];

  return (
    <li
      className={`card p-4 mb-4 cursor-pointer ${list.color ? `color-${list.color}` : 'color-blue'}`}
      onClick={() => selectList(list.id)}
    >
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="w-full p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-color)]">
              Color
            </label>
            <div className="flex space-x-2">
              {colors.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setNewColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.bg} border-2 ${
                    newColor === c.value
                      ? 'border-blue-700 dark:border-blue-300'
                      : 'border-transparent'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label={`Select ${c.name} color`}
                />
              ))}
            </div>
          </div>
          <button onClick={handleUpdate} className="btn-secondary">
            Save
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span
              className={`w-3 h-3 rounded-full color-dot-${list.color || 'blue'}`}
            ></span>
            <div>
              <span className="font-medium text-lg">{list.name}</span>
              {list.dueDate && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Due: {format(new Date(list.dueDate), 'MMM dd, yyyy')}
                </p>
              )}
            </div>
          </div>
          <div className="space-x-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="btn-secondary"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteList(list.id);
              }}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default ListItem;