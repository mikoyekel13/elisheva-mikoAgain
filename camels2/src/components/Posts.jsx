import { useState, useEffect } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const postsDisplay = posts.map((post) => (
    <div key={post.id}>
      <h4>userId: {post.userId}</h4>
      <h4>id: {post.id}</h4>
      <h4>title: {post.title}</h4>
      <h4>body: {post.body}</h4>
    </div>
  ));
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
