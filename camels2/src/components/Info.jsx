import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Info = () => {
  const [info, setInfo] = useState([]);
  const fetchData = useFetch;
  const { id } = useParams();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await fetchData(`http://localhost:3000/users?id=${id}`);
        setInfo(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchInfo();
  }, []);

  const infoDisplay = info.map((user) => {
    return (
      <div key={user.id}>
        <h4>id: {user.id}</h4>
        <h4>name: {user.name}</h4>
        <h4>username: {user.username}</h4>
        <h4>email: {user.email}</h4>
        <h4>phone: {user.phone}</h4>
        <h4>city: {user.address.city}</h4>

      </div>
    );
  });
  return (
    <section>
      <h2>Your info</h2>
      <div>
        {info.length > 0 ? (
          <section>{infoDisplay}</section>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </section>
  );
};

export default Info;
