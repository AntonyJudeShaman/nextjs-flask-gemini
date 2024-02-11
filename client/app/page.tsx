"use client";
import React, { useState, useEffect } from "react";

function Home() {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://127.0.0.1:8080/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target: "ta", text: "Summarize the content" }),
      });
      const result = await response.json();
      setData(result.translated_text);
    };

    fetchData();
  }, []);

  return <div>{data}</div>;
}

export default Home;
