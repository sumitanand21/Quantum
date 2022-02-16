import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { DealCurrencyAction, ReportsAction } from '@app/core/state/actions/deals.actions';
import { DealCurrencyList } from '@app/core/state/selectors/deals/deal-currency.selectors';
// import { DataCommunicationService, dealService } from '..'
import { ValidateforNullnUndefined } from '../validateforNULLorUndefined.service';
import { dealService } from '../deals.service';
import { Injectable } from '@angular/core';
import { ReportsDaTaList } from '@app/core/state/selectors/deals/deal-reports.selectors';
@Injectable()
export class DealDropdownService {
    constructor( private _validate: ValidateforNullnUndefined, public store: Store<AppState>, private deals: dealService, ) { }
    /*Tagged list , Existing list , Reports and Create deal */
    getDealCurrencyList(DealCurrencyData) {
        this.store.pipe(select(DealCurrencyList)).subscribe(res => {
            console.log('Deal Currency', res);
            if (res.DealcurrencyList != undefined) {
                if (res.DealcurrencyList.length > 0) {
                    console.log('From state', res);
                    return res;
                } else {
                    this.deals.getCurrencyDealCurrency(DealCurrencyData).subscribe(res => {
                        if (res) {
                            console.log('From api', res);
                            this.store.dispatch(new DealCurrencyAction({ DealCurrencyList: res.Output.Items.Standard }));
                            return res.Output.Items.Standard;
                        } else {
                            return null;
                        }
                    }, error => {
                        console.log('Error', error);
                        return null;
                    })
                }
            } else {
                this.deals.getCurrencyDealCurrency(DealCurrencyData).subscribe(res => {
                    if (res) {
                        console.log('From api', res);
                        this.store.dispatch(new DealCurrencyAction({ DealCurrencyList: res.Output.Items.Standard }));
                        return res.Output.Items.Standard;
                    } else {
                        return null;
                    }
                }, error => {
                    console.log('Error', error);
                    return null;
                })
            }
        })
    }
    getReportsDropDowns(Reportdata) {
        this.store.pipe(select(ReportsDaTaList)).subscribe(res => {
            console.log('Deal Reports', res);
            if (res.ReportData != undefined && res.ReportData != {}) {
                if (res.ReturnFlag == "S") {
                    console.log('From state', res);
                    return res.Output;
                } else {
                    this.deals.getDealReports(Reportdata).subscribe(res => {
                        if (res.ReturnFlag == "S") {
                            console.log('From api', res);
                            this.store.dispatch(new ReportsAction({ ReportsData: res.Output }));
                            return res.Output;
                        } else {
                            return null;
                        }
                    }, error => {
                        console.log('Error', error);
                        return null;
                    })
                }
            } else {
                this.deals.getDealReports(Reportdata).subscribe(res => {
                    if (res.ReturnFlag == "S") {
                        console.log('From api', res);
                        this.store.dispatch(new ReportsAction({ ReportsData: res.Output }));
                        return res.Output;
                    } else {
                        return null;
                    }
                }, error => {
                    console.log('Error', error);
                    return null;
                })
            }
        })
    }
    /*Tagged list , Existing list , Reports and Create deal */
}