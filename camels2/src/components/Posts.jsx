import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { Outlet, useParams, useNavigate } from "react-router-dom";

const Posts = ({showPost, setShowPost}) => {
  const [posts, setPosts] = useState([]);

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

  async function deletePost(currPostId) {
    await fetchData(`http://localhost:3000/posts/${currPostId}`, {
      method: "DELETE",
    });
    setPosts((prevPosts) => {
      return prevPosts.filter((post) => post.id !== currPostId);
    });
  }

  async function addPost() {
    const newPostObj = getAddPostContent();
    const responsePost = await sendRequestToDb(
      "POST",
      `http://localhost:3000/posts/`,
      newPostObj
    );

    setPosts((prevPosts) => [...prevPosts, responsePost]);
  }

  async function changePost(postId) {
    const newPostObj = getAddPostContent();
    const responsePost = await sendRequestToDb(
      "PUT",
      `http://localhost:3000/posts/${postId}`,
      newPostObj
    );

    setPosts((prevPosts) => {
      let newPosts = [...prevPosts];
      const postIndex = prevPosts.findIndex(
        (post) => post.id === responsePost.id
      );
      newPosts[postIndex] = responsePost;
      return newPosts;
    });
  }

  async function sendRequestToDb(requestType, url, body) {
    const response = await fetchData(url, {
      method: requestType,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return response;
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
            back to posts
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
                  navigate(`/home/${id}/posts/${post.id}/comments`);
                }}
              >
                show comments
              </button>
              <button
                onClick={() => {
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
