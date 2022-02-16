import { EntityState,EntityAdapter, createEntityAdapter } from "../../../../../../node_modules/@ngrx/entity";
import { RelationshipPlanTab } from "@app/core/state/state.models/accounts/relationshipPlanTab.interface";
import { relationshipPlanType, RelationShipPlanTypes } from "@app/core/state/actions/relationship-plan.action";

export interface initialPlanState extends EntityState<RelationshipPlanTab>{
  count:number;
  OdatanextLink:any;
}
export const adapter : EntityAdapter<RelationshipPlanTab> = createEntityAdapter<RelationshipPlanTab>()

export const initialRelationshipPlanState : initialPlanState = adapter.getInitialState({
 count : 0,
 OdatanextLink : ""
})

export function RelationShipPlanReducer(state=initialRelationshipPlanState,action :relationshipPlanType):initialPlanState
{
    switch(action.type){
        case(RelationShipPlanTypes.relationshipPlanList):{
            console.log('in reducer',action.payload.RelationshipPlanModel);
            return adapter.addMany(action.payload.RelationshipPlanModel,{...state,count:action.payload.count,OdatanextLink:action.payload.OdatanextLink})
        }
        case RelationShipPlanTypes.relationshiPlanclear :
        return initialRelationshipPlanState;
        default :
        return state;

    }
}