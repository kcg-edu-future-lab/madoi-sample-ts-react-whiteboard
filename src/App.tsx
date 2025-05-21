import { createContext, useContext } from 'react';
import './App.css'
import { Whiteboard } from './components/Whiteboard';
import { Madoi } from 'madoi-client';
import { useSharedModel } from 'madoi-client-react';
import { DrawingCanvas } from './components/model/DrawingCanvas';
import { madoiKey, madoiUrl } from './keys';

const roomId = "madoi-sample-ts-react-whiteboard-amvkajn33d";
export const MadoiContext = createContext(new Madoi(
  `${madoiUrl}/${roomId}`, madoiKey
));

export default function App() {
  const madoi = useContext(MadoiContext);
  const dc = useSharedModel(madoi, ()=>new DrawingCanvas());

  return <Whiteboard canvas={dc} />;
}
