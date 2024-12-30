import { apiGet } from '@src/api/api';
import { Todo } from '@src/models/Todo';
import { Search } from '@app/ui/search';
import Link from 'next/link';
import Filter  from '@src/components/FilterTodo';
import SortTodo from '@src/components/SortTodo';
import ImportExport from '@src/components/ImportExport';
import TodoList from '@src/components/TodoList';
import Pagination from '@app/ui/pagination';
import ItemsPerPageSelector from '../ui/select';

interface DataGET {
  todos: Todo[],
  totalPageCount: number,
}

export default async function Home({searchParams,}: {searchParams: Promise<{ [key: string]: string | undefined }>}) {
  const params = await searchParams;
  const { query, status, category, _page, _per_page, _sort } = params;
  const currentPage = Number(_page) || 1;
  const perPage = Number(_per_page) || 10;
  const pagination = {page: currentPage, perPage}
  const sort = _sort ?? '';
  
  const data: DataGET = await apiGet(pagination, sort, query, {status, category});
  const { todos, totalPageCount } = data;

  return (
    <>
      <header className="flex justify-center items-center my-4">
        <h1 className="text-2xl font-semibold">Todo List</h1>
      </header>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-x-1">
          <Link className="mr-1 border border-slate-300 text-slate-300 px-3 py-1.5 rounded hover:bg-slate-700 focus-within:bg-slate-700 outline-none" href="/addTodo">New Task</Link>
          <ImportExport todos={todos} />
        </div>
        <Search placeholder="Search tasks..." />
        <div className="flex items-center">
          <Filter />
          <SortTodo curSortBy={sort} curSortOrder={sort ? (sort[0] === '-' ? 'desc' : 'asc') : 'asc'}/>
        </div>
      </div>
      <div className="w-2/3 mx-auto mt-3">
        {query !== null && todos.length === 0 ? (<p className="text-center">Task not found!</p>) : <TodoList todos={todos} />}
      </div>
      <div className="w-2/3 relative mt-5 mx-auto flex justify-center items-center">
        <Pagination totalPages={totalPageCount} currentPage={currentPage} perPage={perPage} />
        <ItemsPerPageSelector taskPerPage={perPage} />
      </div>
    </>
  );
}
