import { Category } from "./Category";

export interface Todo {
    id: string;
    category: Category;
    task: string;
    completed: boolean;
    dueAt: string;
    createdAt: string;
    modifiedAt:string;
}