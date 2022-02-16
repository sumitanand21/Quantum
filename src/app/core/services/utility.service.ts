import { Injectable } from '@angular/core';
import { dealService } from './deals.service';



@Injectable({
  providedIn: 'root'
})
export class UtilityService {


  constructor(public dealService: dealService) { }

  public fileUpload(data: any, fileType: string[]) {
    let fileList: FileList = data.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      if (!this.validateFile(file.name, fileType)) {
        return false;
      }
      formData.append("file", file, file.name);
      return formData;
    }
  }

  validateFile(name: String, fileType: string[]) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    let format = fileType.find(x => x.toLowerCase() === ext.toLowerCase())
    if (format) {
      return true;
    } else {
      return false;
    }
  }
}
