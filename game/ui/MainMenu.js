export default class MainMenu {
    constructor(startCallback) {
        this.dom = document.createElement("div");
        this.dom.style.position = "absolute";
        this.dom.style.background = "rgba(0,0,0,0.7)";
        this.dom.style.width = "100%";
        this.dom.style.height = "100%";
        this.dom.style.display = "flex";
        this.dom.style.justifyContent = "center";
        this.dom.style.alignItems = "center";

        const btn = document.createElement("button");
        btn.innerText = "Start Game";
        btn.style.fontSize = "24px";
        btn.onclick = () => {
            document.body.removeChild(this.dom);
            startCallback();
        };

        this.dom.appendChild(btn);
        document.body.appendChild(this.dom);
    }
}
