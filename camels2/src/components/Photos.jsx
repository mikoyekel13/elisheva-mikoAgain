import { useState, useEffect, useRef } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams } from "react-router-dom";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const fetchData = useFetch;
  const { albumId } = useParams();
  const [photosOnPage, setPhotosOnPage] = useState([]);
  const photosDisplayedCount = useRef(0);
  const NUM_OF_PHOTOS_TO_DISPLAY = 3;
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

  function getPhotos(numOfPhotos) {
    let photosDisplay = [];
    let end = false;
    if (photos.length - photosDisplayedCount.current < numOfPhotos) {
      numOfPhotos = photos.length - photosDisplayedCount.current;
      end = true;
    }

    for (
      let i = photosDisplayedCount.current;
      i < numOfPhotos + photosDisplayedCount.current;
      i++
    ) {
      photosDisplay.push(
        <img key={photos[i].id} src={photos[i].thumbnailUrl} />
      );
    }
    if (end) {
      photosDisplayedCount.current = 0;
    } else {
      photosDisplayedCount.current += numOfPhotos;
    }
    return photosDisplay;
  }

  useEffect(() => {
    if (photos.length > 0) {
      setPhotosOnPage(getPhotos(NUM_OF_PHOTOS_TO_DISPLAY));
    }
  }, [photos]);

  return (
    <>
      <h2>Your photos</h2>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2>Error! not found</h2>
      ) : (
        <div>
          <>
            <section>{photosOnPage}</section>
            <button
              onClick={() =>
                setPhotosOnPage(getPhotos(NUM_OF_PHOTOS_TO_DISPLAY))
              }
            >
              load more
            </button>
          </>
        </div>
      )}
    </>
  )
}

export default Photos;
