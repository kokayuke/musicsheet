import { Routes, Route, Link } from 'react-router-dom';
import Todo from './pages/Todo';
import MusicSheet from './pages/MusicSheet';
import Visualizer from './pages/Visualizer';

function App() {
  return (
    <div>
      {/* ページリンク */}
      <nav>
        <Link to="/todo">Todo</Link> | <Link to="/musicsheet">MusicSheet</Link> | <Link to="/visualizer">Visualizer</Link>
      </nav>

      {/* URLごとの表示 */}
      <Routes>
        <Route path="/todo" element={<Todo />} />
        <Route path="/musicsheet" element={<MusicSheet />} />
        <Route path="/visualizer" element={<Visualizer />} />
      </Routes>
    </div>
  );
}

export default App;