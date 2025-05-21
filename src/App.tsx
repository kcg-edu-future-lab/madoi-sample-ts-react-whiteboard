import { createContext, useContext } from 'react';
import './App.css'
import { Whiteboard } from './madoi/Whiteboard';
import { Madoi } from 'madoi-client';
import { useSharedModel } from 'madoi-client-react';
import { DrawingCanvas } from './madoi/DrawingCanvas';

export const madoiUrl = "wss://fungo.kcg.edu/madoi-20241213/rooms";
export const madoiKey = "ahfuTep6ooDi7Oa4";
const roomId = "madoi-sample-ts-react-whiteboard-amvkajn33d";
export const MadoiContext = createContext(new Madoi(
  `${madoiUrl}/${roomId}`, madoiKey
//  `ws://localhost:8080/madoi/rooms/${roomId}`, apikey
));

export default function App() {
  const madoi = useContext(MadoiContext);
  const dc = useSharedModel(madoi, ()=>new DrawingCanvas(), false);

  return <Whiteboard canvas={dc} />;
}
