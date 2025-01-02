import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Advice from "./Advice";

function App() {
  const [advice, setAdvice] = useState([]);
  const [first, setFirst] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("Choose"); // Default category
  const [fetchTrigger, setFetchTrigger] = useState(false); // For resetting or re-fetching

  const categories = [
    "Choose",
    "SelfHelp",
    "Spirituality",
    "Health",
    "Relationships",
    "Finance",
  ];

  const cuteAdvices = [
    "Smile, it confuses people!",
    "Be the reason someone believes in goodness today.",
    "Kindness costs nothing, sprinkle it everywhere!",
    "You’re doing amazing, don’t stop now.",
    "Dream big, the world needs your magic!",
  ];

  const fetchAdvice = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/advice?category=${category}`
      );
      setAdvice(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching advice:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Set today's date
    const today = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(today.toLocaleDateString(undefined, options));
  }, [fetchTrigger]);

  const handleReset = () => {
    setFirst(true);
    setCategory("Choose");
    setFetchTrigger((prev) => !prev);
  };

  const handleSubmit = () => {
    if(category === "Choose") return
    fetchAdvice();
    setFirst(false);
    setFetchTrigger((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="md:w-1/3 border-b md:border-r border-gray-300 md:pr-4 md:pb-0 pb-4">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-4 text-center md:text-left">
            Daily Life Advice
          </h1>
          <p className="text-gray-500 mb-6 text-center md:text-left">
            {currentDate}
          </p>

          {/* Category Dropdown */}
          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-gray-700 font-semibold mb-2"
            >
              Select a Category:
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons for Submit and Reset */}
          <div className="flex justify-between mb-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
            <button
              onClick={handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition duration-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-2/3 pl-0 md:pl-4">
          {first ? (
            <div>
              <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center md:text-left">
                Welcome to Daily Life Advice!
              </h2>
              <p className="text-gray-700 text-center md:text-left">
                Choose a category from the dropdown and click on the Submit
                button to receive advice from a random book in that category.
                Click on Reset to go back to the default category.
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center mt-12">
              <ReactLoading
                type="spinningBubbles"
                color="#3b82f6"
                height={70}
                width={70}
              />
              <p className="mt-4 text-gray-600 text-center">
                {cuteAdvices[Math.floor(Math.random() * cuteAdvices.length)]}
              </p>
            </div>
          ) : (
            <Advice advice={advice} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
