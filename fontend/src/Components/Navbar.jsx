import { AccountCircleOutlined, SearchOutlined, VideoCallOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { styled } from "styled-components"
import { useSelector } from "react-redux"
import { Avatar } from "@mui/material";
import { useState } from "react";
import UploadPopup from "./UploadPopup";

const Container = styled.div`
    position: sticky;
    top: 0;
    background-color: ${({ theme }) => theme.bgLight};
    height: 50px;
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    padding: 0px 20px;
`;

const Search = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
    margin: 0px auto;
    border: 1px solid ${({ theme }) => theme.soft};
    border-radius: 3px;
    width: 40%;
    padding: 5px;
`;
const Input = styled.input`
    border: none;
    background-color: transparent;
    width: 100%;
    outline: none;
    color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
    margin: 8px;
    padding: 5px;
    border: 3px solid #2d6d99;
    background-color: transparent;
    color: #2d6d99;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
`

const User = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
`

export default function Navbar() {

    const { currentUser } = useSelector(state => state.user)
    // console.log(currentUser, "====>>  current user from redux");
    const [uploadVideoPopup, setUploadVideoPopup] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    return (
        <>
            <Container>
                <Wrapper>
                    <Search>
                        <Input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                        <SearchOutlined style={{ cursor: "pointer" }} onClick={() => navigate(`/search?search=${search}`)} />
                    </Search>
                    {
                        currentUser ?
                            <User>
                                <VideoCallOutlined onClick={() => setUploadVideoPopup(true)} style={{ cursor: "pointer" }} />
                                <Avatar src={currentUser?.img ? currentUser?.img : ''} />
                                {currentUser?.name}
                            </User>
                            : <Link to="/signin" style={{ textDecoration: "none" }}>
                                <Button><AccountCircleOutlined />SIGN IN</Button>
                            </Link>
                    }
                </Wrapper>
            </Container>
            {uploadVideoPopup && <UploadPopup setUploadVideoPopup={setUploadVideoPopup} />}
        </>
    )
}
