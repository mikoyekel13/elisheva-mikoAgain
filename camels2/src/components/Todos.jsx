import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [serchParams, setSearchParams] = useState("");
  const [filterId, setFilterId] = useState(false);
  const [currId, setCurrId] = useState("");
  const [filterTitle, setFilterTitle] = useState(false);
  const [currTitle, setCurrTitle] = useState("");
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [currCompleted, setCurrCompleted] = useState("");
  const fetchData = useFetch;
  const { id } = useParams();
  const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
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

  async function updateTodosDb(e, id) {
    const currValue = e.target.checked;
    await fetchData(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: currValue }),
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

  const todosDisplay = todos.map((todo) => (
    <div key={todo.id}>
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
      <div>
        {isLoading ? (
          <h2>Loading...</h2>
        ) : (
          <>
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
            <nav id="todosFilterNav">
              <h3>Filter by: </h3>
              <button
                type="button"
                className="todosFilterBtn"
                onClick={() => {
                  setFilterId(true);
                  setFilterCompleted(false);
                  setFilterTitle(false);
                }}
              >
                id
              </button>
              <button
                type="button"
                className="todosFilterBtn"
                onClick={() => {
                  setFilterCompleted(true);
                  setFilterId(false);
                  setFilterTitle(false);
                }}
              >
                completed
              </button>
              <button
                type="button"
                className="todosFilterBtn"
                onClick={() => {
                  setFilterTitle(true);
                  setFilterId(false);
                  setFilterCompleted(false);
                }}
              >
                title
              </button>
              <button
                type="button"
                className="todosFilterBtn"
                onClick={() => {
                  setSearchParams("");
                  setFilterId(false);
                  setFilterCompleted(false);
                  setFilterTitle(false);
                }}
              >
                reset filter
              </button>
              {filterId && (
                <>
                  <input
                    type="text"
                    value={currId}
                    onChange={(e) => {
                      setCurrId(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchParams(`&id=${currId}`);
                    }}
                  >
                    Filter
                  </button>
                </>
              )}
              {filterCompleted && (
                <>
                  <input
                    type="text"
                    value={currCompleted}
                    onChange={(e) => {
                      setCurrCompleted(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchParams(
                        currCompleted === "false" || currCompleted === "true"
                          ? `&completed=${currCompleted}`
                          : ""
                      );
                    }}
                  >
                    Filter
                  </button>
                </>
              )}
              {filterTitle && (
                <>
                  <input
                    type="text"
                    value={currTitle}
                    onChange={(e) => {
                      setCurrTitle(e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSearchParams(`&title=${currTitle}`);
                    }}
                  >
                    Filter
                  </button>
                </>
              )}
            </nav>
            {error ? (
              <h2>Error! not found</h2>
            ) : (
              <section>{todosDisplay}</section>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Todos;
