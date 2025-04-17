import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Navbar } from "./components";
import { Conversation } from "./pages";
import { Bounce } from "react-toastify";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <main className="flex flex-col w-full min-h-screen">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Conversation />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </main>
  );
}

export default App;
