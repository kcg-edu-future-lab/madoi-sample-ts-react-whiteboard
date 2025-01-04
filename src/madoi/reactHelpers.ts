import { useEffect, useRef, useState } from "react";
import { Madoi } from "./madoi";

export function useMadoiObject<T>(madoi: Madoi | null, factory: ()=>T, rerenderOnStateChange = true): T | null {
  const value = useRef<T>(null!);
  const [_state, setState] = useState<any>();

  useEffect(()=>{
    if(madoi === null || value.current !== null) return;
    const obj = factory() as any;
    value.current = obj;
    let getStateMethod = null;
    for(let p of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))){
      const cfg = obj[p].madoiMethodConfig_;
      if(!cfg) continue;
      if(cfg["getState"]){
        getStateMethod = obj[p];
      }
    }
    if(getStateMethod == null){
      throw new Error(`${typeof obj} must declare @GetState method.`);
    }
    for(let p of Object.getOwnPropertyNames(Object.getPrototypeOf(obj))){
      const cfg = obj[p].madoiMethodConfig_;
      if(!cfg) continue;
      if(cfg["share"]){
        const shareMethod = obj[p];
        const f = function(){
          shareMethod.apply(obj, arguments);
          if(rerenderOnStateChange) setState(getStateMethod.apply(obj));
        };
        f.madoiMethodConfig_ = cfg;
        obj[p] = f;
      } else if(cfg["setState"]){
        const setStateMethod = obj[p];
        const f = function(){
          setStateMethod.apply(obj, arguments);
          if(rerenderOnStateChange) setState(getStateMethod.apply(obj));
        };
        f.madoiMethodConfig_ = cfg;
        obj[p] = f;
      }
    }
    madoi.register(obj);
    setState(getStateMethod.apply(obj));
  }, []);

  return value.current;
}
