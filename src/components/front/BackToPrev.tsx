import { Link, useLocation } from "react-router-dom";

const BackToPrev: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav className="text-sm text-gray-600 mb-4">
      <ul className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:underline text-blue-600 text-lg ">Главная</Link>
        </li>
        {pathnames.map((segment : string, index : number) => {
          const path = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          return (
            <li key={segment} className="flex items-center space-x-2">
              <span>/</span>
              {isLast ? (
                <span className="capitalize text-gray-700 text-lg">{decodeURIComponent(segment)}</span>
              ) : (
                <Link to={path} className="capitalize  text-blue-600 text-lg">
                  {decodeURIComponent(segment)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BackToPrev;