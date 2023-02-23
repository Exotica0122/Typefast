import { AiFillGithub, AiOutlineBranches } from "react-icons/ai";
const Footer = () => {
  return (
    <footer className="flex justify-between items-center">

      <div className="flex justify-between items-center">
        <a
          className="card flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
          href="https://github.com/Exotica0122/Typefast2.0"
          target="_blank"
        >
          <AiFillGithub size={25} />
          <p>Github</p>
        </a>
      </div>

      <div className="flex justify-between items-center">
        <a
          className="card flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
          href="https://github.com/Exotica0122/Typefast2.0"
          target="_blank"
        >
          <AiOutlineBranches size={25} />
          <p>v0.0.1 alpha</p>
        </a>
      </div>

    </footer>
  );
}

export default Footer;