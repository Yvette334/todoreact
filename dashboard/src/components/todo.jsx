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
       setTasks(tas =>[...tas,newTask])
       setNewTask("")
        }
    }
    function Delete(index){
        const deletetask = tasks.filter((_,indexdelete)=>indexdelete !== index)
        setTasks(deletetask)
    } 
    function onDragStart(e, index) {
        setDragitem(index);
    }
    function dropItem(index) {
    if (dragitem === null)
        return;
    const newList = [...tasks];
    const temp = newList[index];
    newList[index] = newList[dragitem];
    newList[dragitem] = temp;

    setTasks(newList);
    setDragitem(null);
  }

  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-gray-900 text-white'>
        <div className='border rounded-2xl bg-gray-800 w-full max-w-md mx-auto my-8'>
        <h1 className='text-center p-8 font-bold text-5xl'>To do List</h1>
        <div className='text-center m-8 shadow-gray-600'>
            <input className='border rounded-2xl py-4 pr-4 pl-4 text-center w-full mb-3' type="text" placeholder='Enter a task' value={newTask} onChange={Input} />
            <button className='bg-blue-500 hover:bg-blue-600 px-4 py-4 rounded-lg w-full' onClick={Add}>Add</button>
        </div>
        <div className=' h-auto px-4 pb-4'>
        <ul className='w-full max-w-md space-y-3'>
            {tasks.map((task,index)=>
                <li key={index} className='border border-gray-700 bg-gray-600 rounded-lg p-3 flex justify-between items-center'draggable onDragStart={(e)=> onDragStart(e, index)} onDrop={()=>dropItem (index)} onDragOver={(e)=> e.preventDefault()}>
                <span>{task}</span>
                <button className='rounded bg-red-500 hover:bg-red-600 text-white px-3 py-2' onClick={() =>Delete(index)}>Delete</button>
            </li>
            )}
        </ul>
        </div>
        </div>
    </div>
  )
}