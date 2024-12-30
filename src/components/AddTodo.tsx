'use client';
import clsx from 'clsx'
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
import { callApi } from '@src/api/api';
import { Todo } from '@src/models/Todo';
import { Category } from "@src/models/Category"
import { Button, Field, Input, Label, Select } from '@headlessui/react';

async function createTodo(data: FormData): Promise<void> {
    const todo = data.get('task') as string;
    const dueDate =  data.get('dueDate') as string;

    if (todo.length === 0 || dueDate.length === 0) {
        alert("Please ensure that Task and Due Date are not empty.");
        return;
    }

    const newTodo: Todo = {
        id: uuidv4(),
        category: Category[data.get('category') as keyof typeof Category],
        task: todo,
        completed: false,
        dueAt: dueDate,
        createdAt: new Date().toISOString(),
        modifiedAt: "1990-01-01T00:00:00.000Z"
    }
    await callApi('createTodo', newTodo);
}

export function AddTodo () {
    return (
        <form action={createTodo} className="w-full md:w-3/4 flex flex-col gap-y-5 justify-center items-center mx-auto">
            <Field className="w-full">
                <Label htmlFor="category">Category</Label>
                <Select name="category" aria-label="Category" className={clsx(
              'mt-3 block w-full appearance-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              '*:text-black'
            )}>
                    {Object.keys(Category).map((key) => {
                        return (
                            <option key={key} 
                                value={key}>
                                {Category[key as keyof typeof Category]}
                            </option>
                        );
                    })}
                </Select>
            </Field>
            <Field className="w-full">
                <Label>Task</Label>
                <Input name="task" type="text"
                    className={clsx(
                    'mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
                    'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                )} />
            </Field>
            <Field className="w-full">
                <Label>Due Date</Label>
                <Input name="dueDate" type="date" id="dueDate" className={clsx(
                'mt-3 block w-full rounded-lg border-none bg-white/5 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                )} />
            </Field>
            <div className="flex gap-x-5">
                <Button type="submit" className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                    Add Todo
                </Button>
                <Link href="..">
                    <Button className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                        Cancel
                    </Button>
                </Link> 
            </div>
            
        </form>
    )
}