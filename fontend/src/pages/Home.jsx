import { useEffect } from "react";
import { useState } from "react";
import { styled } from "styled-components";
import Cards from "../Components/Cards";
import axios from "axios";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export default function Home({ type }) {
  const [videos, setVideos] = useState([]);
  // console.log(type);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/${type}`);
    //   console.log(res.data, "==> data from api");
      setVideos(res.data);
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {videos.map((video) => (
        <Cards key={video._id} video={video} />
      ))}
    </Container>
  );
}
