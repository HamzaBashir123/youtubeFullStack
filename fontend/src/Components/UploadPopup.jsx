import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { styled } from "styled-components";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../firebaseConfig/Config.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLight};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
  z-index: 999;
`;
const Desc = styled.textarea`
  border: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;
const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;
const Label = styled.label`
  font-size: 14px;
`;
export default function UploadPopup({ setUploadVideoPopup }) {
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const [videoPerc, setVideoPerc] = useState(0);
  const [imagePerc, setImagePerc] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  function tagsHandler(e) {
    setTags(e.target.value.split(","));
  }

  function handleChange(e) {
    setInputs((previous) => {
      return { ...previous, [e.target.name]: e.target.value };
    });
  }

  function uploadFlie(file, urlType) {
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "thumbnail"
          ? setImagePerc(Math.round(progress))
          : setVideoPerc(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((previous) => {
            return { ...previous, [urlType]: downloadURL };
          });
        });
      }
    );
  }

  useEffect(() => {
    video && uploadFlie(video, "videoUrl");
  }, [video]);
  useEffect(() => {
    image && uploadFlie(image, "imgUrl");
  }, [image]);

  async function uploadHandler(e) {
    e.preventDefault();
    const res = await axios.post(`/videos`, { ...inputs, tags });
    console.log(inputs)
    setUploadVideoPopup(false);
    res?.status === 200 && navigate(`/video/${res?.data?._id}`);
  }

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setUploadVideoPopup(false)}>X</Close>
        <Title>Upload a video</Title>
        <Label>Video:</Label>
        {videoPerc > 0 ? (
          <LinearProgressWithLabel value={videoPerc} />
        ) : (
          <Input
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files[0])}
          />
        )}
        <Input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handleChange}
        />
        <Desc
          placeholder="Description"
          rows={8}
          name="description"
          onChange={handleChange}
        />
        <Input
          type="text"
          placeholder="Separate tags with a comma."
          onChange={tagsHandler}
        />
        <Label>Thumbnail:</Label>
        {imagePerc > 0 ? (
          <LinearProgressWithLabel value={imagePerc} />
        ) : (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        )}
        <Button onClick={uploadHandler}>Upload</Button>
      </Wrapper>
    </Container>
  );
}

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          style={{ color: `${({ theme }) => theme.text}` }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

// function LinearWithValueLabel() {
//   const [progress, setProgress] = useState(10);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setProgress((prevProgress) =>
//         prevProgress >= 100 ? 10 : prevProgress + 10
//       );
//     }, 800);
//     return () => {
//       clearInterval(timer);
//     };
//   }, []);

//   return (
//     <Box sx={{ width: "100%" }}>
//       <LinearProgressWithLabel value={progress} />
//     </Box>
//   );
// }
