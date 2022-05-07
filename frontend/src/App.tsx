import 'react-toastify/dist/ReactToastify.css';

import { Router } from './base/Router';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { useAuthRepository } from './helpers/repositories/useAuthRepo';
import { useStore } from '@store';
import { useObservableState } from 'observable-hooks';

function App() {
  // const authRepo = useAuthRepository();
  const { authState$ } = useStore();
  const authState = useObservableState(authState$);

  return (
    <div className="App">
      <Router authState={authState}></Router>
      <ToastContainer
        theme="dark"
        autoClose={false}
        draggablePercent={30}
        hideProgressBar
      />
    </div>
  );
}

export default App;
