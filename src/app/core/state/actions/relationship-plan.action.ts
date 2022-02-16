import { Action } from '@ngrx/store';
import { RelationshipPlanTab } from '@app/core/state/state.models/accounts/relationshipPlanTab.interface';

export enum RelationShipPlanTypes{
    relationshipPlanList='[RELATIONSHIPPLAN]List',
    relationshiPlanclear ='[RELATIONSHIPPLANCLEAR]List'
}

export class relationshipPlanAction implements Action{
    readonly type = RelationShipPlanTypes.relationshipPlanList;
 
    constructor(public payload:{RelationshipPlanModel :RelationshipPlanTab[] ,count:any,OdatanextLink:any}){
     console.log('in action->',payload.RelationshipPlanModel);
    }
}
export class relationshiPlanclear implements Action{
    readonly type = RelationShipPlanTypes.relationshiPlanclear;
    constructor(public paylood :{relationshipplanmodel: {}}){}


}

export type relationshipPlanType = relationshipPlanAction | relationshiPlanclear ;