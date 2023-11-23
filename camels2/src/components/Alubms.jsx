import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams, Outlet, useNavigate } from "react-router-dom";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [serchParams, setSearchParams] = useState("");
  const [filterOn, setFilterOn] = useState("");
  const [filteredValue, setFilteredValue] = useState("");

  const fetchData = useFetch;
  const { id, albumId } = useParams();
  const [showAlbum, setShowAlbum] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setError(false);
        setIsLoading(true);
        let data;
        albumId
          ? (data = await fetchData(
              `http://localhost:3000/albums?id=${albumId}${serchParams}`
            ))
          : (data = await fetchData(
              `http://localhost:3000/albums?userId=${id}${serchParams}`
            ));
        if (!(data.length > 0)) throw new Error("not found");
        setAlbums(data);
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [showAlbum, serchParams, albumId, id, fetchData]);

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

  function openFilterInput(type) {
    setFilteredValue("");
    setFilterOn(type);
  }

  const albumsDisplay = albums.map((album) => (
    <div key={album.id}>
      <button
        onClick={() => {
          setShowAlbum(true);
          navigate(`/home/${id}/albums/${album.id}`);
        }}
      >
        show album
      </button>
      <button
        onClick={() => {
          setShowAlbum(false);
          navigate(`/home/${id}/albums`);
        }}
      >
        back to albums
      </button>
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
      <h4>id: {album?.id}</h4>
      <h4>title: {album?.title}</h4>
      {showAlbum && (
        <>
          <h4>userId: {album?.userId}</h4>
          <button
            onClick={() => {
              navigate(`/home/${id}/albums/${album.id}/photos`);
            }}
          >
            show photos
          </button>
          <button
            onClick={() => {
              navigate(`/home/${id}/albums/${album.id}`);
            }}
          >
            hide photos
          </button>
        </>
      )}
    </div>
  ));

  return (
    <div>
      <h2>Your albums</h2>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <nav id="todosFilterNav">
          <h3>Filter by: </h3>
          <button
            type="button"
            className="todosFilterBtn"
            onClick={() => openFilterInput("id")}
          >
            id
          </button>
          <button
            type="button"
            className="todosFilterBtn"
            onClick={() => openFilterInput("title")}
          >
            title
          </button>
          <button
            type="button"
            className="todosFilterBtn"
            onClick={() => {
              setSearchParams("");
              setFilterOn("");
            }}
          >
            reset filter
          </button>

          {filterOn.length > 0 && (
            <>
              <input
                type="text"
                value={filteredValue}
                onChange={(e) => {
                  setFilteredValue(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setSearchParams(`&${filterOn}=${filteredValue}`);
                }}
              >
                Filter {filterOn}
              </button>
            </>
          )}
        </nav>
      )}
      {error ? (
        <h2>Error! not found</h2>
      ) : (
        <>
          <section>
            <h3>Albums:</h3>
            <button onClick={addAlbum}>add album</button>
            <div>
              <section>{albumsDisplay}</section>
            </div>
          </section>
          <Outlet />
        </>
      )}
      ;
    </div>
  );
};

export default Albums;
