import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import ActionForm from './ActionForm';
import MyActions from './MyActions';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavLink to="/ActionForm">New Action</NavLink>
        <br />
        <NavLink to="/MyActions">My Actions</NavLink>
      </div>
      <div>
        <Routes>
          <Route path="/ActionForm" element={<ActionForm />} />
          <Route path="/MyActions" element={<MyActions />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

