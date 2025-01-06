import { useContext, useEffect, useRef } from "react";
import { useMadoiObject } from "./reactHelpers";
import { DrawingCanvas } from "./DrawingCanvas";
import { MadoiContext } from "../main";

export function Whiteboard(){
  const canvas = useRef<HTMLCanvasElement>(null!);
  const sizeInput = useRef<HTMLInputElement>(null!);
  const colorInput = useRef<HTMLInputElement>(null!);
  const madoi = useContext(MadoiContext);
  const dc = useMadoiObject(madoi, ()=>new DrawingCanvas(), false);
  useEffect(()=>{
    if(!dc || !canvas.current || !sizeInput.current || !colorInput.current) return;
    const detach = dc.attach(canvas.current, sizeInput.current, colorInput.current);
    return ()=>{
        detach();
    };
  }, [dc]);

  return <>
    <div>
      Size:  <input ref={sizeInput} type="number" defaultValue={2} min={1} max={10} step={1} required></input>
      Color: <input ref={colorInput} type="color"></input>
    </div>
    <canvas ref={canvas} width={640} height={480}></canvas>
  </>;
}
