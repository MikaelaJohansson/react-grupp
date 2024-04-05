import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import ActionForm from "./ActionForm";
import EditAction from "./EditAction";
import AuctionPage from "./AuctionPage";
import "./App.css";

function App() {
  return (
    <div>
      <NavLink to="/ActionForm">New Action</NavLink>
      <br />
      <NavLink to="/EditAction">Edit Actions</NavLink>
      <br />
      <NavLink to="/AuctionPage">Auction Page</NavLink>

      <Routes>
        <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
        <Route exact path="/ActionForm" element={<ActionForm />} />
        <Route exact path="/EditAction" element={<EditAction />} />
        <Route path="/AuctionPage" element={<AuctionPage />} />
      </Routes>
    </div>
  );
}

export default App;

