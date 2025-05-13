import { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import AddListModal from './components/AddListModal';
import ListItem from './components/ListItem';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('lists');
    const parsedLists = savedLists ? JSON.parse(savedLists) : [];
    return parsedLists.map((list) => ({
      ...list,
      color: list.color || 'blue',
    }));
  });
  const [selectedListId, setSelectedListId] = useState(null);
  const [filter, setFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  const addList = (name, color) => {
    setLists([...lists, { id: Date.now(), name, color, tasks: [] }]);
  };

  const updateList = (id, newName, newColor) => {
    setLists(
      lists.map((list) =>
        list.id === id ? { ...list, name: newName, color: newColor } : list
      )
    );
  };

  const deleteList = (id) => {
    setLists(lists.filter((list) => list.id !== id));
    if (selectedListId === id) setSelectedListId(null);
  };

  const selectList = (id) => {
    setSelectedListId(id);
  };

  const addTask = (title, dueDate) => {
    setLists(
      lists.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              tasks: [...list.tasks, { id: Date.now(), title, dueDate, completed: false }],
            }
          : list
      )
    );
  };

  const updateTask = (taskId, newTitle, newDueDate) => {
    setLists(
      lists.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId ? { ...task, title: newTitle, dueDate: newDueDate } : task
              ),
            }
          : list
      )
    );
  };

  const deleteTask = (taskId) => {
    setLists(
      lists.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              tasks: list.tasks.filter((task) => task.id !== taskId),
            }
          : list
      )
    );
  };

  const toggleComplete = (taskId) => {
    setLists(
      lists.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : list
      )
    );
  };

  const selectedList = lists.find((list) => list.id === selectedListId);

  const filteredTasks = selectedList && filter
    ? selectedList.tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return (
          dueDate >= new Date(filter.start.setHours(0, 0, 0, 0)) &&
          dueDate <= new Date(filter.end.setHours(23, 59, 59, 999))
        );
      })
    : selectedList?.tasks || [];

  return (
    <ThemeProvider>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 header-title">
              TaskTrackr
            </h1>
          </div>
          <ThemeToggle />
        </header>
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="w-full lg:w-1/3 mb-8">
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary w-full mb-6"
            >
              + New List
            </button>
            <AddListModal
              isOpen={isModalOpen}
              closeModal={() => setIsModalOpen(false)}
              addList={addList}
            />
            <FilterBar setFilter={setFilter} />
            <ul className="space-y-3">
              {lists.length ? (
                lists.map((list) => (
                  <ListItem
                    key={list.id}
                    list={list}
                    updateList={updateList}
                    deleteList={deleteList}
                    selectList={selectList}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No lists available. Add a new list!
                </p>
              )}
            </ul>
          </div>
          <div className="w-full lg:w-2/3">
            {selectedList ? (
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-[var(--text-color)]">
                  {selectedList.name}
                </h2>
                <TaskForm addTask={addTask} />
                <TaskList
                  tasks={filteredTasks}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  toggleComplete={toggleComplete}
                />
                {filteredTasks.length === 0 && filter && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No tasks match the selected filter.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Select a list to view its tasks.
              </p>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;