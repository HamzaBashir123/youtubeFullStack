import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Navbar from "./Components/Navbar";
import Home from "./pages/Home";
import Video from "./pages/Video";
import { darkTheme, lightTheme } from "./utils/Theme";
import { Route, BrowserRouter, Routes, redirect } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import Menu from "./Components/Menu.jsx";

const Container = styled.div`
  display: flex;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.soft};
  }
`;
const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text};
`;
const Wrapper = styled.div`
  padding: 20px 30px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="/trends" element={<Home type="trend" />} />
                  <Route path="/subscriptions" element={<Home type="sub" />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
