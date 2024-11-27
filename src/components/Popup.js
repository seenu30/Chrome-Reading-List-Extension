/* global chrome */
import React, { useState } from 'react';

const Popup = () => {
  const [readingList, setReadingList] = useState([]);

  const fetchReadingList = () => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      const readingListFolder = bookmarkTreeNodes[0].children.find(
        (folder) => folder.title === 'Reading List'
      );

      if (readingListFolder && readingListFolder.children) {
        setReadingList(readingListFolder.children);
      } else {
        console.log('Reading List not found');
      }
    });
  };

  return (
    <div className="p-4 min-w-[300px]">
      <h1 className="text-xl font-bold mb-4">Reading List Summarizer</h1>
      <button
        onClick={fetchReadingList}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded mb-4"
      >
        Fetch Reading List
      </button>
      <ul className="list-disc pl-5">
        {readingList.map((item, index) => (
          <li key={index} className="mb-2">
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Popup;
