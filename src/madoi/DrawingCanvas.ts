import { GetState, SetState, Share, ShareClass } from "madoi-client";

interface Drawing{
    prevX: number, prevY: number,
    x: number, y: number,
    size: number, color: string
}

@ShareClass({className: "DrawingCanvas"})
export class DrawingCanvas{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D | null = null;
    private size: number = 2;
    private color: string = "black";
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
        if (!this.drawing || this.ctx === null) return;
        let c = "#FFFFFF";
        let size = this.size;
        if (this.button === 0) {
            c = this.color;
        } else{
            size += 4;
        }
        this.draw(this.prevPos.x, this.prevPos.y, e.offsetX, e.offsetY, size, c);
        this.prevPos = {x: e.offsetX, y: e.offsetY};
    }

    private newCanvas(width: number, height: number): HTMLCanvasElement{
        const c = document.createElement("canvas");
        c.width = width;
        c.height = height;
        c.style.display = "none";
        document.body.appendChild(c);
        return c;
    }

    constructor(width: number = 640, height: number = 480){
        this.canvas = this.newCanvas(width, height);
        this.ctx = this.canvas.getContext("2d");
        if(this.ctx){
            this.ctx.fillStyle = "rgb(255, 255, 255)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "rgb(0, 0, 0)";
            this.ctx.font = "60px 'ＭＳ Ｐゴシック'";
            const _letter = ["A", "B", "C", "D"];
            this.ctx.fillText("ボード", 10, 70);
        }
    }

    setSize(size: number){
        this.size = size;
    }

    setColor(color: string){
        this.color = color;
    }

    attach(canvas: HTMLCanvasElement){
        this.ctx = canvas.getContext("2d");
        this.ctx?.drawImage(this.canvas, 0, 0);
        this.canvas.remove();
        this.canvas = canvas;

        const canvasMouseDownListener = (e: MouseEvent)=>this.canvasMouseDown(e);
        const canvasMouseUpListener = (e: MouseEvent)=>this.canvasMouseUp(e);
        const canvasMouseMoveListener = (e: MouseEvent)=>this.canvasMouseMove(e);
        this.canvas.addEventListener("mousedown", canvasMouseDownListener);
        this.canvas.addEventListener("mouseup", canvasMouseUpListener);
        this.canvas.addEventListener("mousemove", canvasMouseMoveListener);
        this.canvas.oncontextmenu = () => false;

        return ()=>{
            this.detach();
        }
    }

    detach(){
        this.canvas.removeEventListener("mousemove", this.canvasMouseMove);
        this.canvas.removeEventListener("mouseup", this.canvasMouseUp);
        this.canvas.removeEventListener("mousedown", this.canvasMouseDown);

        const c = this.newCanvas(this.canvas.width, this.canvas.height);
        this.ctx = c.getContext("2d");
        this.ctx?.drawImage(this.canvas, 0, 0);
        console.log(this.canvas);
        console.log(c);
        this.canvas = c;
    }

    @Share({maxLog: 100})
    draw(prevX: number, prevY: number, x: number, y: number, size: number, color: string) {
        if(this.loading){
            // 画像がロード中の場合は描画を後回しにする
            this.pendingDrawings.push({
                prevX: prevX, prevY: prevY,
                x: x, y: y, size: size, color: color
            });
        } else if(this.ctx){
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