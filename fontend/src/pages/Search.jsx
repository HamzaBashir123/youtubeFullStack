import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from 'styled-components'
import Cards from '../Components/Cards';


const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`

export default function Search() {

    const [searchVideos, setSearchVideos] = useState([]);
    const query = useLocation().search

    useEffect(() => {
        const fetchSearchVideos = async () => {
            const res = await axios.get(`/videos/search${query}`)
            setSearchVideos(res?.data)
        }
        fetchSearchVideos()
    }, [query])

    return (
        <Container>
            {
                searchVideos.map((video) => (
                    <Cards key={video?._id} video={video} />
                ))
            }
        </Container>
    )
}
