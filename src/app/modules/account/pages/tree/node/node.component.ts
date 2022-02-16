import {Component, Input} from '@angular/core';

import {NodesListService} from '../services/nodesList.service'
import {TreeDiagramNode} from "../classes/node.class"
import {DomSanitizer} from "@angular/platform-browser"
import {TreeDiagramNodeMaker} from "../classes/node-maker.class"

@Component({
    selector: '[treeDiagramNode]',
    styleUrls: ['./node.component.scss'],
    templateUrl: './node.component.html',
})
export class Node {
    public node: TreeDiagramNode | TreeDiagramNodeMaker;
    public childrenTransform;
    public dropdownbtn: boolean;
    
    constructor(private nodesSrv: NodesListService, private sanitizer: DomSanitizer) {

    }
    onClickHandler() {
        // debugger;
        this.dropdownbtn = !this.dropdownbtn;
    }
    @Input() set treeDiagramNode(guid) {
       /*  debugger;
        this.dropdownbtn = !this.dropdownbtn; */
        this.node = this.nodesSrv.getNode(guid);
        console.log("node details _________" + this.node)
        // let calculation = `translate(calc(-50% + ${Math.round(this.node.width / 2)}px), 45px)`;
        let calculation = `translate(0%, 45px)`;
        if (document.getElementsByTagName('html')[0].getAttribute('dir') === 'rtl') {
            calculation = `translate(calc(50% - ${Math.round(this.node.width / 2)}px), 45px)`;
        }
        this.childrenTransform = this.sanitizer.bypassSecurityTrustStyle(calculation);
    }
}
