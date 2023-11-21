import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./assets/components/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/home/:id" element={<Home />}>
            <Route path="info/" element={<Info />} />
            <Route path="posts/" element={<Posts />} />
            <Route path="posts/:id" element={<Post />}>
              <Route path="comments" element={<Comments />} />
            </Route>
            <Route path="albums/" element={<Albums />} />
            <Route path="album/:id" element={<Album />}>
              <Route path="photos" element={<Photos />} />
            </Route>
            <Route path="todos/" element={<Todos />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
