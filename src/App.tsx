import { createContext, useContext } from 'react';
import './App.css'
import { Whiteboard } from './madoi/Whiteboard';
import { Madoi } from './madoi/madoi';
import { useMadoiObject } from './madoi/reactHelpers';
import { DrawingCanvas } from './madoi/DrawingCanvas';

const roomId = "madoi-sample-ts-react-whiteboard-amvkajn33d";
const apikey = "ahfuTep6ooDi7Oa4";
export const MadoiContext = createContext(new Madoi(
  `ws://localhost:8080/madoi/rooms/${roomId}`, apikey
));

export default function App() {
  const madoi = useContext(MadoiContext);
  const dc = useMadoiObject(madoi, ()=>new DrawingCanvas(), false);

  return <Whiteboard canvas={dc} />;
}
