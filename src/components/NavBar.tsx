import { AiOutlineUser } from "react-icons/ai"
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center w-full">
      <Link to="/">
        <h1 className="font-semibold text-neutral-300 text-2xl">TypeFast 2.0</h1>
      </Link>
      <AiOutlineUser className="text-neutral-500 hover:text-white transition-colors" size={30} />
    </nav>
  );
}

export default NavBar;