import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Navbar } from "./components";
import { Conversation } from "./pages";

function App() {
  return (
    <main className="flex flex-col w-full min-h-screen">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Conversation />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
