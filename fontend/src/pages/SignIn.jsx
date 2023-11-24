import React from 'react'
import { useState } from 'react';
import { styled } from 'styled-components'
import axios from "axios";
import { useDispatch } from 'react-redux';
import { loginFailure, loginStart, loginSuccess } from '../Redux/userSlice';
import { auth, provider } from '../firebaseConfig/Config.js';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(100vh - 50px);
`;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: ${({ theme }) => theme.bgLight};
    border: 1px solid ${({ theme }) => theme.soft};
    padding: 20px 50px;
    gap: 5px;
`;

const Title = styled.h1`
    font-size: 20px;
    
`

const SubTitle = styled.h2`
    font-size: 15px;
    font-weight: 200;
`

const Input = styled.input`
    padding: 8px 10px;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.soft};
    border-radius: 5px;
    background-color: transparent;
    color: ${({ theme }) => theme.text};
`

const Button = styled.button`
    margin: 8px;
    padding: 10px 20px;
    width: 100%;
    border: 3px solid ${({ theme }) => theme.soft};
    background-color: ${({ theme }) => theme.soft};
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
`

export default function SignIn() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({});
    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function signInHandler(e) {
        e.preventDefault();
        if (email === "" && password === "") {
            alert("email and password can not be empty")
        } else {
            dispatch(loginStart());
            try {
                const res = await axios.post(`/auth/signIn`, { name, password })
                // console.log(res.data, "==> sign in api hit");
                dispatch(loginSuccess(res.data.data))
                navigate('/')
            } catch (error) {
                // console.log(error.response.data);
                setError(error.response.data)
                dispatch(loginFailure())
            }
        }
    }

    async function signInWithGoogle() {
        dispatch(loginStart());
        signInWithPopup(auth, provider).then((result) => {
            
            axios.post('/auth/google', {
                name: result.user.displayName,
                email: result.user.email,
                img: result.user.photoURL,
            }).then((res) => {
                dispatch(loginSuccess(res.data.data))
            })
            navigate('/')
        }).catch(error => {
            console.log(error);
            dispatch(loginFailure())
        })
    }

    return (
        <Container>
            <Wrapper>
                <Title>Sign In</Title>
                <SubTitle>sign in to like and subscribe</SubTitle>
                <Input placeholder='username' type="email" onChange={(e) => setName(e.target.value)} />
                <Input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                <Button onClick={signInHandler}>Sign In</Button>
                <Title>Or</Title>
                <Button onClick={signInWithGoogle}>Sign In With Google</Button>
                <Title>Or</Title>
                <Input placeholder='Username' onChange={(e) => setName(e.target.value)} />
                <Input placeholder='Email' type="email" onChange={(e) => setEmail(e.target.value)} />
                <Input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                <Button>Sign Up</Button>
            </Wrapper>
        </Container>
    )
}
