import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import ActionForm from "./ActionForm";
import EditAction from "./EditAction";
import AuctionPage from "./AuctionPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavLink to="/ActionForm">New Action</NavLink>
        <br />
        <NavLink to="/EditAction">Edit Actions</NavLink>
        <br />
        <NavLink to="/AuctionPage">Auction Page</NavLink>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<h1>Welcome to the Home Page</h1>} />
          <Route path="/ActionForm" element={<ActionForm />} />
          <Route path="/EditAction" element={<EditAction />} />
          <Route path="/AuctionPage" element={<AuctionPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
