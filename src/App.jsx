import { useState, useEffect } from 'react';
import ListItem from './components/ListItem';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const App = () => {
  const [lists, setLists] = useState(() => {
    const savedLists = localStorage.getItem('lists');
    return savedLists ? JSON.parse(savedLists) : [];
  });
  const [selectedListId, setSelectedListId] = useState(null);

  useEffect(() => {
    localStorage.setItem('lists', JSON.stringify(lists));
  }, [lists]);

  const addList = (name) => {
    setLists([...lists, { id: Date.now(), name, tasks: [] }]);
  };

  const updateList = (id, newName) => {
    setLists(
      lists.map((list) =>
        list.id === id ? { ...list, name: newName } : list
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

  const addTask = (title) => {
    setLists(
      lists.map((list) =>
        list.id === selectedListId
        ? {
          ...list,
          tasks: [...list.tasks, { id: Date.now(), title, completed: false }],
          }
        : list
      )
    );
  };

  const updateTask = (taskId, newTitle) => {
    setLists(
      lists.map((list) =>
        list.id === selectedListId
        ? {
          ...list,
          tasks: list.tasks.map((task) =>
          task.id === taskId ? { ...task, title: newTitle } : task
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">TaskTrackr</h1>
      <div className="flex flex-col lg:flex-row lg:space-x-8">
      <div className="w-full lg:w-1/3 mb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.listName.value;
            if (name.trim()) {
              addList(name);
              e.target.reset();
            }
          }}
          className="mb-6">
          <input
            type="text"
            name="listName"
            placeholder="New List"
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
        <ul className="space-y-3">
          {lists.map((list) => (
            <ListItem
              key={list.id}
              list={list}
              updateList={updateList}
              deleteList={deleteList}
              selectList={selectList}
            />
          ))}
        </ul>
      </div>
        <div className="w-full lg:w-2/3">
          {selectedList ? (
            <div>
              <h2 className="text-2xl font-semibold mb-6">{selectedList.name}</h2>
              <TaskForm addTask={addTask} />
              <TaskList
                tasks={selectedList.tasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
                toggleComplete={toggleComplete}
              />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
            Select a list to view its tasks.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;