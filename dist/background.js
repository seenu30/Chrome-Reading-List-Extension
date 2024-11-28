chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.readingList.onEntryAdded.addListener((entry) => {
  console.log('New reading list entry added:', entry);
});

chrome.readingList.onEntryUpdated.addListener((entry) => {
  console.log('Reading list entry updated:', entry);
});

chrome.readingList.onEntryRemoved.addListener((entry) => {
  console.log('Reading list entry removed:', entry);
});
