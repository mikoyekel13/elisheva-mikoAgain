import useFetch from "../assets/customHooks/useFetch";

const UpdDelBtns = ({
  contentId,
  contentUrl,
  setContent,
  getPostData,
  sendRequestToDb,
}) => {
  const fetchData = useFetch;

  async function deleteContent() {
    await fetchData(contentUrl, {
      method: "DELETE",
    });
    setContent((prev) => {
      return prev.filter((content) => content.id !== contentId);
    });
  }

  async function changeContent() {
    const newContentObj = getPostData();
    const response = await sendRequestToDb("PUT", contentUrl, newContentObj);
    setContent((prev) => {
      let newContent = [...prev];
      const contentIndex = prev.findIndex(
        (comment) => comment.id === response.id
      );
      newContent[contentIndex] = response;
      return newContent;
    });
  }

  return (
    <div>
      <button
        onClick={async () => {
          await changeContent();
        }}
      >
        update
      </button>
      <button
        onClick={async () => {
          await deleteContent();
        }}
      >
        delete
      </button>
    </div>
  );
};

export default UpdDelBtns;
