'use client';
import {callApi} from '@src/api/api';
import { Todo } from '@src/models/Todo';
import { TodoItem } from '@components/TodoItem';

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
    async function updateTodo(updatedTodo: Todo): Promise<void> {
        await callApi('updateTodo', updatedTodo, window.location.href);
    }
    
    async function deleteTodo(id: string): Promise<void> {
        await callApi('deleteTodo', { id } as Todo, window.location.href);
    }

  return todos.length > 0 ? (
    <ul className="divide-y divide-gray-300">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={(updatedTodo) => updateTodo(updatedTodo)}
          onDelete={() => deleteTodo(todo.id)}
        />
      ))}
    </ul>
  ) : (
    <p className="text-center">No tasks for now... Let's add one for starter!</p>
  );
}
