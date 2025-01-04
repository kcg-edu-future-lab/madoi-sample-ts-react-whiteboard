import { createContext } from 'react'
import './App.css'
import { Madoi } from './madoi/madoi';
import { WhiteBoard } from './madoi/WhiteBoard';

export const madoiContext = createContext<Madoi | null>(null);

export default function App() {
  const roomId = "madoi-sample-ts-react-whiteboard-amvkajn33d";
  const apikey = "ahfuTep6ooDi7Oa4";
  const madoi = new Madoi(
    `ws://localhost:8080/madoi/rooms/${roomId}`,
    apikey);

  return (
    <div>
      <madoiContext.Provider value={madoi}>
        <WhiteBoard />
      </madoiContext.Provider>
    </div>
  )
}
