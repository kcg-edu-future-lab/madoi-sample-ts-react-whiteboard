import { ChangeEventHandler, useEffect, useRef } from "react";
import { DrawingCanvas } from "./DrawingCanvas";

interface Props{
  canvas: DrawingCanvas | null;
}
export function Whiteboard({canvas: dc}: Props){
  const canvas = useRef<HTMLCanvasElement>(null!);
  const onChangeSize: ChangeEventHandler<HTMLInputElement> = e=>{
    dc?.setSize(parseInt(e.target.value));
  };
  const onChangeColor: ChangeEventHandler<HTMLInputElement> = e=>{
    dc?.setColor(e.target.value);
  };
  useEffect(()=>{
    if(!dc || !canvas.current) return;
    const detach = dc.attach(canvas.current);
    return ()=>{
        detach();
    };
  }, [dc]);

  return <>
    <div>
      Size:  <input onChange={onChangeSize} type="number" defaultValue={2} min={1} max={10} step={1} required></input>
      Color: <input onChange={onChangeColor} type="color"></input>
    </div>
    <canvas ref={canvas} width={640} height={480}></canvas>
  </>;
}
