import { createContext, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Madoi } from './madoi/madoi.ts';

const roomId = "madoi-sample-ts-react-whiteboard-amvkajn33d";
const apikey = "ahfuTep6ooDi7Oa4";
export const madoiContext = createContext<Madoi>(new Madoi(
  `ws://localhost:8080/madoi/rooms/${roomId}`,
  apikey));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
