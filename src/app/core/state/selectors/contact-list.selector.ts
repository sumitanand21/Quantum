import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Contact_State } from "../reducers/contact-reducer";
import { ContactDetailsState } from "../reducers/contact/contact.details.reducer";
import { MarketInfoDetailsState } from "../reducers/contact/marketInfo.details.reducer";
import { RelationshipLogDetailsState } from "../reducers/contact/relationShip.details.reducer";


export const ContactDetails = createFeatureSelector<ContactDetailsState>('ContactDetails');
export const MarketDetails = createFeatureSelector<MarketInfoDetailsState>('MarketDetails');
export const RelationshipLogDetails = createFeatureSelector<RelationshipLogDetailsState>('RelationshipLogDetails');


//selector for contact list
export const getContactListData = createFeatureSelector<Contact_State>("LoadAllContacts");
export const selectActionList = createSelector (
  getContactListData,
  res=>  res
)



//selector for contact details page
export const getContactDetailsById = (detailsId) => createSelector(
  ContactDetails,
  res => res.entities[detailsId]
);


//selector for market details page
export const getMarketDetailsById = (detailsId) => createSelector(
  MarketDetails,
  res => res.entities[detailsId]
);

//selector for relationship log page
export const getRelationshipLogById = (detailsId) => createSelector(
  RelationshipLogDetails,
  res => res.entities[detailsId]
);