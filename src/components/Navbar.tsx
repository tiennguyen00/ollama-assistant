import { NavLink } from "react-router-dom";
import { useState } from "react";
import { toast, Bounce } from "react-toastify";

const Navbar = () => {
  const [showApiModal, setShowApiModal] = useState(false);
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("openai_api_key") || ""
  );

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("openai_api_key", apiKey.trim());
      toast.success("API key saved successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setShowApiModal(false);
    } else {
      toast.error("Please enter a valid API key", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <header className="flex justify-between w-full px-10 py-4">
      <NavLink to="/" className={"button"}>
        <p className="blue-gradient_text">Logo Assistant</p>
      </NavLink>

      <button
        onClick={() => setShowApiModal(true)}
        className="px-4 py-2 text-white transition-colors rounded-md button"
      >
        <p className="blue-gradient_text">Add API Key</p>
      </button>

      {showApiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-lg w-96">
            <h2 className="mb-4 text-xl font-bold">
              Enter Your OpenAI API Key
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Your API key is stored locally in your browser and is never sent
              to our servers.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveApiKey}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export { Navbar };
