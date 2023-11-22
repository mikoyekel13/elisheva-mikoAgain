import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const fetchData = useFetch;
  const { postId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await fetchData(
          `http://localhost:3000/comments?postId=${postId}`
        );
        setComments(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchComments();
  }, []);

  async function deleteComment(currCommentId) {
    await fetchData(`http://localhost:3000/comments/${currCommentId}`, {
      method: "DELETE",
    });
    setComments((prevComments) => {
      return prevComments.filter((comment) => comment.id !== currCommentId);
    });
  }

  async function addComment() {
    const newCommentsObj = getAddCommentsContent();
    const responseComments = await sendRequestToDb(
      "POST",
      `http://localhost:3000/comments/`,
      newCommentsObj
    );

    setComments((prevComments) => [...prevComments, responseComments]);
  }

  async function changeComment(commentsId) {
    const newCommentsObj = getAddCommentsContent();
    const responseComments = await sendRequestToDb(
      "PUT",
      `http://localhost:3000/comments/${commentsId}`,
      newCommentsObj
    );

    setComments((prevComments) => {
      let newComments = [...prevComments];
      const commentIndex = prevComments.findIndex(
        (comment) => comment.id === responseComments.id
      );
      newComments[commentIndex] = responseComments;
      return newComments;
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
  function getAddCommentsContent() {
    const commentName = prompt("please enter your comment name");
    const commentBody = prompt("please enter your comment body");
    const commentEmail = prompt("please enter your comment email");
    const newComment = {
      name: commentName,
      body: commentBody,
      email: commentEmail,
      postId: postId,
    };
    return newComment;
  }

  const commentsDisplay = comments.map((comment) => {
    return (
      <div key={comment?.id}>
        <button
          onClick={async () => {
            await changeComment(comment.id);
          }}
        >
          update comment
        </button>
        <button
          onClick={async () => {
            await deleteComment(comment.id);
          }}
        >
          delete comment
        </button>
        <h4>body: {comment?.body}</h4>
        <h4>email: {comment?.email}</h4>
        <h4>id: {comment?.id}</h4>
        <h4>name: {comment?.name}</h4>
        <h4>postId: {comment?.postId}</h4>
      </div>
    );
  });
  return (
    <section>
      <h2>Your comments</h2>
      <button onClick={addComment}>add post</button>
      <div>
        {comments.length > 0 ? (
          <section>{commentsDisplay}</section>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </section>
  );
};

export default Comments;
