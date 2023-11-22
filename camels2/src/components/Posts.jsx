import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { Outlet, useParams, useNavigate } from "react-router-dom";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [showPost, setShowPost] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const fetchData = useFetch;
  const { id, postId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    console.log(posts);
  }, [posts]);
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

  async function deletePost(currPostId) {
    await fetchData(`http://localhost:3000/posts/${currPostId}`, {
      method: "DELETE",
    });
    setPosts((prevPosts) => {
      let newPosts = [...prevPosts];
      const postIndex = prevPosts.findIndex(
        (post) => post.id === currPostId.id
      );
      newPosts.splice(postIndex, 1);
      return newPosts;
    });
  }

  async function addPost() {
    const newPostObj = getAddPostContent();
    const responsePost = await fetchData(`http://localhost:3000/posts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPostObj),
    });
    console.log("responsePost: ", responsePost);

    setPosts((prevPosts) => [...prevPosts, responsePost]);
  }

  async function changePost(postId) {
    const newPostObj = getAddPostContent();
    const responsePost = await fetchData(
      `http://localhost:3000/posts/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPostObj),
      }
    );
    console.log("responsePost: ", responsePost);

    setPosts((prevPosts) => {
      let newPosts = [...prevPosts];
      const postIndex = prevPosts.findIndex(
        (post) => post.id === responsePost.id
      );
      newPosts[postIndex] = responsePost;
      return newPosts;
    });
  }

  function getAddPostContent() {
    const postTitle = prompt("please enter your post title");
    const postBody = prompt("please enter your post body");
    const newPost = {
      title: postTitle,
      body: postBody,
      userId: id,
    };
    return newPost;
  }

  const postsDisplay =
    posts &&
    posts.map((post) => {
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
          <button
            onClick={async () => {
              await changePost(post.id);
            }}
          >
            update post
          </button>
          <button
            onClick={async () => {
              await deletePost(post.id);
            }}
          >
            delete post
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
        <button onClick={addPost}>add post</button>
        <div>
          {posts && posts.length > 0 ? (
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
