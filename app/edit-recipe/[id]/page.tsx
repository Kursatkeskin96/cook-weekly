"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.min.css';

const steps = [
  { id: "Step 1", name: "Recipe Name" },
  { id: "Step 2", name: "Add Ingredients" },
  { id: "Step 3", name: "Complete" },
];

// Asynchronous function to get user data
const getData = async (id: any) => {
    let domain;
    let protocol = 'http://'; // Default protocol for local development
    
    if (typeof window !== 'undefined') {
      const currentURL = window.location.href;
      const urlParts = currentURL.split("/");
      domain = urlParts[2]; // Gets the domain part of the URL
      protocol = urlParts[0]; // Gets the protocol (http: or https:)
    } else {
      domain = 'defaultDomainHere'; 

    }
    const api = `${protocol}//${domain}`; 
    const res = await fetch(`${api}/api/recipe/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch recipe data");
    }
  
    return res.json();
  };
  

export default function EditRecipe({params}) {
  const { data: session } = useSession();
  const router = useRouter()
  const {id} = params
  const [currentStep, setCurrentStep] = useState(0);
  const [recipe, setRecipe] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mealName, setMealName] = useState(""); // State for meal name
  const [ingredients, setIngredients] = useState([
    { id: Date.now(), name: "", unit: "", amount: "" },
  ]);
  useEffect(() => {
    getData(id)
      .then(data => {
        setMealName(data.meal.name);
        setIngredients(data.meal.ingredients.length > 0 ? data.meal.ingredients : [{ id: Date.now(), name: "", unit: "", amount: "" }]);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
        console.error("Error fetching meal data:", error);
      });
  }, [id]);
  
  const next = () => {
    if (currentStep === 0) {
      if (!mealName.trim()) {
        toast.error("Please enter a meal name.");
        return;
      }
    }
  
    if (currentStep < steps.length - 1) {
      setCurrentStep(step => step + 1);
    }
  };
  

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now(), name: "", unit: "g", amount: "" },
    ]);
  };

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    const newIngredients = ingredients.map((ingredient) => {
      if (ingredient.id === id) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  const handleMealName = (e) => {
    setMealName(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Filter out empty or incomplete ingredients
    const filteredIngredients = ingredients.filter(
      (ingredient) =>
        ingredient.name.trim() &&
        ingredient.unit.trim() &&
        ingredient.amount.trim()
    );

    const payload = {
      mealName,
      ingredients: filteredIngredients,
      userName: session?.user?.username,
    };

    const response = await fetch(`/api/recipe/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      toast.success("Meal has been changed!");
      setCurrentStep(0);
      setMealName("");
      setIngredients([{ id: Date.now(), name: "", unit: "", amount: "" }]);
      router.push(`/my-kitchen/${session?.user?.username}`)
    } else {
      toast.error("Failed to create meal.");
    }
  };

  return (
    <section className="max-w-[80%] mx-auto mt-10">
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
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-[#610000] py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-[#610000] transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-[#610000] py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-[#610000]">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <form className="py-12">
        {currentStep === 0 && (
          <>
            <h3 className="text-2xl">Meal Name</h3>
            <p className="text-gray-400 mb-10">Please enter name of your meal.</p>
            <div className="">
              <label className="text-sm" htmlFor="mealname">
                Meal Name
              </label>
              <input
                type="text"
                id="mealname"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#610000] focus:border-[#610000] focus:outline-none block w-[40%] p-2.5"
                placeholder="Chicken Wing"
                required
                onChange={handleMealName} // Use the function here
                value={mealName} // Bind the input value to the state
              />
            </div>
          </>
        )}
        {currentStep === 1 && (
          <>
            <h3 className="text-2xl">Add Ingredients</h3>
            <p className="text-gray-400 mb-10">
              You can either enter ingridients of your meal or proceed to the
              next step.
            </p>
            {ingredients.map((ingredient, index) => (
              <div
                key={ingredient.id}
                className="flex mb-4 justify-between items-center"
              >
                <div className="flex gap-20 items-center">
                  <div>
                    <label
                      className="text-sm"
                      htmlFor={`ingredient-name-${index}`}
                    >
                      Ingredient
                    </label>
                    <input
                      type="text"
                      id={`ingredient-name-${index}`}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#610000] focus:border-[#610000] focus:outline-none block w-full p-2.5"
                      placeholder="Chicken Wing"
                      value={ingredient.name}
                      onChange={(e) =>
                        handleInputChange(ingredient.id, "name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="flex justify-center items-center gap-10">
                    <div>
                      <label
                        htmlFor={`measurement-unit-${index}`}
                        className="text-sm"
                      >
                        Measurement
                      </label>
                      <select
                        id={`measurement-unit-${index}`}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#610000] focus:border-[#610000] focus:outline-none block w-full p-2.5"
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleInputChange(
                            ingredient.id,
                            "unit",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Choose</option>
                        <option value="g">g</option>
                        <option value="ml">ml</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                        <option value="unit">Unit</option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="text-sm"
                        htmlFor={`ingredient-amount-${index}`}
                      >
                        Amount
                      </label>
                      <input
                        type="text"
                        id={`ingredient-amount-${index}`}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#610000] focus:border-[#610000] focus:outline-none block w-full p-2.5"
                        placeholder="100"
                        value={ingredient.amount}
                        onChange={(e) =>
                          handleInputChange(
                            ingredient.id,
                            "amount",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="">
                    {" "}
                    <button
                      type="button"
                      onClick={() => deleteIngredient(ingredient.id)}
                      className="p-2 mt-5 bg-[#bb2124] text-white rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="mt-4 w-10 h-10 text-lg font-bold rounded-[50%] bg-[#610000] text-white "
            >
              +
            </button>
          </>
        )}
        {currentStep === 2 && (
          <>
              <h3 className="text-2xl">Almost Done!</h3>
            <p className="text-gray-400 mb-10">Please click on submit button to save your ingredient.</p>
            <button
              className="bg-[#610000] hover:bg-[#610000d0] mb-20 text-white w-40 rounded-[16px] py-1"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </>
        )}
      </form>
      {/* Navigation */}
      <div className="mt-8 pt-5 mb-5 flex justify-between items-center">
        <button
          className={`w-28 py-1 rounded-sm ${
            currentStep === 0
              ? "bg-gray-500 text-white"
              : "bg-[#D34C26] text-white"
          }`}
          onClick={prev}
          disabled={currentStep === 0}
        >
          Prev
        </button>
        <button
          className={`w-28 py-1 rounded-sm ${
            currentStep === steps.length - 1
              ? "bg-gray-500"
              : "bg-[#D34C26] text-white"
          }`}
          onClick={next}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </button>
      </div>
    </section>
  );
}
