import { useState, useRef, useEffect } from 'react';

const TaskForm = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      addTask(title, dueDate);
      setTitle('');
      setDueDate('');
      setShowDatePicker(false);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (e) => {
    setDueDate(e.target.value);
    setShowDatePicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="relative">
        <div className="flex items-center">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a task"
            className="flex-1 p-3 pr-12 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Task title"
          />
          <button
            type="button"
            onClick={toggleDatePicker}
            className="absolute right-2 p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none"
            aria-label={dueDate ? `Due date set: ${dueDate}` : 'Set due date'}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
        {showDatePicker && (
          <div
            ref={datePickerRef}
            className="absolute z-10 mt-2 w-64 card p-2"
          >
            <input
              type="date"
              value={dueDate}
              onChange={handleDateChange}
              className="w-full p-2 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select task due date"
            />
          </div>
        )}
      </div>
      <button type="submit" className="btn-primary w-full">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;