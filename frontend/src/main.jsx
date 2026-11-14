import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './index.css'
import App from './App.jsx'
import { NetworkProvider } from './store/networkStore.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReactFlowProvider>
      <NetworkProvider>
        <App />
      </NetworkProvider>
    </ReactFlowProvider>
  </StrictMode>,
)
