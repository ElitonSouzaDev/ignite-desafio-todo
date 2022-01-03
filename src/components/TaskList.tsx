import { useEffect, useState } from 'react'

import '../styles/tasklist.scss'

import { FiTrash, FiCheckSquare } from 'react-icons/fi'

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
  data: string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');

  function handleCreateNewTask() {
    if (newTaskTitle !== '') {
      const newTask: Task = {
        id: new Date().getTime(),
        title: newTaskTitle,
        isComplete: false,
        data: newTaskDate
      }

      const updatedTasks = [...tasks, newTask];
      localStorage.setItem('@minhasMetas', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      setNewTaskTitle('');
    }
  }

  function handleToggleTaskCompletion(id: number) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, isComplete: task.isComplete ? false : true }
      }
      return task;
    });
    localStorage.setItem('@minhasMetas', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  }

  function handleRemoveTask(id: number) {
    const updatedTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('@minhasMetas', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  }

  useEffect(() => {
    const dataAtual = new Date();
    setNewTaskDate(dataAtual.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const myTasks = localStorage.getItem('@minhasMetas');
    if (myTasks) {
      setTasks(JSON.parse(myTasks));
    }
  }, []);

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas metas</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar nova meta"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <input
            type="date"
            placeholder="Data"
            onChange={(e) => setNewTaskDate(e.target.value)}
            value={newTaskDate}
          />
          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
                <p style={{ marginLeft: 'auto', paddingRight: '20px' }}>{new Intl.DateTimeFormat('pt-BR').format(new Date(task.data + ' 00:00:00'))}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16} />
              </button>
            </li>
          ))}

        </ul>
      </main>
    </section>
  )
}