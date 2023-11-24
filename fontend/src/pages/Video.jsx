import { AddTaskOutlined, Description, ReplyOutlined, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from "@mui/icons-material"
import { styled } from "styled-components"
import Comments from "../Components/Comments.jsx"
import Cards from "../Components/Cards.jsx"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import { fetchStart, fetchSuccess, like, dislike, fetchFailure } from "../Redux/videoSlice"
import { format } from "timeago.js"
import { subscription } from "../Redux/userSlice"
import Recommendation from "../Components/Recommendation.jsx"

const Container = styled.div`
    display: flex;
    gap: 22px;
`

const Content = styled.div`
    flex: 5;
`

const VideoWrapper = styled.div`
    
`

const Title = styled.h1`
    font-size: 18px;
    font-weight: 500;
    margin: 18px 0px 8px 0px;
    color: ${({ theme }) => theme.text};
`

const Details = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const Info = styled.span`
    color: ${({ theme }) => theme.textSoft};
    font-size: 14px;    
`

const Buttons = styled.div`
    display: flex;
    gap: 15px;
    color: ${({ theme }) => theme.text};

`

const Button = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`

const Hr = styled.hr`
    border: 0.5px solid ${({ theme }) => theme.soft};
    margin: 10px 0px;
`

const Channel = styled.div`
    display: flex;
    justify-content: space-between;
`

const ChannelInfo = styled.div`
    display: flex;
    gap: 10px;
`

const Image = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`

const ChannelDetails = styled.div`
    display: flex;
    flex-direction: column;

`
const ChannelName = styled.span`
    font-weight: 500;
`
const ChannelSubscribers = styled.span`
    margin: 5px 0px 15px 0px;
    color: ${({ theme }) => theme.textSoft};
    font-size: 12px;
`
const VideoDescription = styled.p`
    font-size: 14px;
`

const Subscribe = styled.button`
    background-color: #cc1a00;
    font-weight: 500;
    color: white;
    border: none;
    border-radius: 3px;
    height: max-content;
    padding: 10px 15px;
    cursor: pointer;
`

const VideoFrame = styled.video`
    max-height: 720px;
    width: 100%;
    object-fit: cover;
`

export default function Video() {
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.user)
    const { currentVideo } = useSelector(state => state.video)
    const path = useLocation().pathname.split("/")[2]
    
    // console.log(currentVideo, "==>> current video");

    const [channel, setChannel] = useState({});

    useEffect(() => {
        const fetchVideo = async () => {
            dispatch(fetchStart())
            try {
                const videoRes = await axios.get(`/videos/find/${path}`)
                // console.log(videoRes.data, "===> video res")
                const channel = await axios.get(`/users/find/${videoRes?.data?.userId}`)
                // console.log(channel.data, "===> channel res")
                setChannel(channel?.data)
                dispatch(fetchSuccess(videoRes?.data))
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchVideo()
    }, [path, dispatch])

    async function likeHandler() {
        await axios.put(`/users/like/${currentVideo._id}`)
        dispatch(like(currentUser._id));
    }

    async function dislikeHandler() {
        await axios.put(`/users/dislike/${currentVideo._id}`)
        dispatch(dislike(currentUser._id));
    }

    async function subscribeHandler() {
        currentUser?.subscribedUsers?.includes(channel?._id) ?
            await axios.put(`/users/unsub/${channel?._id}`) :
            await axios.put(`/users/sub/${channel?._id}`)
        dispatch(subscription(channel?._id))
    }

    return (
        <Container>
            <Content>
                <VideoWrapper>
                    <VideoFrame src={currentVideo?.videoUrl} controls />
                </VideoWrapper>
                <Title>{currentVideo?.title}</Title>
                <Details>
                    <Info>{currentVideo?.views} views {format(currentVideo?.createdAt)}</Info>
                    <Buttons>
                        <Button onClick={likeHandler}>
                            {currentVideo?.likes?.includes(currentUser?._id) ? <ThumbUp style={{ marginRight: "5px" }} /> : <ThumbUpOutlined style={{ marginRight: "5px" }} />}{currentVideo?.likes?.length}
                        </Button>
                        <Button onClick={dislikeHandler}>
                            {currentVideo?.dislikes?.includes(currentUser?._id) ? <ThumbDown style={{ marginRight: "5px" }} /> : <ThumbDownOutlined style={{ marginRight: "5px" }} />}Dislike
                        </Button>
                        <Button>
                            <ReplyOutlined style={{ marginRight: "5px" }} />Share
                        </Button>
                        <Button>
                            <AddTaskOutlined style={{ marginRight: "5px" }} />Save
                        </Button>
                    </Buttons>
                </Details>
                <Hr />
                <Channel>
                    <ChannelInfo>
                        <Image src={channel?.img ? channel?.img : "https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png"} />
                        <ChannelDetails>
                            <ChannelName>{channel?.name}</ChannelName>
                            <ChannelSubscribers>{channel?.subscribers} subscribers</ChannelSubscribers>
                            <VideoDescription>{currentVideo?.desc}</VideoDescription>
                        </ChannelDetails>
                    </ChannelInfo>
                    <Subscribe onClick={subscribeHandler}>
                        {currentUser?.subscribedUsers?.includes(channel?._id) ? "Unsubscribe" : "Subscribe"}
                    </Subscribe>
                </Channel>
                <Hr />
                <Comments videoId={currentVideo?._id} />
            </Content>
            
            
            <Recommendation tags={currentVideo?.tags} />
        </Container>
    )
}



