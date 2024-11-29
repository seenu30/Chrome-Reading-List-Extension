/* global chrome */
import React, { useState, useEffect } from "react";
import AIComponent from "./AIComponent";

const Popup = () => {
  const [readingList, setReadingList] = useState([]);
  const [error, setError] = useState(null);
  const [summaries, setSummaries] = useState({});
  const [selectedLink, setSelectedLink] = useState(null); // To track the selected link

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

  const handleSummaryGenerated = (url, summary) => {
    setSummaries((prevSummaries) => ({
      ...prevSummaries,
      [url]: summary,
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Reading List</h1>
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

              {/* AI Component */}
              <AIComponent
                url={item.url}
                onSummaryGenerated={(summary) =>
                  handleSummaryGenerated(item.url, summary)
                }
                onLinkSelected={(link) => setSelectedLink(link)} // Callback for selected link
              />

              {/* Show selected link */}
              {selectedLink === item.url && (
                <div className="text-sm text-gray-600 mt-2">
                  <strong>Selected Link:</strong> {item.url}
                </div>
              )}

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
