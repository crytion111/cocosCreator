// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class drawShadow extends cc.Component {

    @property(cc.Graphics)
    gra: cc.Graphics = null;


    start ()
    {
        this.gra.moveTo(0, 0);
        this.gra.lineTo(141.421, 141.421);
        this.gra.lineTo(-141.421, 141.421);
        this.gra.arc(0, 0, 200, 0.25*Math.PI, 0.75*Math.PI, true);
        this.gra.fill();
        this.gra.stroke();
    }

    // update (dt) {}
}
