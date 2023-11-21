import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
