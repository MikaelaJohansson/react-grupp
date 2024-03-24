import { Routes, Route } from "react-router-dom";
import Home from "../routes/Home";
import About from "../routes/About";
import AuctionPage from "../routes/AuctionPage";

const Switch = () => {
  return (
    <div className="routes">
      {/*React Router för att definera vägar */}
      <Routes>
        {/*Våra vägar till våra olika komponenter */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/auctionpage" element={<AuctionPage />} />
        {/*lägga till flera routes. Glöm inte att importera dem också */}
      </Routes>
    </div>
  );
};
export default Switch;
