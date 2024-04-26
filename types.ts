export type Id = string | number

export type Column = {
    id: Id;
    title: string;
    tasks: Task[]
}

export type Task = {
    id: Id;
    columnId: Id;
    content: string;
    ingredients?: Ingredient[]
}

export type Recipe = {
    id: Id;
    name: string;
}

export interface Meal {
    id: Id;
    name: string;
    ingredients: Ingredient[];
  }

 export interface Ingredient {
    id:     Id;
    name:   String;
    unit :  String
    amount :String
    mealId: Id;
    meal:   Meal
  }
  
export type Calendar = Column[];