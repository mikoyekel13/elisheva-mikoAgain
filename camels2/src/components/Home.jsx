import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <>
      {window.location.href === "http://localhost:5173/home/1" ? ( //fix link
        <h1>Choose the data you would like to see</h1>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default Home;
