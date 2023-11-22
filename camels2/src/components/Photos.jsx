import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const fetchData = useFetch;
  const { albumId } = useParams();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await fetchData(
          `http://localhost:3000/photos?albumId=${albumId}`
        );
        setPhotos(data);
        console.log('data: ', data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPhotos();
  }, []);

  const photosDisplay = photos.map((photo) => {
    return (
      <div key={photo?.id}>
        <h4>albumId: {photo?.albumId}</h4>
        <h4>title: {photo?.title}</h4>
        <h4>id: {photo?.id}</h4>
        <h4>url: {photo?.url}</h4>
        <h4>thumbnailUrl: {photo?.thumbnailUrl}</h4>

      </div>
    );
  });
  return (
    <section>
      <h2>Your photos</h2>
      <div>
        {photos.length > 0 ? (
          <section>{photosDisplay}</section>
        ) : (
          <h2>Loading...</h2>
        )}
      </div>
    </section>
  );
};

export default Photos;

