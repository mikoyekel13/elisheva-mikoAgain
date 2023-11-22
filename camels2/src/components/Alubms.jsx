import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const fetchData = useFetch;
  const { id, albumId } = useParams();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        let data;
        albumId
          ? (data = await fetchData(`http://localhost:3000/albums?id=${albumId}`))
          : (data = await fetchData(
              `http://localhost:3000/albums?userId=${id}`
            ));
        setAlbums(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAlbums();
  }, []);

  const albumsDisplay = albums.map((album) => {
    console.log(albums);
    return (
      <div key={album.id}>
        <h4>userId: {album?.userId}</h4>
        <h4>id: {album?.id}</h4>
        <h4>title: {album?.title}</h4>
      </div>
    );
  });
  return (
    <section>
      <h2>Your albums</h2>
      <div>
        {albums.length > 0 ? (
          <section>{albumsDisplay}</section>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </section>
  );
};

export default Albums;
