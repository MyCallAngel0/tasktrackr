import { useState } from 'react';

const ListItem = ({ list, updateList, deleteList, selectList }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(list.name);

    const handleUpdate = () => {
        if (newName.trim()) {
            updateList(list.id, newName);
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
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                    />
                    <button onClick={handleUpdate} className="btn-secondary">
                        Save
                    </button>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">{list.name}</span>
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