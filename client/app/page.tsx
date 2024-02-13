"use client";
import React, { useState, useCallback, FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import axios from "axios";

// Set up Google API key
const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// Component
const GeminiApp = () => {
  const [serverStatus, setServerStatus] = useState("");
  const [scrapData, setScrapeData] = useState("");
  const [scrapeURL, setScrapeURL] = useState("");
  const [prompt, setPrompt] = useState("");
  const [promptResult, setPromptResult] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [inputPrompt, setInputPrompt] = useState("");
  const [inputPromptResult, setInputPromptResult] = useState("");

  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "localhost:8080";

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImage(file ? URL.createObjectURL(file) : null);
    // setImage(acceptedFiles)
  }, []);
  console.log(image);

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

  const getGeminiResponse = async (e: FormEvent) => {
    e.preventDefault();


    try {
      const response = await axios.post(
        `http://${serverURL}/api/ai/multimodal`,
        {
          prompt: inputPrompt,
          image: image,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = response.data;
      setInputPromptResult(result.multimodal_ai_response);
    } catch (error: any) {
      setInputPromptResult("Some error occured. Please try again.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    onDragEnter: () => {},
    onDragOver: () => {},
    onDragLeave: () => {},
  });

  return (
    <div className="container mt-20">
      <section className="flex gap-8 flex-col justify-start md:mt-32 mt-16 items-start min-h-screen">
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
            placeholder="Enter an absolute URL"
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
        <form onSubmit={getGeminiResponse}>
          <Input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="mb-4 border-black"
            placeholder="Input Prompt"
          />
          <div className="h-40 border-dotted border-black">
            <div
              {...getRootProps()}
              className="flex w-full justify-center rounded-md placeholder:text-white  border-2 border-dashed border-gray-600  h-40 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <input {...getInputProps()} type="file" accept="image/*" />
              {isDragActive ? (
                <p className="flex justify-center p-2 items-center">
                  Drop the image here ...
                </p>
              ) : (
                <p className="flex justify-center p-2 items-center">
                  Drag n drop an image file here, or click to select a file
                </p>
              )}
            </div>
            {image && (
              <Image
                src={image}
                alt="Uploaded Image"
                width={400}
                height={400}
              />
            )}
            <Button onClick={getGeminiResponse} className="mt-4">
              Tell me about the image
            </Button>
          </div>
          <p>{inputPromptResult}</p>
        </form>
      </section>
    </div>
  );
};

export default GeminiApp;
