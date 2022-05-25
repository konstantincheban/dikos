import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { StoreProvider } from '@store';
import './index.scss';
import { ModalAPIProvider } from './helpers/modalAPI/modalAPI';
import { TooltipProvider } from '@base/Tooltip';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <BrowserRouter>
    <StoreProvider>
      <TooltipProvider>
        <ModalAPIProvider>
          <App />
        </ModalAPIProvider>
      </TooltipProvider>
    </StoreProvider>
  </BrowserRouter>,
);
