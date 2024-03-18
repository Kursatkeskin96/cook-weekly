'use client'
import { Column, Id, Recipe, Task } from "@/tyoes";
import React, { useMemo, useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CiCirclePlus } from "react-icons/ci";
import FoodCard from "./FoodCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  tasks: Task[];
  updateTask: (id: Id, content: string) => void
  deleteTask: (id: Id) => void;
  recipes: Recipe[];
}


function ColumnContainer( props: Props) {
 
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
    recipes,
  } = props;

  const [editMode, setEditMode] = useState(false);

  const taskIds = useMemo(() => {
    return tasks.map(task => task.id)
  }, [tasks])

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };


  if (isDragging) {
    return (
      <div
        className="opacity-40 border-2 border-[#D34C26] bg-neutral-600 h-96 w-72 rounded-md flex flex-col"
        ref={setNodeRef}
        style={style}
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="h-96 w-72 bg-[#1D2A2D] rounded-md flex flex-col"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className=" bg-[#2a3d41] p-3 font-bold border-4 flex items-center justify-between border-[#1D2A2D] text-white cursor-grab rounded-md rounded-b-none"
      >
        <div className="flex gap-2 items-center">

          {!editMode && column.title}
          {editMode && (
            <input
              className="bg-black text-white focus:border-[#EE8434] border px-2 rounded outline-none"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter" && e.shiftKey) return setEditMode(false);
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="pl-4"
        >
          <MdDelete className="items-center text-xl text-red-600" />
        </button>
      </div>

      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskIds}>
        {tasks.map((task) => (
          <FoodCard recipes={recipes} key={task.id} deleteTask={deleteTask} updateTask={updateTask} task={task} />
        ))}
        </SortableContext>
      </div>
      <div>
        <button
          className="flex gap-2 items-center p-4 text-white "
          onClick={() => {
            createTask(column.id);
          }}
        >
          <CiCirclePlus className="text-[#F7761F] font-bold text-xl" /> Add Meal
        </button>
      </div>
    </div>
  );
}

export default ColumnContainer;
