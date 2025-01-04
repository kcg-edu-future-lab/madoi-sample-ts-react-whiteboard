import { GetState, SetState, Share, ShareClass } from "./madoi";

interface Drawing{
    prevX: number, prevY: number,
    x: number, y: number,
    size: number, color: string
}

@ShareClass({className: "DrawingCanvas"})
export class DrawingCanvas{
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private colorInput: HTMLInputElement | null = null;
    private sizeInput: HTMLInputElement | null = null;
    private drawing: boolean = false;
    private button: number = 0;
    private prevPos = { x: 0, y: 0 };
    private loading: boolean = false;
    private pendingDrawings = new Array<Drawing>();

    private canvasMouseDown(e: MouseEvent){
        if(this.ctx === null) return;
        this.drawing = true;
        this.button = e.button;
        this.prevPos.x = e.offsetX;
        this.prevPos.y = e.offsetY;
        this.ctx.lineCap = 'round';
        e.preventDefault();
    }

    private canvasMouseUp(e: MouseEvent){
        this.drawing = false;
        e.preventDefault();
    }

    private canvasMouseMove(e: MouseEvent){
        if (!this.drawing || this.ctx === null || this.sizeInput === null || this.colorInput === null) return;
        let c = "#FFFFFF";
        let size = parseInt(this.sizeInput.value);
        if (this.button === 0) {
            c = this.colorInput.value;
        } else{
            size += 4;
        }
        this.draw(this.prevPos.x, this.prevPos.y, e.offsetX, e.offsetY, size, c);
        this.prevPos = {x: e.offsetX, y: e.offsetY};
    }

    attach(canvas: HTMLCanvasElement, sizeInput: HTMLInputElement, colorInput: HTMLInputElement) : ()=>void{
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        const canvasMouseDownListener = (e: MouseEvent)=>this.canvasMouseDown(e);
        const canvasMouseUpListener = (e: MouseEvent)=>this.canvasMouseUp(e);
        const canvasMouseMoveListener = (e: MouseEvent)=>this.canvasMouseMove(e);
        this.canvas.addEventListener("mousedown", canvasMouseDownListener);
        this.canvas.addEventListener("mouseup", canvasMouseUpListener);
        this.canvas.addEventListener("mousemove", canvasMouseMoveListener);
        this.canvas.oncontextmenu = () => false;
        this.sizeInput = sizeInput;
        this.colorInput = colorInput;
        return ()=>{
            this.canvas?.removeEventListener("mousedown", canvasMouseDownListener);
            this.canvas?.removeEventListener("mouseup", canvasMouseUpListener);
            this.canvas?.removeEventListener("mousemove", canvasMouseMoveListener);
        }
    }

    detach(){
        this.sizeInput = null;
        this.colorInput = null;
        if(this.canvas === null) return;
        this.canvas.removeEventListener("mousemove", this.canvasMouseMove);
        this.canvas.removeEventListener("mouseup", this.canvasMouseUp);
        this.canvas.removeEventListener("mousedown", this.canvasMouseDown);
        this.canvas = null;
    }

    @Share({maxLog: 100})
    draw(prevX: number, prevY: number, x: number, y: number, size: number, color: string) {
        if(this.loading || this.ctx === null){
            // 画像がロード中の場合は描画を後回しにする
            this.pendingDrawings.push({
                prevX: prevX, prevY: prevY,
                x: x, y: y, size: size, color: color
            });
        } else {
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = size;
            this.ctx.moveTo(prevX, prevY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
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
            for(const p of this.pendingDrawings){
                this.ctx.beginPath();
                this.ctx.strokeStyle = p.color;
                this.ctx.lineWidth = p.size;
                this.ctx.moveTo(p.prevX, p.prevY);
                this.ctx.lineTo(p.x, p.y);
                this.ctx.stroke();
            }
            this.pendingDrawings = new Array();
            this.loading = false;
        };
        img.src = state;
    }
}