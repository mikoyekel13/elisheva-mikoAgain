import { useState } from "react";
import useFetch from "../assets/customHooks/useFetch.jsx";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const fetch = useFetch();
  async function checkUserDetails() {
    const data = await fetch(
      `http://localhost:3000/users?username=${username}`
    );
    console.log(data[0].website);
    if (password === data[0].website) {
      console.log("loged in");
    } else {
      console.log("incorrect");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    checkUserDetails();
  }

  function handleInput(e, currState) {
    const currValue = e.target.value;
    const forbidChars = [
      "!",
      "?",
      "*",
      "<",
      ">",
      "/",
      "\\",
      ";",
      "(",
      ")",
      "{",
      "}",
      "[",
      "]",
    ];
    if (
      currValue.length <= 15 &&
      !forbidChars.includes(currValue[currValue.length - 1])
    ) {
      if (currState === "username") {
        setUsername(currValue);
      } else if (currState === "password") {
        setPassword(currValue);
      }
    }
  }

  return (
    <>
      <form id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => handleInput(e, "username")}
        />
        <br />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => handleInput(e, "password")}
        />
        <button type="submit">Submit!</button>
      </form>
    </>
  );
}

export default Login;
