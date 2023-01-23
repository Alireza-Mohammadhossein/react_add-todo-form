import React, { useState } from 'react';

import './App.scss';

import usersFromServer from './api/users';
import todosFromServer from './api/todos';

import { User } from './types/User';
import { Todo } from './types/Todo';

import { TodoList } from './components/TodoList';

function getUser(userId: number): User | null {
  const foundUser = usersFromServer.find(user => user.id === userId);

  return foundUser || null;
}

export const todos: Todo[] = todosFromServer.map(todo => ({
  ...todo,
  user: getUser(todo.userId),
}));

export const App = () => {
  const [userId, setUserId] = useState(0);
  const [title, setTitle] = useState('');
  const [currentTodos, setCurrentTodos] = useState(todos);
  const [isUserSelected, setIsUserSelected] = useState(true);
  const [isTitleEntered, setIsTitleEntered] = useState(true);

  const newId = Date.now();

  function addTodo(id: number) {
    if (getUser(id) && title.trim()) {
      const newTodo = {
        id: newId,
        userId,
        title,
        completed: false,
        user: getUser(userId),
      };

      setUserId(0);
      setTitle('');
      setCurrentTodos([...currentTodos, newTodo]);
    }

    if (!userId) {
      setUserId(0);
      setIsUserSelected(false);
    }

    if (!title.trim()) {
      setIsTitleEntered(false);
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addTodo(userId);
  }

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        action="/api/users"
        method="POST"
        onSubmit={handleFormSubmit}
      >
        <div className="field">
          <label htmlFor="titleInput">Title: </label>

          <input
            type="text"
            data-cy="titleInput"
            id="titleInput"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setIsTitleEntered(true);
            }}
            placeholder="Enter a title"
          />

          {!isTitleEntered && (
            <span className="error">Please enter a title</span>
          )}
        </div>

        <div className="field">
          <label htmlFor="userSelect">User: </label>

          <select
            data-cy="userSelect"
            id="userSelect"
            value={userId}
            onChange={(event) => {
              setUserId(+event.target.value);
              setIsUserSelected(true);
            }}
          >
            <option value="0" disabled>Choose a user</option>
            {usersFromServer.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {!isUserSelected && (
            <span className="error">Please choose a user</span>
          )}
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>

      <TodoList todos={currentTodos} />
    </div>
  );
};
