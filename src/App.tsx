import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ListingDetail from './components/ListingDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
