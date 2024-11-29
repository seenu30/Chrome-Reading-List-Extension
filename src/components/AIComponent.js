/*global globalThis */
import React, { useState } from "react";

const AIComponent = ({ url, onSummaryGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cleanData = async (url) => {
    try {
      // Fetch the HTML content of the URL
      const response = await fetch(url);
      const html = await response.text();

      // Basic cleaning: Strip HTML tags and get text content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const textContent = tempDiv.innerText;

      // Further cleaning: Remove extra spaces, scripts, or redundant info
      const cleanedText = textContent
        .replace(/(\r\n|\n|\r)/gm, " ") // Remove newlines
        .replace(/\s+/g, " ") // Remove extra spaces
        .trim();

      return cleanedText;
    } catch (err) {
      console.error("Error fetching/cleaning data:", err);
      throw new Error("Failed to fetch or clean data.");
    }
  };

  const fetchSummary = async (longText) => {
    const options = {
      sharedContext: "This is a scientific article",
      type: "key-points",
      format: "markdown",
      length: "medium",
    };

    try {
      const available = (await globalThis.ai.summarizer.capabilities()).available;
      let summarizer;

      if (available === "no") {
        console.log("AI summarizer not available");
        return "Summarizer not available";
      }

      if (available === "readily") {
        summarizer = await globalThis.ai.summarizer.create(options);
      } else {
        summarizer = await globalThis.ai.summarizer.create(options);
        summarizer.addEventListener("downloadprogress", (e) => {
          console.log(e.loaded, e.total);
        });
        await summarizer.ready;
      }

      const summary = await summarizer.summarize(longText, {
        context: "This article is intended for a tech-savvy audience.",
      });
      return summary;

    } catch (error) {
      console.error("Error while fetching summary:", error);
      return "Error occurred during summarization.";
    }
  };

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Clean the data from the link
      const cleanedData = await cleanData(url);

      // Step 2: Generate the summary
      const summary = await fetchSummary(cleanedData);

      // Step 3: Pass the summary back to the parent component
      onSummaryGenerated(summary);
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred while summarizing.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-2">
      {/* Button to trigger data cleaning and AI summarization */}
      <button
        onClick={handleSummarize}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Get Summary"}
      </button>

      {/* Display error if any */}
      {error && <p className="text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default AIComponent;
