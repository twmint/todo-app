'use server';
import { Todo } from "@src/models/Todo";
import { redirect } from 'next/navigation';

async function apiGet(pagination: {page: number, perPage: number}, sort?: string, query?: string, filter?: {status?: string, category?: string | string[]}) {
  const { status, category } = filter || {};

  let additionalParams = '';
  let data;
  let response;
  let tasks: Todo[];
  let customTotalPages;

  const { page, perPage } = pagination;
  if (!query && !status && !category) {
    additionalParams = `?_page=${page}&_per_page=${perPage}`;
  }

  if (sort) {
    additionalParams += `${additionalParams[0] === '?' ? '&' : '?'}_sort=${sort.replace('dueDate', 'dueAt')}`
  }

  try {
    response = await fetch(`http://localhost:3001/tasks${additionalParams}`, {
      method: 'GET'
    });
  } catch (error: any) {
    console.log(error.message);
  }
  
  if (response && response.ok) {
    data = await response.json();

    if (Array.isArray(data)) {
      tasks = data;
    } else {
      tasks = data.data;
    }

    if (query) {
      tasks = tasks.filter((todo: Todo) => todo.task.toLowerCase().includes(query!.toLowerCase()));
    }

    if (status) {
      tasks = tasks.filter((todo: Todo) => status === 'Complete' ? todo.completed : !todo.completed);
    }

    if (category) {
      tasks = tasks.filter((todo: Todo) => category.includes(todo.category));
    }

    if (query || status || category) {
      //custom pagination for custom filtering
      customTotalPages = Math.ceil(tasks.length / perPage);
      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage;
      tasks = tasks.slice(startIndex, endIndex);
    }
  } else {
    tasks = [];
  }
  return {todos: tasks, totalPageCount: (query || status || category) ? customTotalPages :  data.pages};
}

async function callApi(action: string, body: Todo | Todo[] | null, currentUrl?: string): Promise<void> {
  let method: string = '';
  let appendUrl: string = '';
  const taskId = (body as Todo).id;
  
  switch (action) {
    case 'createTodo':
      method = 'POST';
      break;
    case 'updateTodo':
      method = 'PUT';
      appendUrl = `/${taskId}`;
      break;
    case 'deleteTodo':
      method = 'DELETE';
      appendUrl = `/${taskId}`;
      break;
  }

  let msg;
  let response;
  
  try {
    if (Array.isArray(body)) {
      // loop over each task instead of passing an array of tasks 
      // due to undesired JSON server's array handling on POST
      for (const task of body) { 
        response = await fetch('http://localhost:3001/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task)
        });
      }
    } else {
      response = await fetch('http://localhost:3001/tasks' + appendUrl, {
        method: method!,
        ...(method === 'POST' || method === 'PUT' ? 
          { headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify(body) } 
          : {})
      });
      msg = response.status + ': ' + response.statusText;
    }
  } catch (error) {
    msg = `Error calling API on ${action}: ${error}`;
  }
  
  if (response && response.ok) {
    redirect(currentUrl ? currentUrl : '/tasks');
  } else {
    console.log(msg);
  }
}

export { apiGet, callApi };