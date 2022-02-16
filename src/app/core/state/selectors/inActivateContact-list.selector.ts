import { createFeatureSelector, createSelector } from "@ngrx/store";
import { inActivateContact_State } from "../reducers/inActivateContact-reducer";


//selector for DeActivate contact list tab
export const getDeActivateContactListData = createFeatureSelector<inActivateContact_State>("LoadAllDeActivateContacts");
export const selectActionList1 = createSelector (
  getDeActivateContactListData,
  res=>  res
)
