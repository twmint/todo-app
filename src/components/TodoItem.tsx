import { useState } from 'react';
import { Todo } from '@src/models/Todo';
import { Category } from '@src/models/Category';
import { DueStatus } from '@src/utils/helper';
import { Select, Input, Field } from '@headlessui/react';
import { PencilIcon, TrashIcon, ClipboardDocumentCheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TodoItemProps {
    todo: Todo;
    onUpdate: (updatedTodo: Todo) => void;
    onDelete: (id: string) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
    const { id, category, task, completed, dueAt } = todo;
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task);
    const [editedCategory, setEditedCategory] = useState(category);
    const [editedDueAt, setEditedDueAt] = useState(dueAt);

    const lblDueAt = DueStatus(dueAt, completed);

    const handleSaveEdit = () => {
        const updatedTodo = { 
            ...todo, 
            task: editedTask, 
            category: editedCategory, 
            dueAt: editedDueAt,
            modifiedAt: new Date().toISOString()
        };
        onUpdate(updatedTodo);
        setIsEditing(false);
    };

    return (
        <li key={todo.id} className={`flex flex-row ${isEditing ? 'py-3 gap-x-2' : 'py-2 gap-x-4'}`}>
            <div className="flex flex-row flex-1 items-center justify-between">
                {!isEditing ? (
                <>
                    <div className="flex-1">
                        <input
                        id={id}
                        type="checkbox"
                        className="peer cursor-pointer mr-2"
                        defaultChecked={completed}
                        onChange={(e) => onUpdate({ ...todo, completed: e.target.checked })}
                        />
                        <label htmlFor={id} className="cursor-pointer peer-checked:line-through peer-checked:text-slate-500">
                            {task}
                        </label>
                    </div>
                    <div className="mr-3 flex flex-row gap-x-2 w-4/12 justify-center items-center">
                        <div className="flex-1">
                            <label
                                className={`w-11/12 inline-block border border-slate-300 text-center px-3 py-1 text-sm font-semibold rounded-full ${category === 'Work'
                                        ? 'text-blue-700 bg-blue-100'
                                        : category === 'Urgent'
                                            ? 'text-red-700 bg-red-100'
                                            : 'text-green-700 bg-green-100'}`}
                            >
                                {category}
                            </label>
                        </div>
                        <div className="flex-1">
                            <label
                                className={`w-11/12 inline-block text-center px-2 py-1 text-sm font-semibold rounded ${lblDueAt === 'Today' ? 'bg-yellow-100 text-yellow-700'
                                        : lblDueAt === 'Overdue' ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'}`}
                            >
                                {lblDueAt === 'Completed' || lblDueAt === 'Today' || lblDueAt === 'Overdue'? lblDueAt.toUpperCase() : dueAt}
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-row flex-none items-center gap-x-1">
                        <PencilIcon className="h-4 w-4 cursor-pointer" onClick={() => setIsEditing(true)} />
                        <TrashIcon className="h-4 w-4 cursor-pointer" onClick={() => onDelete(id)} />
                    </div>
                </>
                ) 
                : (
                    <div className="w-full flex flex-row items-center justify-between">
                        <div className="flex-1">
                            <Field>
                                <Input
                                    name="task"
                                    type="text"
                                    value={editedTask}
                                    onChange={(e) => setEditedTask(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-600 bg-gray-700 text-white py-1.5 px-3 text-sm/5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </Field>
                        </div>
                        <div className="ml-3 mr-2 flex flex-row gap-x-2 w-4/12 justify-center items-center">
                            <Field className="flex-1">
                                <Select
                                    name="category"
                                    value={editedCategory}
                                    onChange={(e) => setEditedCategory(e.target.value as Category)}
                                    className="w-11/12 inline-block appearance-none rounded-lg border border-gray-600 bg-gray-700 text-white py-1 px-2 text-sm/5 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {Object.keys(Category).map((key) => (
                                        <option key={key} value={key}>
                                            {Category[key as keyof typeof Category]}
                                        </option>
                                    ))}
                                </Select>
                            </Field >
                            <Field className="flex-1">
                                <Input
                                    name="dueDate"
                                    type="date"
                                    value={editedDueAt}
                                    onChange={(e) => setEditedDueAt(e.target.value)}
                                    className="w-11/12 inline-block rounded-lg border border-gray-600 bg-gray-700 text-white text-sm/5 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </Field>
                        </div>
                        <div className="flex flex-row flex-none items-center gap-x-1">
                            <ClipboardDocumentCheckIcon onClick={handleSaveEdit} className="h-4 w-4 cursor-pointer"/>
                            <XMarkIcon onClick={() => setIsEditing(false)} className="h-4 w-4 cursor-pointer"/>
                        </div>
                    </div>
                    )
                }
            </div>
        </li>
    );
}