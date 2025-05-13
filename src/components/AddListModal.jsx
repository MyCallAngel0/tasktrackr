import { useState, useEffect, useRef } from 'react';

const AddListModal = ({ isOpen, closeModal, addList }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('blue');
  const modalRef = useRef(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, closeModal]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      addList(name, color);
      setName('');
      setColor('blue');
      closeModal();
    }
  };

  const colors = [
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500' },
    { name: 'Red', value: 'red', bg: 'bg-red-500' },
    { name: 'Green', value: 'green', bg: 'bg-green-500' },
    { name: 'Purple', value: 'purple', bg: 'bg-purple-500' },
    { name: 'Orange', value: 'orange', bg: 'bg-orange-500' },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div
        ref={modalRef}
        className="card p-6 w-full max-w-md transform scale-95 animate-scale-up"
      >
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-color)]">
          New List
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="List Name"
            className="w-full p-3 rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref={nameInputRef}
            aria-label="List name"
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
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.bg} border-2 ${
                    color === c.value
                      ? 'border-blue-700 dark:border-blue-300'
                      : 'border-transparent'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  aria-label={`Select ${c.name} color`}
                />
              ))}
            </div>
          </div>
          <div className="flex space-x-3">
            <button type="submit" className="btn-primary flex-1">
              Add List
            </button>
            <button
              type="button"
              onClick={closeModal}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListModal;