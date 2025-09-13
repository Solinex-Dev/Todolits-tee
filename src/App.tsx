import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon, CheckCircleIcon, ExclamationCircleIcon, } from "@heroicons/react/24/solid";

type Task = { id: number; text: string; done: boolean };

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: input,
      done: false,
    };
    setTasks([...tasks, newTask]);
    setInput("");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const editTask = (id: number, newText: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const deleteTask = (id: number) => {
    const confirmDelete = window.confirm(
      "คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?"
    );
    if (confirmDelete) {
      setTasks(tasks.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center p-8">
      <div className="w-full max-w-xl">
        <h1 className="text-4xl font-bold text-purple-600 text-center mb-2">
          Todo List
        </h1>
        <p className="text-gray-500 text-center mb-6">
          จัดการงานของคุณให้เป็นระบบและมีประสิทธิภาพ
        </p>

        <div className="flex w-full mb-6 bg-white rounded-lg shadow">
          <input
            type="text"
            className="flex-1 px-4 py-3 border-none focus:outline-none rounded-l-lg"
            placeholder="เพิ่มรายการใหม่..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
          />
          <button
            onClick={addTask}
            className="bg-purple-500 text-white px-6 hover:bg-purple-600 transition rounded-r-lg font-medium"
          >
            + เพิ่ม
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === "all"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            ทั้งหมด ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === "pending"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            ยังไม่เสร็จ ({tasks.filter((t) => !t.done).length})
          </button>
          <button
            onClick={() => setFilter("done")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === "done"
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            เสร็จแล้ว ({tasks.filter((t) => t.done).length})
          </button>
        </div>

        <div className="space-y-6 w-full">
          {(filter === "all" || filter === "pending") && (
            <div className="flex flex-col">
              <h2 className="flex items-center mb-3 gap-2">
                <ExclamationCircleIcon className="w-5 h-5 text-red-500" />
                งานที่ยังไม่เสร็จ
              </h2>
              <ul className="space-y-2">
                {tasks
                  .filter((t) => !t.done)
                  .map((task) => (
                    <li
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="flex items-start justify-between bg-white p-3 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-start gap-3 flex-wrap">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center mt-1">
                          {task.done && <span>✔</span>}
                        </span>
                        <span className="break-words">{task.text}</span>
                      </div>
                      <div className="flex gap-3 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newText = prompt("แก้ไขรายการ", task.text);
                            if (newText !== null) editTask(task.id, newText);
                          }}
                        >
                          <PencilIcon className="w-5 h-5 hover:text-yellow-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                        >
                          <TrashIcon className="w-5 h-5 hover:text-red-600" />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {(filter === "all" || filter === "done") && (
            <div className="flex flex-col">
              <h2 className="flex items-center mb-3 gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                งานที่เสร็จแล้ว
              </h2>
              <ul className="space-y-2">
                {tasks
                  .filter((t) => t.done)
                  .map((task) => (
                    <li
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="flex items-start justify-between bg-white p-3 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                    >
                      <div className="flex items-start gap-3 flex-wrap">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full border border-green-500 bg-green-500 flex items-center justify-center text-white text-sm mt-1">
                          ✔
                        </span>
                        <span className="break-words line-through text-gray-400">
                          {task.text}
                        </span>
                      </div>
                      <div className="flex gap-3 mt-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newText = prompt("แก้ไข Task", task.text);
                            if (newText !== null) editTask(task.id, newText);
                          }}
                        >
                          <PencilIcon className="w-5 h-5 hover:text-yellow-600" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                          }}
                        >
                          <TrashIcon className="w-5 h-5 hover:text-red-600" />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
