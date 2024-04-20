"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const steps = [
  { id: "Step 1", name: "Recipe Name" },
  { id: "Step 2", name: "Add Ingredients" },
  { id: "Step 3", name: "Complete" },
];

export default function Form() {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [mealName, setMealName] = useState('');
  const [ingredients, setIngredients] = useState([{ id: Date.now(), name: '', unit: '', amount: '' }]);

  const next = () => {
    if (currentStep === 0 && !mealName.trim()) {
      toast.error("Please enter a meal name.");
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), name: '', unit: 'g', amount: '' }]);
  };

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    const newIngredients = ingredients.map(ingredient => {
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
    const filteredIngredients = ingredients.filter(ingredient => 
      ingredient.name.trim() && ingredient.unit.trim() && ingredient.amount.trim()
    );

    const payload = {
      mealName,
      ingredients: filteredIngredients,
      userName: session?.user?.name  // Assuming username is stored under user object
    };

    const response = await fetch('/api/recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      toast.success('Meal created successfully!');
      setMealName('');
      setIngredients([{ id: Date.now(), name: '', unit: '', amount: '' }]);
      setCurrentStep(0); // Reset the form
    } else {
      toast.error('Failed to create meal.');
    }
  };

  return (
    <section className="max-w-[80%] mx-auto mt-10">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.id} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-[#610000] py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-[#610000]">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div className="flex w-full flex-col border-l-4 border-[#610000] py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4" aria-current="step">
                  <span className="text-sm font-medium text-[#610000]">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-sm font-medium text-gray-500">{step.id}</span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <form onSubmit={handleSubmit} className="mt-12 py-12">
        {currentStep === 0 && (
          <>
            <h3 className="text-2xl">Meal Name</h3>
            <p className="text-gray-400">Please enter name of your meal.</p>
            <div className="mt-10">
              <label className="text-sm" htmlFor="mealname">Meal Name</label>
              <input type="text" id="mealname" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#610000] focus:border-[#610000] focus:outline-none block w-[40%] p-2.5" placeholder="Chicken Wing" required onChange={handleMealName} value={mealName} />
            </div>
          </>
        )}
        {/* Include other steps and their forms similar to Step 1 */}
      </form>
      {/* Navigation buttons */}
      <div className="mt-8 pt-5 mb-5 flex justify-between items-center">
        <button className={`w-28 py-1 rounded-sm ${currentStep === 0 ? 'bg-gray-500 text-white' : 'bg-[#D34C26] text-white'}`} onClick={prev} disabled={currentStep === 0}>Prev</button>
        <button className={`w-28 py-1 rounded-sm ${currentStep === steps.length - 1 ? 'bg-gray-500' : 'bg-[#D34C26] text-white'}`} onClick={next} disabled={currentStep === steps.length - 1}>Next</button>
      </div>
    </section>
  );
}
