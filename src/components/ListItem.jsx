import { useState } from 'react';
import { format } from 'date-fns';

const ListItem = ({ list, updateList, deleteList, selectList }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(list.name);
    const [newDueDate, setNewDueDate] = useState(list.dueDate || '');

    const handleUpdate = () => {
        if (newName.trim()) {
            updateList(list.id, newName, newDueDate);
            setIsEditing(false);
        }
    };

    return (
        <li className="card p-4 mb-4 cursor-pointer" onClick={() => selectList(list.id)}>
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
                    <button onClick={handleUpdate} className="btn-secondary">
                        Save
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <div>
                        <span className="font-medium text-lg">{list.name}</span>
                        {list.dueDate && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Due: {format(new Date(list.dueDate), 'MMM dd, yyyy')}
                        </p>
                        )}
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