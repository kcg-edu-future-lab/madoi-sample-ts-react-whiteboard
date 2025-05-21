import { GetState, SetState, Share, ShareClass, TypedEventTarget } from "madoi-client";

class Dragging extends TypedEventTarget<Dragging,
    {dragging: {prevX: number, prevY: number, x: number, y: number, button: number}}>{
    private _dragging: boolean = false;
    private button: number = 0;
    private prevPos = { x: 0, y: 0 };
    private mouseDownListener = (e: MouseEvent)=>this.mouseDown(e);
    private mouseMoveListener = (e: MouseEvent)=>this.mouseMove(e);
    private mouseUpListener = (e: MouseEvent)=>this.mouseUp(e);

    get dragging(){
        return this._dragging;
    }

    attach(canvas: HTMLCanvasElement){
        canvas.addEventListener("mousedown", this.mouseDownListener);
        canvas.addEventListener("mousemove", this.mouseMoveListener);
        canvas.addEventListener("mouseup", this.mouseUpListener);
    }

    detach(canvas: HTMLCanvasElement){
        canvas.removeEventListener("mousedown", this.mouseDownListener);
        canvas.removeEventListener("mousemove", this.mouseMoveListener);
        canvas.removeEventListener("mouseup", this.mouseUpListener);
    }

    private mouseDown(e: MouseEvent){
        this._dragging = true;
        this.button = e.button;
        this.prevPos.x = e.offsetX;
        this.prevPos.y = e.offsetY;
        e.preventDefault();
    }

    private mouseMove(e: MouseEvent){
        if (!this._dragging) return;
        this.dispatchCustomEvent("dragging", {
            prevX: this.prevPos.x, prevY: this.prevPos.y,
            x: e.offsetX, y: e.offsetY, button: this.button});
        this.prevPos = {x: e.offsetX, y: e.offsetY};
    }

    private mouseUp(e: MouseEvent){
        this._dragging = false;
        e.preventDefault();
    }
}

interface DrawParam{
    prevX: number, prevY: number,
    x: number, y: number,
    size: number, color: string
}

@ShareClass({className: "DrawingCanvas"})
export class DrawingCanvas{
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private size: number = 2;
    private color: string = "black";
    private dragging = new Dragging();
    private loading: boolean = false;
    private pendingDrawings = new Array<DrawParam>();

    constructor(){
        this.dragging.addEventListener("dragging", ({detail})=>{
            let c = "#FFFFFF";
            let size = this.size;
            if (detail.button === 0) {
                c = this.color;
            } else{
                size += 4;
            }
            this.draw(detail.prevX, detail.prevY,
                detail.x, detail.y, size, c);
        });
    }

    private processPengingDrawings(){
        if(!this.ctx) return;
        for(const p of this.pendingDrawings){
            this.doDraw(p.prevX, p.prevY, p.x, p.y, p.size, p.color);
        }
        this.pendingDrawings = new Array(); 
    }

    private doDraw(prevX: number, prevY: number, x: number, y: number, size: number, color: string) {
        if(!this.ctx) return;
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = size;
        this.ctx.moveTo(prevX, prevY);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }

    @Share({maxLog: 100})
    draw(prevX: number, prevY: number, x: number, y: number, size: number, color: string) {
        if(this.loading){
            // 画像がロード中の場合は描画を後回しにする
            this.pendingDrawings.push({
                prevX, prevY, x, y, size, color
            });
        } else if(this.ctx){
            this.doDraw(prevX, prevY, x, y, size, color);
        }
    }

    setSize(size: number){
        this.size = size;
    }

    setColor(color: string){
        this.color = color;
    }

    attach(canvas: HTMLCanvasElement){
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        if(this.ctx){
            this.ctx.fillStyle = "rgb(255, 255, 255)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "rgb(0, 0, 0)";
            this.ctx.font = "60px 'ＭＳ Ｐゴシック'";
            this.ctx.fillText("ボード", 10, 70);
        }
        this.dragging.attach(canvas);
        this.canvas.oncontextmenu = () => false;

        return ()=>{
            this.detach();
        }
    }

    detach(){
        if(this.canvas) this.dragging.detach(this.canvas);
        this.canvas = null;
    }
  
    @GetState({maxInterval: 10000, maxUpdates: 100})
    getState(): string {
        return this.canvas?.toDataURL("image/png") || "";
    }
  
    @SetState()
    setState(state: string) {
        this.loading = true;
        const img = new Image();
        img.onload = () => {
            if(this.ctx === null) return;
            this.ctx.drawImage(img, 0, 0);
            this.processPengingDrawings()
            this.loading = false;
        };
        img.src = state;
    }
}
