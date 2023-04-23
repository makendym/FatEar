import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function Home() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/home");
        setPosts(response.data.posts);
        setUsername(response.data.username);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleLogout = async () => {
    try {
      await axios.get("/logout");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <form action="/home" method="POST">
        <h1>Welcome {username}</h1>
        <input type="text" name="blog" placeholder="post" required /> <br />
        <input type="submit" value="Post" />
      </form>
      {/* <style type="text/css">
        table, th, td {{
        border: "1px solid black"
        }}
</style> */}
      Here are your posts:
      <table>
        <th>Time</th>
        <th>Post</th>

        {posts.map((line) => (
          <tr key={line.ts}>
            <td>{line.ts}</td>
            <td>{line.blog_post}</td>
          </tr>
        ))}
      </table>
      <a href="/select_blogger">Select a blogger</a>
      <br />
      <a href="/upload_form">Upload a photo</a>
      <br />
      <a href="/logout">Logout</a>
      <Button onClick={handleLogout} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Logout
      </Button>
    </>
  );
}

export default Home;
