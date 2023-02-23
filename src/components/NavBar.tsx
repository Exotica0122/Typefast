import { UserIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="flex justify-between items-center w-full">
      <Link to="/">
        <h1 className="text-2xl font-semibold text-neutral-300">TypeFast 2.0</h1>
      </Link>
      <UserIcon className="w-12 p-2 text-neutral-500 hover:text-white transition-colors" />
    </nav>
  );
}

export default NavBar;