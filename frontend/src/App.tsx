import 'react-toastify/dist/ReactToastify.css';

import { Router } from './base/Router';
import { ToastContainer } from 'react-toastify';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';

function App() {
  const { authState$ } = useStore();
  const authState = useObservableState(authState$);

  return (
    <div className="App">
      <Router authState={authState}></Router>
      <ToastContainer theme="dark" draggablePercent={30} hideProgressBar />
    </div>
  );
}

export default App;
