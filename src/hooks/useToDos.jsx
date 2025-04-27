// src/hooks/useToDos.js
import { useState } from "react";

const useToDos = () => {
  const [toDoList, setToDoList] = useState([]);

  const handleAddToDo = (newToDo) => {
    setToDoList([...toDoList, newToDo]);
  };

  const handleDeleteButton = (indexToDelete) => {
    const newList = toDoList.filter((_, index) => index !== indexToDelete);
    setToDoList(newList);
  };

  return {
    toDoList,
    handleAddToDo,
    handleDeleteButton,
  };
};

export default useToDos;
