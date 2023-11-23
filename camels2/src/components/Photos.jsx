import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchData = useFetch;
  const { albumId } = useParams();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setError(false);
        setIsLoading(true);
        const data = await fetchData(
          `http://localhost:3000/photos?albumId=${albumId}`
        );
        if (!(data.length > 0)) throw new Error("not found");
        setPhotos(data);
        console.log("data: ", data);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [albumId, fetchData]);

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
    <>
      <h2>Your photos</h2>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error! not found</h2>
      ) : (
        <section>
          <div>
            <section>{photosDisplay}</section>
          </div>
        </section>
      )}
    </>
  );
};

export default Photos;
