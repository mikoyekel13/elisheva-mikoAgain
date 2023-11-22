import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const fetchData = useFetch;
  const { id, postId } = useParams();

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
  }, []);

  const postsDisplay = posts.map((post) => {
    console.log(posts);
    return (
      <div key={post.id}>
        <h4>userId: {post?.userId}</h4>
        <h4>id: {post?.id}</h4>
        <h4>title: {post?.title}</h4>
        <h4>body: {post?.body}</h4>
      </div>
    );
  });
  return (
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
  );
};

export default Posts;
