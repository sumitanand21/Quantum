import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatInput } from '@angular/material';
import { DataCommunicationService, OpportunitiesService } from '@app/core';
import { OrderService } from '@app/core/services/order.service';
@Component({
  selector: 'app-sow-map-popup',
  templateUrl: './sow-map-popup.component.html',
  styleUrls: ['./sow-map-popup.component.scss']
})
export class SowMapPopupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  headerdata=[
    {"title":"Super SOW ID", "name": "239012011"},
    {"title":"Account Name", "name": "239012011"},
    {"title":"Linked SOWs", "name": "239012011"}
  ]

  tabledata=[
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054,239012056, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054,239012056, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054,239012056, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054"},
    {"id":"239012011","accountname":"Alphabet.usa","LinkedSOWs":"239012071, 239012056, 239012054, 239012054"},

  ]

}
