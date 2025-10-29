import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function Todo() {
  const [newTask, setNewTask] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [tasks, setTasks] = useLocalStorage("my_tasks", []);

  const CARD_HEIGHT = 80;
  const CARD_WIDTH = 250;
  const START_X = 830; // fixed X so all tasks appear in one column
  const START_Y = 320; // start below the Add button

  function Input(event) {
    setNewTask(event.target.value);
  }

  // Add new task below others (never overlapping)
  function Add() {
    if (newTask.trim() !== "") {
      let yPosition = START_Y;

      // find first free vertical spot
      while (
        tasks.some(
          (t) =>
            Math.abs(t.x - START_X) < CARD_WIDTH &&
            Math.abs(t.y - yPosition) < CARD_HEIGHT
        )
      ) {
        yPosition += CARD_HEIGHT + 10;
      }

      setTasks((tas) => [
        ...tas,
        { text: newTask, x: START_X, y: yPosition, id: Date.now() },
      ]);
      setNewTask("");
    }
  }

  // Drag and make sure it never overlaps
  function handleMouseDown(e, id) {
    e.preventDefault();
    setActiveId(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const target = tasks.find((t) => t.id === id);
    const offsetX = startX - target.x;
    const offsetY = startY - target.y;

    function handleMouseMove(moveEvent) {
      const newX = moveEvent.clientX - offsetX;
      const newY = moveEvent.clientY - offsetY;

      setTasks((prev) => {
        const updated = prev.map((t) =>
          t.id === id ? { ...t, x: newX, y: newY } : t
        );

        // make sure no overlap
        let movedTask = updated.find((t) => t.id === id);
        let overlap = true;

        while (overlap) {
          overlap = false;

          for (const other of updated) {
            if (other.id === id) continue;

            const isOverlapping =
              Math.abs(movedTask.x - other.x) < CARD_WIDTH &&
              Math.abs(movedTask.y - other.y) < CARD_HEIGHT;

            if (isOverlapping) {
              movedTask = { ...movedTask, y: movedTask.y + CARD_HEIGHT + 10 };
              overlap = true;
              break;
            }
          }
        }

        return updated.map((t) => (t.id === id ? movedTask : t));
      });
    }

    function handleMouseUp() {
      setActiveId(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  function Delete(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  return (
    <div className="relative w-full overflow-hidden min-h-screen flex flex-col items-center bg-gray-900 text-white">
      <h1 className="text-center p-8 font-bold text-5xl">To do List</h1>

      {/* input + button */}
      <div className="text-center m-8 shadow-gray-600 w-[250px]">
        <input
          className="border rounded-2xl py-4 pr-4 pl-4 text-center w-full mb-3 text-white"
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={Input}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 px-4 py-4 rounded-lg w-full"
          onClick={Add}
        >
          Add
        </button>
      </div>

      {/* draggable tasks */}
      {tasks.map((task) => (
        <div
          key={task.id}
          onMouseDown={(e) => handleMouseDown(e, task.id)}
          className="absolute border border-gray-700 bg-gray-600 rounded-lg p-3 flex justify-between items-center cursor-move w-[250px]"
          style={{
            left: `${task.x}px`,
            top: `${task.y}px`,
            zIndex: task.id === activeId ? 9999 : 1,
            transition: "top 0.15s linear",
          }}
        >
          <span>{task.text}</span>
          <button
            className="rounded bg-red-500 hover:bg-red-600 text-white px-3 py-2"
            onClick={() => Delete(task.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
