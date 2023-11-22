import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { Outlet, useParams, useNavigate } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [showPost, setShowPost] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // const [hasShownPost, setHasShownPost] = useState(false);

  const fetchData = useFetch;
  const { id, postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let data;
        postId
          ? (data = await fetchData(`http://localhost:3000/posts?id=${postId}`))
          : (data = await fetchData(
              `http://localhost:3000/posts?userId=${id}`
            ));
        setPosts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPosts();
  }, [showPost]);

  const postsDisplay = posts.map((post) => {
    return (
      <div key={post.id}>
        <button
          onClick={() => {
            setShowPost(true);
            navigate(`/home/${id}/posts/${post.id}`);
          }}
        >
          show post
        </button>
        <button
          onClick={() => {
            setShowPost(false);
            navigate(`/home/${id}/posts`);
          }}
        >
          hide post
        </button>
        <h4>id: {post?.id}</h4>
        <h4>title: {post?.title}</h4>
        {showPost && (
          <>
            <h4>userId: {post?.userId}</h4>
            <h4>body: {post?.body}</h4>
            <button
              onClick={() => {
                setShowComments(true);
                navigate(`/home/${id}/posts/${post.id}/comments`);
              }}
            >
              show comments
            </button>
            <button
              onClick={() => {
                setShowComments(false);
                navigate(`/home/${id}/posts/${post.id}`);
              }}
            >
              hide comments
            </button>
          </>
        )}
      </div>
    );
  });
  return (
    <div>
      <section>
        <h2>Your Posts</h2>
        <div>
          {posts.length > 0 ? (
            <section>{postsDisplay}</section>
          ) : (
            <h2>Loading...</h2>
          )}
        </div>
      </section>
      <Outlet />
    </div>
  );
};

export default Posts;
