import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
    <div>Hey</div>
    <Link to="/login" className="text-blue-600 hover:underline">
      Go to Login
    </Link>
    </>
  );
};

export default Home;