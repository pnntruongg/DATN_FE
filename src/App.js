import './App.css';
import { useEffect } from 'react';
import Routers from './routes';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  useEffect(() => {
    document.title = "Album"
  }, [])

  return (
    <Routers>
    </Routers>
  );
}

export default App;
