import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import ActionForm from './ActionForm';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div>
        <NavLink to="/ActionForm">ActionForm</NavLink>
      </div>
      <div>
        <Routes>
          <Route path="/ActionForm" element={<ActionForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

