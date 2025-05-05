import { useState } from 'react';

const TaskForm = ({ addTask }) => {
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title.trim()) {
            addTask(title);
            setTitle('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a task"
                className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </form>
    );
};

export default TaskForm;