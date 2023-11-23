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

  async function deletePhoto(currPhotoId) {
    await fetchData(`http://localhost:3000/photos/${currPhotoId}`, {
      method: "DELETE",
    });
    setPhotos((prevPhotos) => {
      return prevPhotos.filter((photo) => photo.id !== currPhotoId);
    });
  }

  async function addPhoto() {
    const newPhotoObj = getAddPhotoContent();
    const responsePhoto = await sendRequestToDb(
      "POST",
      `http://localhost:3000/photos/`,
      newPhotoObj
    );

    setPhotos((prevPhotos) => [...prevPhotos, responsePhoto]);
  }

  async function changePhoto(PhotoId) {
    const newPhotoObj = getAddPhotoContent();
    const responsePhoto = await sendRequestToDb(
      "PUT",
      `http://localhost:3000/photos/${PhotoId}`,
      newPhotoObj
    );

    setPhotos((prevPhotos) => {
      let newPhotos = [...prevPhotos];
      const photoIndex = prevPhotos.findIndex(
        (photo) => photo.id === responsePhoto.id
      );
      newPhotos[photoIndex] = responsePhoto;
      return newPhotos;
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
  
  function getAddPhotoContent() {
    const photoTitle = prompt("please enter your photo title");
    const photoURL = prompt("please enter your photo url");
    const newPhoto = {
      albumId: albumId,
      title: photoTitle,
      url: "",
      thumbnailUrl: photoURL,
    };
    return newPhoto;
  }

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
        <div>
          <img key={photos[i].id} src={photos[i].thumbnailUrl} />
          <button
            onClick={async () => {
              await changePhoto(photos[i].id);
            }}
          >
            update photo
          </button>
          <button
            onClick={async () => {
              await deletePhoto(photos[i].id);
            }}
          >
            delete photo
          </button>
        </div>
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
            <button onClick={addPhoto}>add photo</button>
            <br/>
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
  );
};

export default Photos;
