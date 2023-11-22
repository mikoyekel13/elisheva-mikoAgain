import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams, Outlet } from "react-router-dom";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const fetchData = useFetch;
  const { id, albumId } = useParams();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        let data;
        albumId
          ? (data = await fetchData(
              `http://localhost:3000/albums?id=${albumId}`
            ))
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

  async function deleteAlbum(currAlbumId) {
    await fetchData(`http://localhost:3000/albums/${currAlbumId}`, {
      method: "DELETE",
    });
    setAlbums((prevAlbums) => {
      return prevAlbums.filter((album) => album.id !== currAlbumId);
    });
  }

  async function addAlbum() {
    const newAlbumObj = getAddAlbumContent();
    const responseAlbum = await sendRequestToDb(
      "POST",
      `http://localhost:3000/albums/`,
      newAlbumObj
    );

    setAlbums((prevAlbums) => [...prevAlbums, responseAlbum]);
  }

  async function changeAlbum(albumId) {
    const newAlbumObj = getAddAlbumContent();
    const responseAlbum = await sendRequestToDb(
      "PUT",
      `http://localhost:3000/albums/${albumId}`,
      newAlbumObj
    );

    setAlbums((prevAlbums) => {
      let newAlbums = [...prevAlbums];
      const albumIndex = prevAlbums.findIndex(
        (album) => album.id === responseAlbum.id
      );
      newAlbums[albumIndex] = responseAlbum;
      return newAlbums;
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
  function getAddAlbumContent() {
    const albumTitle = prompt("please enter your album title");
    const newAlbum = {
      title: albumTitle,
      userId: id,
    };
    return newAlbum;
  }

  const albumsDisplay = albums.map((album) => (
    <div key={album.id}>
      <button
        onClick={async () => {
          await changeAlbum(album.id);
        }}
      >
        update album
      </button>
      <button
        onClick={async () => {
          await deleteAlbum(album.id);
        }}
      >
        delete album
      </button>
      <h4>userId: {album?.userId}</h4>
      <h4>id: {album?.id}</h4>
      <h4>title: {album?.title}</h4>
    </div>
  ));
  return (
    <div>
      <section>
        <h2>Your albums</h2>
        <button onClick={addAlbum}>add album</button>
        <div>
          {albums.length > 0 ? (
            <section>{albumsDisplay}</section>
          ) : (
            <h2>Loading...</h2>
          )}
        </div>
      </section>
      <Outlet />
    </div>
  );
};

export default Albums;
