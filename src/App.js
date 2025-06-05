import { useState, useEffect } from "react";
import books from "./books.json";

export default function AudiobookSync() {
  const bookTitles = Object.keys(books);
  const [selectedBook, setSelectedBook] = useState(bookTitles[0]);
  const [pageInput, setPageInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [result, setResult] = useState(null);

  const bookData = books[selectedBook];

  const findClosestBefore = (arr, key, value) => {
    const sorted = [...arr].sort((a, b) => a[key] - b[key]);
    let closest = null;
    for (let item of sorted) {
      if (item[key] <= value) closest = item;
      else break;
    }
    return closest;
  };

  const searchByPage = () => {
    const pageNum = parseInt(pageInput);
    if (!isNaN(pageNum)) {
      const match = findClosestBefore(bookData, "page", pageNum);
      setResult(match || { error: "No earlier match found." });
    }
  };

  const searchByTime = () => {
    const time = parseFloat(timeInput);
    if (!isNaN(time)) {
      const match = findClosestBefore(bookData, "start_min", time);
      setResult(match || { error: "No earlier match found." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">📖 Audiobook ↔ Book Sync</h1>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1 text-gray-700">Select Book</label>
          <select
            value={selectedBook}
            onChange={(e) => {
              setSelectedBook(e.target.value);
              setResult(null);
              setPageInput("");
              setTimeInput("");
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {bookTitles.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Page Number</label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-md p-2"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
            />
            <button
              onClick={searchByPage}
              className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-semibold"
            >
              Find by Page
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">Time (min)</label>
            <input
              type="number"
              step="0.1"
              className="w-full border border-gray-300 rounded-md p-2"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
            />
            <button
              onClick={searchByTime}
              className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white rounded-md py-2 font-semibold"
            >
              Find by Time
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-300 rounded-md">
            {result.error ? (
              <p className="text-red-600">{result.error}</p>
            ) : (
              <div className="text-sm text-gray-800 space-y-1">
                <p><strong>Chapter:</strong> {result.chapter}</p>
                <p><strong>Excerpt:</strong> {result.excerpt}</p>
                <p><strong>Starts on Page:</strong> {result.page}</p>
                <p><strong>Audio Start:</strong> {result.start_min} min</p>
                {result.mp3_number && <p><strong>MP3 File:</strong> #{result.mp3_number}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}