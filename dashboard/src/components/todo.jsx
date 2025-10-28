import {useEffect, useState} from 'react'
import {useLocalStorage} from 'usehooks-ts'

export default function Todo() {
    const[newTask, setNewTask] = useState("")
    const [dragitem, setDragitem] = useState(null);
    const [tasks, setTasks] = useLocalStorage('my_tasks',[])

    // for text box 
    function Input(event){
        setNewTask(event.target.value)

    }
    function Add(){
        if(newTask.trim()!==""){
            const yPosition = tasks.length * 70 + 200;
            setTasks((tas) => [
                ...tas,
                { text: newTask, x: 100, y: yPosition, id: Date.now() },
      ]);
      setNewTask("");
       setNewTask("")
        }
    }
    function handleMouseDown(e, id) {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const target = tasks.find((t) => t.id === id);
    const offsetX = startX - target.x;
    const offsetY = startY - target.y;

    function handleMouseMove(moveEvent) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                x: moveEvent.clientX - offsetX,
                y: moveEvent.clientY - offsetY,
              }
            : t
        )
      );
    }
     function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }
    function Delete(id){
        const deletetask = tasks.filter((t)=>t.id !== index)
    } 

  return (
    <div className=' relative w-full min-h-screen flex flex-col items-center bg-gray-900 text-white'>
        <h1 className='text-center p-8 font-bold text-5xl'>To do List</h1>
        <div className='text-center m-8 shadow-gray-600'>
            <input className='border rounded-2xl py-4 pr-4 pl-4 text-center w-full mb-3' type="text" placeholder='Enter a task' value={newTask} onChange={Input} />
            <button className='bg-blue-500 hover:bg-blue-600 px-4 py-4 rounded-lg w-full' onClick={Add}>Add</button>
        </div>
            {tasks.map((task)=>(
                <div key={task.id} onMouseDown={(e) => handleMouseDown(e,task.id)} className='absolute border border-gray-700 bg-gray-600 rounded-lg p-3 flex justify-between items-center cursor-move w-[250px]' 
                style={{left: `${task.x}px`, top: `${task.y}px`}}>
                    <span>{task.text}</span>
                    <button className='rounded bg-red-500 hover:bg-red-600 text-white px-3 py-2'
                    onClick={() => Delete(task.id)}>Delete</button>
                </div>
            ))}
    </div>
  )
}