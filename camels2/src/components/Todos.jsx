import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const fetchData = useFetch;
  const { id } = useParams();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await fetchData(
          `http://localhost:3000/todos?userId=${id}`
        );
        setTodos(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTodos();
  }, []);

  const todosDisplay = todos.map((todo) => {
    console.log("todo: ", todo.completed); //completed not printing
    return (
      <div key={todo.id}>
        <h4>completed: {JSON.stringify(todo.completed)}</h4>
        <h4>userId: {todo.userId}</h4>
        <h4>id: {todo.id}</h4>
        <h4>title: {todo.title}</h4>
      </div>
    );
  });
  return (
    <section>
      <h2>Your todos</h2>
      <div>
        {todos.length > 0 ? (
          <section>{todosDisplay}</section>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </section>
  );
};

export default Todos;
