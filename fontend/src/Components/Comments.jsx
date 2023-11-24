import { useEffect } from "react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { styled } from "styled-components"
import Comment from "./Comment"
import axios from "axios";

const Container = styled.div`
    
`

const NewComment = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    
`

const Avatar = styled.img`
    width: 50px;
    height: 50px;
    border-radius: 50%;
`

const Input = styled.input`
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.soft};
    background-color: transparent;
    width: 100%;
    outline: none;
    padding: 5px 10px;
`

export default function Comments({ videoId }) {
    const { currentUser } = useSelector(state => state.user);

    const [comment, setComment] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`/comment/${videoId}`)
                
                setComment(res.data)
            } catch (error) {
                console.log(error)  
            }
        }
        fetchComments()
    }, [videoId])

    return (
        <Container>
            <NewComment>
                <Avatar src={currentUser?.img ? currentUser?.img : "https://beforeigosolutions.com/wp-content/uploads/2021/12/dummy-profile-pic-300x300-1.png"} />
                <Input placeholder="Add comments" />
            </NewComment>
            {
                comment?.map((comment) => (
                    <Comment key={comment?._id} comment={comment} />
                ))
            }
        </Container>
    )
}
