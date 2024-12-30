'use client';
import * as XLSX from "xlsx";
import * as Papa from 'papaparse';
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Todo } from "@src/models/Todo";
import { Category } from "@src/models/Category";
import { callApi } from "@src/api/api";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

interface ExportProps {
  todos: Todo[];
  title?: string;
}

interface ExcelTodo {
  ID: string;
  Category: Category.Personal | Category.Work | Category.Urgent;
  Task: string;
  DueDate: string;
  Status: string;
  CreatedAt?: string;
  ModifiedAt?: string;
}

function excelDataCheck(excelData: ExcelTodo[]): Todo[] {
  return excelData.map((item) => ({
    id: item.ID || uuidv4(),
    category: item.Category,
    task: item.Task,
    completed: item.Status.toLowerCase() === "complete",
    dueAt: item.DueDate || new Date().toISOString().split('T')[0],
    createdAt: item.CreatedAt || new Date().toISOString(),
    modifiedAt: item.ModifiedAt || "1990-01-01T00:00:00.000Z",
  }));
}

export default function ImportExport({ todos, title }: ExportProps) {
  const [loading, setLoading] = useState(false);

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    
    if (!file) return;

    const ext = /^.+\.([^.]+)$/.exec(file.name);
    
    if (!ext || ext[1] !== "xlsx" && ext[1] !== "xls" && ext[1] !== "csv") {
      alert("Please upload a valid Excel or CSV file.");
      return;
    }
    
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = async (e) => {
      try {
        const buffer = e?.target?.result;
        let data;

        if (ext[1] === 'xlsx' || ext[1] === 'xls') {
            const workbook = XLSX.read(buffer, { type: "buffer" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const importedData: ExcelTodo[] = XLSX.utils.sheet_to_json(worksheet);
            data = excelDataCheck(importedData);
        }
        
        if (ext[1] === 'csv') {
          const headers = ['id', 'category', 'task', 'completed', 'dueAt'];
          const text = new TextDecoder().decode(buffer as ArrayBuffer);
          const csvData = Papa.parse(text, { 
            header: true, 
            skipEmptyLines: true,
            delimiter: '',
          });
          const csvHeaders = csvData.meta.fields || [];
          const missingCols = headers.filter(header => !csvHeaders.includes(header));
          if (missingCols.length > 0) {
            alert(`The following required columns are missing: ${missingCols.join(', ')}. Please update your CSV file.`);
            return;
          }

          data = csvData.data as Todo[];
          
          let wrongCategory: boolean = false;
          const todoMissingVal: string[] = [];
          
          data.forEach((todo: Todo) => {
            const todoValues = Object.values(todo);
            for (const value of todoValues) { 
              if (!value) {
                todoMissingVal.push(todo.id);
                break;
              }
            }

            if (!Object.values(Category).includes(todo.category)) {
              wrongCategory = true;
            }
          });

          if (todoMissingVal.length > 0) {
            alert(`Items with the following ID(s) are missing some values: ${todoMissingVal.join(', ')}. Please update your CSV file.`);
            return;
          }

          if (wrongCategory) {
            alert(`Invalid category found. Please update your CSV file.`);
            return;
          }
          
          data = data.map((todo: Todo) => ({
            ...todo,
            completed: (todo.completed as unknown as string) === 'true',
            createdAt: new Date().toISOString(),
            modifiedAt: "1990-01-01T00:00:00.000Z"
          }))
        }

        await callApi('createTodo', data as Todo[]);
      } catch (error) {
        alert("An error occurred while importing the file. Please ensure that the file is a valid Excel or CSV file.");
        console.error(error);
      };
    };
  };
  
  const exportTodo = async () => {
    try {
      setLoading(true);
      const workbook = XLSX.utils.book_new();
      const headerRow = ["ID", "Category", "Task", "DueDate", "Status"];
      const data = [headerRow, ...todos.map(todo => [todo.id, todo.category, todo.task, todo.dueAt, todo.completed ? "Complete" : "Incomplete"])];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, "Todos");
      XLSX.writeFile(workbook, `${title ?? "myTodos"}.xlsx`);
    } catch (error) {
      console.error("Error exporting todos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <MenuButton className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md  hover:bg-blue-600">
          Transfer
        </MenuButton>
        <MenuItems className="absolute mt-2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
          <MenuItem>
            <span>
              <button
                className="w-full h-10 overflow-hidden px-4 py-2 rounded-md text-center text-gray-700 font-semibold hover:bg-blue-500 hover:text-white"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                Import
              </button>
            </span>
          </MenuItem>
          <MenuItem>
          <button
            onClick={exportTodo}
            disabled={loading}
            className={`w-full h-10 overflow-hidden px-4 py-2 rounded-md text-center text-gray-700 font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-500 hover:text-white"
            }`}
          >
            <span className="relative">{loading ? "Loading..." : "Export"}</span>
          </button>
          </MenuItem>
        </MenuItems>
      </Menu>
      <input id="file-input" type="file" accept=".xlsx, .xls, .csv" 
        onClick={() => {
          const fileInput = document.getElementById("file-input") as HTMLInputElement;
          fileInput.value = '';
        }}
        onChange={handleFileUpload} className="hidden" />
    </>
    );
}
