import axios from "axios";
import React, { useState, useEffect } from "react";
function Home() {
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

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
    </>
  );
}

export default Home;
