import TaskItem from './TaskItem';

const TaskList = ({ tasks, updateTask, deleteTask, toggleComplete }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          updateTask={updateTask}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
        />
      ))}
    </ul>
  );
};

export default TaskList;