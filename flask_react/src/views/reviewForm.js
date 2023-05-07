import React, { useState } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

function ReviewForm({ songId }) {
 const style = {
        position: "absolute",
        top: "60%",
        left: "55%",
        transform: "translate(-50%, -50%)",
        width: 500,
        height: 175,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
    };
  const [review, setReview] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/post-review", {
        songID: songId,
        review: review,
      });

      if (response.data.success) {
        alert("Review posted successfully!");
      } else {
        alert("Error posting review: " + response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error posting review: " + error.message);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={style}>
      <Typography style={{textAlign:"center"}} variant="h5" gutterBottom>
        Review
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        style={{
          textAlign: "center",
          paddingBottom: "50px",
        }}
      >
        <TextField
          id="outlined-basic"
          label="post a review"
          variant="outlined"
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
          multiline
          rows={2}
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <Button variant="contained" type="submit">
          Post
        </Button>
      </Stack>
    </Box>
  );
}

export default ReviewForm;
