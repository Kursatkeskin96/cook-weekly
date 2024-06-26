import { Id, Recipe, Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { MdDelete } from "react-icons/md";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  recipes: Recipe[];
}

function FoodCard({ recipes, task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecipes = searchTerm.length === 0
  ? recipes
  : recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleRecipeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedId = e.target.value;
    setSelectedRecipeId(selectedId);

    // Find the selected recipe and update the task's content with the recipe's name
    const selectedRecipe = recipes.find(recipe => recipe.id.toString() === selectedId);
    if (selectedRecipe) {
      updateTask(task.id, selectedRecipe.name);
    }

    setEditMode(false); // Close the edit mode
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="bg-neutral-600 relative p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-[#EE8434] cursor-grab opacity-30" />;
  }

  if (editMode) {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-[#2A3D41] text-white py-2 relative flex flex-col justify-start text-start items-start gap-2 rounded-xl hover:ring-2 hover:ring-inset hover:ring-[#EE8434]">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search for a meal..."
          className="p-1 mb-2 w-[80%] mx-auto rounded"
        />
        <div className="overflow-y-auto max-h-20 w-[97%] pl-3 custom-scrollbar">
          {filteredRecipes.map(recipe => (
            <label key={recipe.id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                className="mr-3 my-2 "
                name="recipe"
                value={recipe.id}
                onChange={handleRecipeSelect}
              />
              {recipe.name}
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      onClick={() => setEditMode(true)}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className="bg-[#2A3D41] text-white relative p-2.5 h-[50px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-[#EE8434] cursor-grab"
    >
      <p className="my-auto text-white h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2"
        >
          <MdDelete className="text-lg text-red-600" />
        </button>
      )}
    </div>
  );
}

export default FoodCard; 