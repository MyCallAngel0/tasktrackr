import { useState, useEffect, useContext } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import AddListModal from './components/AddListModal';
import ListItem from './components/ListItem';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import ThemeToggle from './components/ThemeToggle';
import AdminPanel from './components/AdminPanel';

const App = () => {
  const { user, token, logout, loading } = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [filter, setFilter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('lists');
  const [view, setView] = useState('login'); // 'login', 'register', 'main', 'admin'
  const [error, setError] = useState(null);


  const toggleAuthView = () => {
    setView(view === 'login' ? 'register' : 'login');
    setError(null);
  };

  const handleLoginSuccess = () => {
    setView('main');
    setError(null);
  };

  const handleRegisterSuccess = () => {
    setView('login');
    setError(null);
  };

  const fetchLists = async () => {
    try {
      const response = await axios.get('https://tasktrackr-61z3.onrender.com/api/lists', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(response.data);
    } catch (error) {
      console.error('App.jsx: Error fetching lists:', error.response?.status, error.message);
      if (error.response?.status === 401) {
        logout();
        setView('login');
      }
    }
  };

  const fetchTasks = async (listId) => {
    try {
      const response = await axios.get(
        `https://tasktrackr-61z3.onrender.com/api/tasks/list/${listId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLists((prevLists) =>
        prevLists.map((list) =>
          list._id === listId ? { ...list, tasks: response.data } : list
        )
      );
    } catch (error) {
      console.error('App.jsx: Error fetching tasks:', error.response?.status, error.message);
      if (error.response?.status === 401) {
        logout();
        setView('login');
      }
    }
  };

  useEffect(() => {
    if (token && !loading && user) {
      fetchLists();
      setView('main');
    } else if (!loading && !user) {
      setView('login');
    }
  }, [token, loading, user]);

  useEffect(() => {
    if (selectedListId && !loading) {
      fetchTasks(selectedListId);
    }
  }, [selectedListId, loading]);

  const addList = async (name, color) => {
    try {
      const response = await axios.post(
        'https://tasktrackr-61z3.onrender.com/api/lists',
        { name, color },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists([...lists, response.data]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('App.jsx: Error adding list:', error.response?.status, error.message);
    }
  };

  const updateList = async (id, newName, newColor) => {
    try {
      const response = await axios.put(
        `https://tasktrackr-61z3.onrender.com/api/lists/${id}`,
        { name: newName, color: newColor },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists(lists.map((list) => (list._id === id ? response.data : list)));
    } catch (error) {
      console.error('App.jsx: Error updating list:', error.response?.status, error.message);
    }
  };

  const deleteList = async (id) => {
    try {
      await axios.delete(`https://tasktrackr-61z3.onrender.com/api/lists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(lists.filter((list) => list._id !== id));
      if (selectedListId === id) setSelectedListId(null);
    } catch (error) {
      console.error('App.jsx: Error deleting list:', error.response?.status, error.message);
    }
  };

  const selectList = (id) => {
    setSelectedListId(id);
    setActiveTab('lists');
    setView('main');
  };

  const addTask = async (title, dueDate) => {
    try {
      const response = await axios.post(
        'https://tasktrackr-61z3.onrender.com/api/tasks',
        { title, dueDate, listId: selectedListId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists(
        lists.map((list) =>
          list._id === selectedListId
            ? { ...list, tasks: [...(list.tasks || []), response.data] }
            : list
        )
      );
    } catch (error) {
      console.error('App.jsx: Error adding task:', error.response?.status, error.message);
    }
  };

  const updateTask = async (taskId, newTitle, newDueDate) => {
    try {
      const response = await axios.put(
        `https://tasktrackr-61z3.onrender.com/api/tasks/${taskId}`,
        { title: newTitle, dueDate: newDueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists(
        lists.map((list) =>
          list._id === selectedListId
            ? {
                ...list,
                tasks: list.tasks.map((task) =>
                  task._id === taskId ? response.data : task
                ),
              }
            : list
        )
      );
    } catch (error) {
      console.error('App.jsx: Error updating task:', error.response?.status, error.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`https://tasktrackr-61z3.onrender.com/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(
        lists.map((list) =>
          list._id === selectedListId
            ? {
                ...list,
                tasks: list.tasks.filter((task) => task._id !== taskId),
              }
            : list
        )
      );
    } catch (error) {
      console.error('App.jsx: Error deleting task:', error.response?.status, error.message);
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      const task = lists
        .find((list) => list._id === selectedListId)
        .tasks.find((t) => t._id === taskId);
      const response = await axios.put(
        `https://tasktrackr-61z3.onrender.com/api/tasks/${taskId}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists(
        lists.map((list) =>
          list._id === selectedListId
            ? {
                ...list,
                tasks: list.tasks.map((task) =>
                  task._id === taskId ? response.data : task
                ),
              }
            : list
        )
      );
    } catch (error) {
      console.error('App.jsx: Error toggling task:', error.response?.status, error.message);
    }
  };

  const selectedList = lists.find((list) => list._id === selectedListId);

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

  if (loading) {
    return <div className="text-center py-10 text-[var(--text-color)]">Loading...</div>;
  }

  return (
    <ThemeProvider>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 min-h-screen bg-[var(--bg-color)]">
        {view === 'login' && (
          <Login
            toggleView={toggleAuthView}
            onLoginSuccess={handleLoginSuccess}
            setError={setError}
          />
        )}
        {view === 'register' && (
          <Register
            toggleView={toggleAuthView}
            onRegisterSuccess={handleRegisterSuccess}
            setError={setError}
          />
        )}
        {(view === 'main' || view === 'admin') && user && (
          <>
            <header className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 header-title">
                  TaskTrackr
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                  {user.email}
                </span>
                <button onClick={() => { logout(); setView('login'); }} className="btn-secondary">
                  Logout
                </button>
                <ThemeToggle />
              </div>
            </header>
            <div className="flex flex-col lg:flex-row lg:space-x-8">
              <div className="w-full lg:w-1/3 mb-8">
                <div className="flex space-x-2 mb-6">
                  <button
                    onClick={() => { setActiveTab('lists'); setView('main'); }}
                    className={`px-4 py-2 rounded-lg ${
                      activeTab === 'lists'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    Lists
                  </button>
                  {user.role === 'ADMIN' && (
                    <button
                      onClick={() => { setActiveTab('admin'); setView('admin'); }}
                      className={`px-4 py-2 rounded-lg ${
                        activeTab === 'admin'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      Admin
                    </button>
                  )}
                </div>
                {activeTab === 'lists' && (
                  <>
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
                            key={list._id}
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
                  </>
                )}
              </div>
              <div className="w-full lg:w-2/3">
                {activeTab === 'lists' && selectedList ? (
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
                ) : activeTab === 'lists' ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    Select a list to view its tasks.
                  </p>
                ) : (
                  <AdminPanel user={user} />
                )}
              </div>
            </div>
          </>
        )}
        {error && (
          <p className="text-red-500 text-center mt-4">{error}</p>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;