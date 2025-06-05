import { useState } from "react";
import data from "./data.json";

export default function AudiobookSync() {
  const [pageInput, setPageInput] = useState("");
  const [timeInput, setTimeInput] = useState("");
  const [result, setResult] = useState(null);

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
      const match = findClosestBefore(data, "page", pageNum);
      setResult(match || { error: "No earlier match found." });
    }
  };

  const searchByTime = () => {
    const time = parseFloat(timeInput);
    if (!isNaN(time)) {
      const match = findClosestBefore(data, "start_min", time);
      setResult(match || { error: "No earlier match found." });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Audiobook ↔ Book Sync</h1>
      <p className="mb-4 text-gray-700">
        Enter a page number or time in minutes. This tool will return the <strong>closest earlier chapter</strong> based on your input.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium">Enter Page Number:</label>
        <input
          type="number"
          className="border p-2 w-full"
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
        />
        <button onClick={searchByPage} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Find Closest Chapter by Page
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Enter Time (min):</label>
        <input
          type="number"
          step="0.1"
          className="border p-2 w-full"
          value={timeInput}
          onChange={(e) => setTimeInput(e.target.value)}
        />
        <button onClick={searchByTime} className="mt-2 px-4 py-2 bg-green-600 text-white rounded">
          Find Closest Chapter by Time
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <div>
              <p><strong>Closest Chapter:</strong> {result.chapter}</p>
              <p><strong>Excerpt:</strong> {result.excerpt}</p>
              <p><strong>Starts on Page:</strong> {result.page}</p>
              <p><strong>Starts at:</strong> {result.start_min} min</p>
              <p><strong>MP3 File:</strong> #{result.mp3_number}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

