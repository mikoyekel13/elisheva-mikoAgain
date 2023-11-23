import { useState, useEffect } from "react";
import useFetch from "../assets/customHooks/useFetch";
import { useParams, Outlet, useNavigate } from "react-router-dom";
import FilterNav from "./FilterNav";
import UpdDelBtns from "./UpdDelBtns";

const Albums = ({ showAlbum, setShowAlbum }) => {
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [serchParams, setSearchParams] = useState("");

  const fetchData = useFetch;
  const { id, albumId } = useParams();
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

  async function addAlbum() {
    const newAlbumObj = getAddAlbumContent();
    const responseAlbum = await sendRequestToDb(
      "POST",
      `http://localhost:3000/albums/`,
      newAlbumObj
    );

    setAlbums((prevAlbums) => [...prevAlbums, responseAlbum]);
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
      <UpdDelBtns
        contentId={album.id}
        contentUrl={`http://localhost:3000/albums/${album.id}`}
        setContent={setAlbums}
        getPostData={getAddAlbumContent}
        sendRequestToDb={sendRequestToDb}
      />
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
        <FilterNav setSearchParams={setSearchParams} todos={false} />
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
    </div>
  );
};

export default Albums;
