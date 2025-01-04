import { useContext, useEffect, useRef } from "react";
import { useMadoiObject } from "./reactHelpers";
import { madoiContext } from "../App";
import { DrawingCanvas } from "./DrawingCanvas";

export function WhiteBoard(){
  const canvas = useRef<HTMLCanvasElement>(null!);
  const sizeInput = useRef<HTMLInputElement>(null!);
  const colorInput = useRef<HTMLInputElement>(null!);
  const madoi = useContext(madoiContext);
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
