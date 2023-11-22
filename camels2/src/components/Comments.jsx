import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const fetchData = useFetch;
  const { id } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await fetchData(
          `http://localhost:3000/comments?postId=${id}`
        );
        setComments(data);
        console.log('data: ', data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchComments();
  }, []);

  const commentsDisplay = comments.map((comment) => {
    console.log("comment: ", comment.completed); //completed not printing
    return (
      <div key={comment?.id}>
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
