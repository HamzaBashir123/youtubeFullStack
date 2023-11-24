import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import Cards from './Cards';

const Container = styled.div`
    flex: 2; 
`

export default function Recommendation({ tags }) {
    

    const [videos, setVideos] = useState([]);

    useEffect(() => {
        const fetchVideosByTags = async () => {
            const res = await axios.get(`/videos/tags?tags=${tags}`);
            setVideos(res?.data)
        }
        fetchVideosByTags();
    }, [tags])

    return (
        <Container>
            {
                videos.map((video) => (
                    <Cards type="sm" key={video?._id} video={video} />
                ))
            }
        </Container>
    )
}
