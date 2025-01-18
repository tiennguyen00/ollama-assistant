import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Navbar } from "./components";
import { About, Conversation, Home, User } from "./pages";

function App() {
  return (
    <main>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/conversation" element={<Conversation />} />
          <Route path="/about" element={<About />} />
          <Route path="/userPref" element={<User />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
