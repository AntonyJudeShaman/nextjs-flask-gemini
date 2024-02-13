"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/side-bar";

export default function Home() {
  const [serverStatus, setServerStatus] = useState("");
  const [scrapData, setScrapeData] = useState("");
  const [scrapeURL, setScrapeURL] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptResult, setPromptResult] = useState("");

  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "localhost:8080";

  const checkServerStatus = async () => {
    const response = await axios.get(`http://${serverURL}/api/home`);
    const result = response.data;
    setServerStatus(result.server_status);
  };

  const ScrapeWebsite = async () => {
    const response = await axios.post(`http://${serverURL}/api/scrape`, {
      url: scrapeURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = response.data;
    setScrapeData(result.scraped_data);
  };

  const getAIResponse = async () => {
    try {
      const response = await axios.post(
        `http://${serverURL}/api/ai/getdetails`,
        {
          prompt: prompt,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;
      setPromptResult(result.ai_response);
    } catch (error: any) {
      setPromptResult("Some error occured. Please try again.");
    }
  };

  return (
    <div>
      <section>
        <Sidebar />
      </section>
      <section className="container flex gap-8 flex-col justify-start md:mt-32 mt-16 items-start min-h-screen">
        <div>
          <Button
            onClick={() => {
              checkServerStatus();
            }}
            size="lg"
            type="submit"
          >
            Check server status
          </Button>
          <p className="text-green-500">
            {serverStatus === "Server is running"
              ? "All systems normal."
              : serverStatus === "Server is not running"
              ? "Some issue with the server."
              : serverStatus}
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <Input
            type="text"
            value={scrapeURL}
            onChange={(e) => setScrapeURL(e.target.value)}
            placeholder="Enter an absolute URL to scrape"
            className="mb-4"
          ></Input>
          <Button
            onClick={() => {
              ScrapeWebsite();
            }}
            size="lg"
            type="submit"
          >
            Scrape website
          </Button>
          <p>{scrapData}</p>
        </form>
        <form onSubmit={(e) => e.preventDefault()}>
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt"
            className="mb-4"
          ></Input>
          <Button
            onClick={() => {
              getAIResponse();
            }}
            size="lg"
          >
            Send prompt
          </Button>
          <p>{promptResult}</p>
        </form>
      </section>
    </div>
  );
}
