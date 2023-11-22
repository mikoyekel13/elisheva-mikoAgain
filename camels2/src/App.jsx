import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Info from "./components/Info";
import Posts from "./components/Posts";
import Post from "./components/Post";
import Comments from "./components/Comments";
import Albums from "./components/Alubms";
import Album from "./components/Album";
import Photos from "./components/Photos";
import Todos from "./components/Todos";
import NotFound from "./components/NotFound";
import Login from "./components/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route element={<Layout />}>
          <Route path="/home/:id" element={<Home />}>
            <Route path="info/" element={<Info />} />
            <Route path="posts/" element={<Posts />} />
            <Route path="posts/:postId" element={<Post />}>
              <Route path="comments" element={<Comments />} />
            </Route>
            <Route path="albums/" element={<Albums />} />
            <Route path="album/:albumId" element={<Album />}>
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
