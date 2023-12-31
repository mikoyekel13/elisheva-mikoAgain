import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";
import UpdDelBtns from "./UpdDelBtns";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchData = useFetch;
  const { postId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setError(false);
        setIsLoading(true);
        const data = await fetchData(
          `http://localhost:3000/comments?postId=${postId}`
        );
        if (!(data.length > 0)) throw new Error("not found");
        setComments(data);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [fetchData, postId]);

  async function addComment() {
    const newCommentsObj = getAddCommentsContent();
    const responseComments = await sendRequestToDb(
      "POST",
      `http://localhost:3000/comments/`,
      newCommentsObj
    );

    setComments((prevComments) => [...prevComments, responseComments]);
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
        <UpdDelBtns
          contentId={comment.id}
          contentUrl={`http://localhost:3000/comments/${comment.id}`}
          setContent={setComments}
          getPostData={getAddCommentsContent}
          sendRequestToDb={sendRequestToDb}
        />
        <h4>body: {comment?.body}</h4>
        <h4>email: {comment?.email}</h4>
        <h4>id: {comment?.id}</h4>
        <h4>name: {comment?.name}</h4>
        <h4>postId: {comment?.postId}</h4>
      </div>
    );
  });

  return (
    <>
      <h2>Your comments</h2>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error! not found</h2>
      ) : (
        <section>
          <button onClick={addComment}>add comment</button>
          <div>
            <section>{commentsDisplay}</section>
          </div>
        </section>
      )}
    </>
  );
};

export default Comments;
