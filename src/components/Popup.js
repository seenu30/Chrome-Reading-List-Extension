/* global chrome */
/*global globalThis */
import React, { useState, useEffect } from "react";

const Popup = () => {
  const [readingList, setReadingList] = useState([]);
  const [error, setError] = useState(null);
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    // Fetch reading list entries when the popup opens
    const fetchReadingList = async () => {
      try {
        const items = await chrome.readingList.query({});
        setReadingList(items);
      } catch (err) {
        setError("Failed to load the reading list.");
        console.error(err);
      }
    };

    fetchReadingList();
  }, []);

  // Function to fetch AI summary
  const fetchSummary = async (longText) => {
    const options = {
      sharedContext: 'This is a scientific article',
      type: 'key-points',
      format: 'markdown',
      length: 'medium',
    };

    try {
      const available = (await globalThis.ai.summarizer.capabilities()).available;
      let summarizer;

      if (available === 'no') {
        console.log("AI summarizer not available");
        return;
      }

      if (available === 'readily') {
        summarizer = await globalThis.ai.summarizer.create(options);
      } else {
        summarizer = await globalThis.ai.summarizer.create(options);
        summarizer.addEventListener('downloadprogress', (e) => {
          console.log(e.loaded, e.total);
        });
        await summarizer.ready;
      }

      const summary = await summarizer.summarize(longText, {
        context: 'This article is intended for a tech-savvy audience.',
      });
      return summary;

    } catch (error) {
      console.error("Error while fetching summary:", error);
    }
  };

  const handleSummarize = async (url) => {
    const item = readingList.find((item) => item.url === url);
    if (item) {
      const longText = `So How Do We Use Hooks
      The easiest way to describe Hooks is to show side-by-side examples of a class component that needs to have access to state and lifecycle methods, and another example where we achieve the same thing with a functional component.

      Below I provide a working example similar to those in the ReactJS docs, but one that you can touch and play around with, getting your hands dirty with a StackBlitz demo for each stage of our learning. So let's stop talking and start learning about React Hooks.

      The Benefits of Using Hooks
      Hooks have a lot of benefit to us as developers, and they are going to change the way we write components for the better. They already help us to write clearer and more concise code - it's like we went on a code diet and we lost a lot of weight and we look better and feel better. It brings out our jawline and makes us feel lighter on our toes. It's the one change that works for us. Just look at what React Hooks have done for others!`;

      const summary = await fetchSummary(longText);
      setSummaries((prevSummaries) => ({
        ...prevSummaries,
        [url]: summary,
      }));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Reading List all</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {readingList.length === 0 ? (
        <p className="text-gray-500">No items in the reading list.</p>
      ) : (
        <ul className="space-y-4">
          {readingList.map((item) => (
            <li key={item.url} className="border p-3 rounded shadow">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {item.url}
              </a>
              <p className="text-sm text-gray-600">
                {item.hasBeenRead ? "Read" : "Unread"}
              </p>
              {/* Button to trigger AI summary */}
              <button
                onClick={() => handleSummarize(item.url)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Get Summary
              </button>

              {/* Show AI Summary */}
              {summaries[item.url] && (
                <div className="mt-2">
                  <h3 className="font-bold">Summary:</h3>
                  <p className="text-sm text-gray-700">{summaries[item.url]}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Popup;
