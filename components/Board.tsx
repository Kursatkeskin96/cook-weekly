"use client";
import { Calendar, Column, Id, Task } from "@/types";
import React, { useMemo, useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import ColumnContainer from "./ColumnContainer";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  useSensors,
  useSensor,
  PointerSensor,
  DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import FoodCard from "./FoodCard";

const getCalendarData = async (slug: any) => {
  let domain;
  let protocol = "http://"; // Default protocol for local development

  if (typeof window !== "undefined") {
    const currentURL = window.location.href;
    const urlParts = currentURL.split("/");
    domain = urlParts[2]; // Gets the domain part of the URL
    protocol = urlParts[0]; // Gets the protocol (http: or https:)
  } else {
    domain = "defaultDomainHere";
  }
  const api = `${protocol}//${domain}`;
  const res = await fetch(`${api}/api/calendar/by-username/${slug}`);
  if (!res.ok) {
    throw new Error("Failed to fetch calendar data");
  }
  return res.json();
};

const getMealsData = async (slug) => {
  let domain;
  let protocol = "http://"; // Default protocol for local development

  if (typeof window !== "undefined") {
    const currentURL = window.location.href;
    const urlParts = currentURL.split("/");
    domain = urlParts[2]; // Gets the domain part of the URL
    protocol = urlParts[0]; // Gets the protocol (http: or https:)
  } else {
    domain = "defaultDomainHere";
  }
  const api = `${protocol}//${domain}`;
  const res = await fetch(`${api}/api/recipe/by-username/${slug}`);
  if (!res.ok) {
    throw new Error("Failed to fetch recipe data");
  }

  return res.json();
};

export default function Board({ params, recipes }) {
  
  const { slug } = params;
  const router = useRouter();
  const { data: session } = useSession();
  const username = session?.user?.username;
  const [columns, setColumns] = useState<Column[]>([
    // Initialize with a default column, you might want to customize this
  ]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [portalReady, setPortalReady] = useState(false);

  const [calendar, setCalendar] = useState<Calendar>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [meal, setMeal] = useState([]);


  useEffect(() => {
    // Fetch user data and referredBy count
    getMealsData(slug)
      .then((info) => {
        setMeal(info.meal);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        console.error("Error fetching user data:", error);
      });
  }, [slug]);



  useEffect(() => {
    getCalendarData(slug)
      .then((data) => {
        if (data.calendar && data.calendar.length > 0) {
          setColumns(data.calendar);
          setIsSaved(true); // Set true if data exists
          // Extract and set tasks if necessary
          const allTasks = data.calendar.reduce(
            (acc, column) => [...acc, ...column.tasks],
            []
          );
          setTasks(allTasks);
        } else {
          console.log("No calendar data available");
          setIsSaved(false); // Set false if no data exists
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        setIsSaved(false); // Ensure it's false on error
        console.error("Error fetching calendar data:", error);
      });
  }, [slug]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    })
  );

  const updateCalendar = async () => {
    if (!username) {
      console.error("User is not logged in");
      return;
    }

    const boardData = {
      username: username,
      columns: columns.map((column) => ({
        title: column.title,
        tasks: tasks
          .filter((task) => task.columnId === column.id)
          .map((task) => ({
            content: task.content,
          })),
      })),
    };

    try {
      const response = await fetch(`/api/calendar/by-username/${username}`, {
        method: "PUT", // Using PUT method
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(boardData),
      });

      if (!response.ok) {
        throw new Error("Failed to update the board");
      }

      setIsSaved(true); // You might want to update this based on the response
      toast.success("Calendar updated successfully!");
    } catch (error) {
      console.error("Error updating calendar:", error);
      toast.error("Error updating calendar: ");
    }
  };

  const deleteCalendar = async () => {
    try {
      const response = await fetch(`/api/calendar/by-username/${username}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete the calendar");
      }
      setIsSaved(false);
      router.push("/");
    } catch (error) {
      console.error("Error deleting calendar:", error);
    }
  };

  const saveCalendar = async () => {
    if (!username) {
      console.error("User is not logged in");
      return;
    }

    const boardData = {
      username: username,
      columns: columns.map((column) => ({
        title: column.title,
        tasks: tasks
          .filter((task) => task.columnId === column.id)
          .map((task) => ({
            content: task.content,
          })),
      })),
    };

    try {
      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(boardData),
      });
      if (!response.ok) {
        throw new Error("Failed to save the board");
      }
      setIsSaved(true);
      console.log("Board saved successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="m-auto min-h-screen w-full items-c px-[40px]">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <DndContext
        onDragOver={onDragOver}
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {isSaved ? (
          <div className="display-block flex flex-wrap justify-center items-center">
            <button
              onClick={() => {
                createNewColumn();
              }}
              className="h-[30px] lg:my-10 flex my-3 mx-5 justify-center items-center text-white w-[200px] min-w-[200px] cursor-pointer rounded-lg bg-[#EE8434] shadow-lg  p-4 hover:bg-[#f39044]"
            >
              <CiCirclePlus className="mr-2 text-2xl" />
              Add Day
            </button>
            <button
              onClick={updateCalendar}
              className="h-[30px] lg:my-10 my-3 flex mx-5 justify-center items-center text-white w-[200px] min-w-[200px] cursor-pointer rounded-lg bg-[#1d2a2d] shadow-lg  p-4 hover:bg-[#1d2a2dca]"
            >
              Edit Calendar
            </button>
            <button
              onClick={deleteCalendar}
              className="bg-[#610000] h-[30px] my-3 lg:my-10 flex mx-5 justify-center items-center text-white w-[200px] min-w-[200px] cursor-pointer rounded-lg shadow-lg  p-4 hover:bg-[#610000b5]"
            >
              Delete Calendar
            </button>
          </div>
        ) : (
          <div className="display-block flex justify-center items-center">
            <button
              onClick={() => {
                createNewColumn();
              }}
              className="h-[30px] lg:my-10 my-3 flex mx-5 justify-center items-center text-white w-[200px] min-w-[200px] cursor-pointer rounded-lg bg-[#1d2a2d] shadow-lg  p-4 hover:bg-[#1d2a2dca]"
            >
              <CiCirclePlus className="mr-2 text-2xl" />
              Add Day
            </button>
            <button
              onClick={saveCalendar}
              className="h-[30px] lg:my-10 mx-5 my-3 flex justify-center items-center text-white w-[200px] min-w-[200px] cursor-pointer rounded-lg bg-[#ee8434]  shadow-lg p-4 hover:bg-[#ee8434b8] "
            >
              Save Calendar
            </button>
          </div>
        )}

        <div className="m-auto flex gap-4">
          <div className="m-auto flex gap-4 flex-wrap lg:justify-start justify-start ml-2 items-center">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  recipes={recipes}
                />
              ))}
            </SortableContext>
            <SortableContext items={columnsId}>
              {calendar && (
                <div className="m-auto flex gap-4 flex-wrap justify-center items-center">
                  {calendar && (
                    <div className="m-auto flex gap-4 flex-wrap justify-center items-center">
                      {calendar.map((col) => (
                        <ColumnContainer
                          key={col.id}
                          column={col}
                          deleteColumn={deleteColumn}
                          updateColumn={updateColumn}
                          createTask={createTask}
                          tasks={col.tasks}
                          deleteTask={deleteTask}
                          updateTask={updateTask}
                          recipes={recipes}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </SortableContext>
          </div>
        </div>

        {portalReady &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                  recipes={recipes}
                />
              )}
              {activeTask && (
                <FoodCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  recipes={recipes}
                />
              )}
            </DragOverlay>,
            document.body
          )}
      </DndContext>
  
    </div>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Meal ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Day ${columns.length + 1}`,
      tasks: [],
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}
