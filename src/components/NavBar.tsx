import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="flex w-full items-center justify-between">
      <Link to="/">
        <h1 className="text-2xl font-semibold text-neutral-300">TypeFast</h1>
      </Link>
      <AiOutlineUser
        className="text-neutral-500 transition-colors hover:text-white"
        size={30}
      />
    </nav>
  );
};

export default NavBar;
