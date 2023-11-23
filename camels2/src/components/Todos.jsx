import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [serchParams, setSearchParams] = useState("");
  const [filterOn, setFilterOn] = useState("");
  const [filteredValue, setFilteredValue] = useState("");
  const fetchData = useFetch;
  const { id } = useParams();
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setError(false);
        setIsLoading(true);
        const data = await fetchData(
          `http://localhost:3000/todos?userId=${id}${serchParams}`
        );
        if (!(data.length > 0)) throw new Error("not found");
        setTodos(data);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, [fetchData, id, serchParams]);

  async function deleteToDo(currtodoId) {
    await fetchData(`http://localhost:3000/todos/${currtodoId}`, {
      method: "DELETE",
    });
    setTodos((prevtodos) => {
      return prevtodos.filter((todo) => todo.id !== currtodoId);
    });
  }

  async function addToDo() {
    const newToDoObj = getAddToDoContent();
    const responseToDo = await sendRequestToDb(
      "POST",
      `http://localhost:3000/todos/`,
      newToDoObj
    );

    setTodos((prevToDos) => [...prevToDos, responseToDo]);
  }

  async function changeToDo(todoId) {
    const newtodoObj = getAddToDoContent();
    const responseToDo = await sendRequestToDb(
      "PUT",
      `http://localhost:3000/todos/${todoId}`,
      newtodoObj
    );

    setTodos((prevtodos) => {
      let newToDos = [...prevtodos];
      const toDoIndex = prevtodos.findIndex(
        (todo) => todo.id === responseToDo.id
      );
      newToDos[toDoIndex] = responseToDo;
      return newToDos;
    });
  }

  async function sendRequestToDb(requestType, url, body) {
    const response = await fetchData(url, {
      method: requestType,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response;
  }

  function getAddToDoContent() {
    const ToDoTitle = prompt("please enter your todo title");
    const newToDo = {
      title: ToDoTitle,
      userId: id,
    };
    return newToDo;
  }

  function updateTodosDb(e, id) {
    const currValue = e.target.checked;
    sendRequestToDb("PATCH", `http://localhost:3000/todos/${id}`, {
      completed: currValue,
    });
  }

  function sortById() {
    setTodos((prev) => {
      return [...prev].sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        } else {
          return 0;
        }
      });
    });
  }

  function sortByCompleted() {
    setTodos((prev) => {
      return [...prev].sort((a, b) => {
        if (a.completed && !b.completed) {
          return -1;
        } else if (!a.completed && b.completed) {
          return 1;
        } else {
          return 0;
        }
      });
    });
  }

  function sortByAlpha() {
    setTodos((prev) => {
      return [...prev].sort((a, b) => {
        if (
          alphabet.indexOf(a.title[0].toLowerCase()) <
          alphabet.indexOf(b.title[0].toLowerCase())
        ) {
          return -1;
        } else if (
          alphabet.indexOf(a.title[0].toLowerCase()) >
          alphabet.indexOf(b.title[0].toLowerCase())
        ) {
          return 1;
        } else {
          return 0;
        }
      });
    });
  }

  function sortByRandom() {
    const randomArr = todos.map(() => Math.floor(Math.random() * todos.length));
    setTodos((prev) => {
      return [...prev].sort((a, b) => {
        if (randomArr[prev.indexOf(a)] < randomArr[prev.indexOf(b)]) {
          return -1;
        } else if (randomArr[prev.indexOf(a)] > randomArr[prev.indexOf(b)]) {
          return 1;
        } else {
          return 0;
        }
      });
    });
  }

  function openFilterInput(type) {
    setFilteredValue("");
    setFilterOn(type);
  }

  function handleSearchParams() {
    if (filterOn === "completed") {
      if (filteredValue !== "false" && filteredValue !== "true") {
        setFilteredValue("");
        setSearchParams("");
        return;
      }
    }
    setSearchParams(`&${filterOn}=${filteredValue}`);
  }

  const todosDisplay = todos.map((todo) => (
    <div key={todo.id}>
      <button
        onClick={async () => {
          await changeToDo(todo.id);
        }}
      >
        update todo
      </button>
      <button
        onClick={async () => {
          await deleteToDo(todo.id);
        }}
      >
        delete todo
      </button>
      <br />
      <input
        type="checkbox"
        defaultChecked={todo.completed}
        onChange={(e) => updateTodosDb(e, todo.id)}
      />
      <h4>id: {todo.id}</h4>
      <h4>title: {todo.title}</h4>
    </div>
  ));
  return (
    <section>
      <h2>Your todos</h2>

      <button onClick={addToDo}>add todo</button>

      <div>
        {isLoading ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <nav id="todosFilterNav">
              <h3>Filter by: </h3>
              <button
                type="button"
                className="todosFilterBtn"
                onClick={() => openFilterInput("id")}
              >
                id
              </button>
              <button
                type="button"
                className="todosFilterBtn"
                onClick={() => openFilterInput("completed")}
              >
                completed
              </button>
              <button
                type="button"
                className="todosFilterBtn"
                onClick={() => openFilterInput("title")}
              >
                title
              </button>
              <button
                type="button"
                className="todosFilterBtn"
                onClick={() => {
                  setSearchParams("");
                  setFilterOn("");
                }}
              >
                reset filter
              </button>

              {filterOn.length > 0 && (
                <>
                  <input
                    type="text"
                    value={filteredValue}
                    onChange={(e) => {
                      setFilteredValue(e.target.value);
                    }}
                  />
                  <button type="button" onClick={handleSearchParams}>
                    Filter {filterOn}
                  </button>
                </>
              )}
            </nav>
            <nav id="todosSortNav">
              <h3>Sort by: </h3>
              <button type="button" className="todosSortBtn" onClick={sortById}>
                id
              </button>
              <button
                type="button"
                className="todosSortBtn"
                onClick={sortByCompleted}
              >
                completed
              </button>
              <button
                type="button"
                className="todosSortBtn"
                onClick={sortByAlpha}
              >
                title
              </button>
              <button
                type="button"
                className="todosSortBtn"
                onClick={sortByRandom}
              >
                random
              </button>
            </nav>
            {error ? (
              <h2>Error! not found</h2>
            ) : ( <>
              <h3>Todos: </h3>
              <section>{todosDisplay}</section>
            </>)}
          </>
        )}
      </div>
    </section>
  );
};

export default Todos;
