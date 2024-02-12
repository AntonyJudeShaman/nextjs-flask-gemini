"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [serverStatus, setServerStatus] = useState("");
  const [scrapData, setScrapeData] = useState("");
  const [scrapeURL, setScrapeURL] = useState("");

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "localhost:8080";

  const checkServerStatus = async () => {
    const response = await axios.get(`http://${serverUrl}/api/home`);
    const result = response.data;
    setServerStatus(result.server_status);
  };

  const ScrapeWebsite = async () => {
    const response = await axios.post(`http://${serverUrl}/api/scrape`, {
      url: scrapeURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = response.data;
    setScrapeData(result.scraped_data);
  };

  return (
    <section className="container flex gap-8 flex-col justify-start md:mt-32 mt-16 items-start min-h-screen">
      <div>
        <Button
          onClick={() => {
            checkServerStatus();
          }}
          size="lg"
        >
          Check server status
        </Button>
        <p className="text-green-500">{serverStatus==="Server is running"
          ? "All systems normal."
          : serverStatus === "Server is not running"
          ? "Some issue with the server."
          : serverStatus
        
        }</p>
      </div>
      <div>
        <Input
          type="text"
          value={scrapeURL}
          onChange={(e) => setScrapeURL(e.target.value)}
          placeholder="Enter URL to scrape"
          className="mb-4"
        ></Input>
        <Button
          onClick={() => {
            ScrapeWebsite();
          }}
          size="lg"
        >
          Scrape website
        </Button>
        <p>{scrapData}</p>
      </div>
    </section>
  );
}
