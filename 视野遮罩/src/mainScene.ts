// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class mainScene extends cc.Component {

    @property(cc.Node)
    nodePlayer:cc.Node = null;

    @property([cc.Node])
    nodeWallRootArr:cc.Node[] = [];

    @property(cc.Graphics)
    graphicsLine:cc.Graphics = null;


    start ()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(touch:cc.Touch)
    {
        let posTouch = touch.getLocation();
        let posPlayer = this.nodePlayer.parent.convertToNodeSpaceAR(posTouch);
        this.nodePlayer.position = cc.v3(posPlayer.x, posPlayer.y);

        this.showGraLines();
    }
    onTouchMove(touch:cc.Touch)
    {
        let posTouch = touch.getLocation();
        let posPlayer = this.nodePlayer.parent.convertToNodeSpaceAR(posTouch);
        this.nodePlayer.position = cc.v3(posPlayer.x, posPlayer.y);

        this.showGraLines();
    }
    onTouchEnd(touch:cc.Touch)
    {

    }



    // 传入矩形, 返回4个点
    getRectFourPoint(node:cc.Node) : cc.Vec3[]
    {
        let nWidth = node.width / 2;
        let nHeight = node.height / 2;

        let p1 = node.convertToWorldSpaceAR(cc.v3(-nWidth, -nHeight));   //左下
        let p2 = node.convertToWorldSpaceAR(cc.v3(+nWidth, -nHeight));   //右下
        let p3 = node.convertToWorldSpaceAR(cc.v3(+nWidth, +nHeight));   //右上
        let p4 = node.convertToWorldSpaceAR(cc.v3(-nWidth, +nHeight));   //左上

        let posArr = [p1, p2, p3, p4]
        return posArr;
    }


    // 检测矩形和某个点的边界. 找出夹角最大的两个角
    checkRectEdge(posArr:cc.Vec3[], posPlayer:cc.Vec3, targetNode:cc.Node): cc.Vec3[]
    {
        // 存放向量用于计算
        let angleArr:cc.Vec3[] = [];
        for (let tempWorldPos of posArr)
        {
            let tempPos = targetNode.parent.convertToNodeSpaceAR(tempWorldPos);

            let deX = tempPos.x - posPlayer.x
            let deY = tempPos.y - posPlayer.y
            angleArr.push(cc.v3(deX, deY));
        }


        let nMaxAngle = 0;
        let nMaxIndex = 0;
        let nMinIndex = 0;

        // 计算向量夹角,看看谁最大
        for (let i = 0; i < angleArr.length; i++)
        {
            let pos1 = angleArr[i];
            for (let j = i + 1; j < angleArr.length; j++)
            {
                let pos2 = angleArr[j];
                let cosO = ((pos2.x * pos1.x)+(pos2.y * pos1.y)) / (pos1.mag() * pos2.mag())
                let nJiaJiao = Math.acos(cosO) * (180 / Math.PI)

                if (nJiaJiao > nMaxAngle)
                {
                    nMaxAngle = nJiaJiao;
                    nMaxIndex = i;
                    nMinIndex = j;
                }
            }
        }

        return [targetNode.parent.convertToNodeSpaceAR(posArr[nMaxIndex]),
            targetNode.parent.convertToNodeSpaceAR(posArr[nMinIndex])];
    }



    showGraLines()
    {
        this.graphicsLine.clear();
        let posPlayer = this.nodePlayer.position;

        this.nodeWallRootArr.forEach((nodeRoot, index) =>
        {
            let nodeWall = nodeRoot.getChildByName("nodeWall")
            let posArr = this.getRectFourPoint(nodeWall);
            let drawPosArr = this.checkRectEdge(posArr, posPlayer, this.nodePlayer);
            // this.graphicsLine.moveTo(posPlayer.x, posPlayer.y);

            this.graphicsLine.moveTo(drawPosArr[0].x, drawPosArr[0].y);
            for (let i in drawPosArr)
            {
                let pos = drawPosArr[i];
                let pos1111 = cc.v3((pos.x - posPlayer.x) * 99, (pos.y - posPlayer.y) * 99);
                this.graphicsLine.lineTo(posPlayer.x + pos1111.x, posPlayer.y + pos1111.y);
            }
            this.graphicsLine.lineTo(drawPosArr[1].x, drawPosArr[1].y);
        })

        this.graphicsLine.fill();
        this.graphicsLine.stroke();
    }
}
