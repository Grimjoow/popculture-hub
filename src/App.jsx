import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Explorer from './pages/Explorer'
import Watchlist from './pages/Watchlist'
import Detail from './pages/Detail'
import ScrollToTopButton from './components/ScrollToTopButton'


function App() {
  return (
    <BrowserRouter>
      <Header />

      <main className="container" style={{ padding: '18px 0 40px' }}>
        <Routes>
          <Route path="/" element={<Explorer />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/detail/:mediaType/:id" element={<Detail />} />
        </Routes>
      </main>
      <ScrollToTopButton />
    </BrowserRouter>
  )
}

export default App
