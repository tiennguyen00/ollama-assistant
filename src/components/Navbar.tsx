import { NavLink } from "react-router-dom";
const Navbar = () => {
  const navClass = "nav-link font-lato tracking-widest",
    navClassActive = "text-blue-dark underline";
  return (
    <header className="flex justify-between w-full px-10 py-4">
      <NavLink to="/" className={"button"}>
        <p className="blue-gradient_text">Logo Assistant</p>
      </NavLink>
      <nav className="flex-col hidden gap-12 text-lg font-extrabold md:flex md:flex-row">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${navClass} ${navClassActive}` : navClass
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/conversation"
          className={({ isActive }) =>
            isActive ? `${navClass} ${navClassActive}` : navClass
          }
        >
          Conversation
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? `${navClass} ${navClassActive}` : navClass
          }
        >
          About
        </NavLink>
      </nav>
    </header>
  );
};

export { Navbar };
