import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Info from "./components/Info";
import Posts from "./components/Posts";
import Comments from "./components/Comments";
import Albums from "./components/Alubms";
import Photos from "./components/Photos";
import Todos from "./components/Todos";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login"></Navigate>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/home/:id" element={<Home />}>
            <Route path="info/" element={<Info />} />
            <Route path="posts/" element={<Posts />} />
            <Route path="posts/:postId" element={<Posts />}>
              <Route path="comments" element={<Comments />} />
            </Route>
            <Route path="albums/" element={<Albums />} />
            <Route path="albums/:albumId" element={<Albums />}>
              <Route path="photos" element={<Photos />} />
            </Route>
            <Route path="todos/" element={<Todos />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
