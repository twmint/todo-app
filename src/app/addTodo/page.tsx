import { AddTodo } from "@components/AddTodo";

export default function Page() {
    return (
        <>
            <header className="flex justify-center items-center mb-4">
                <h1 className="text-2xl">New Task</h1>
            </header>
            <AddTodo />
        </>
    );
}