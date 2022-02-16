import { Injectable } from '@angular/core';
import {DefaultUrlSerializer, RouterModule, Routes, UrlSegment, UrlSerializer, UrlTree} from '@angular/router';
@Injectable()
export class UrlSerializerService {


  private defaultSerializer: DefaultUrlSerializer = new DefaultUrlSerializer();

  parse(url: string): UrlTree {

    // This is the custom patch where you'll collect segment containing '='
    const lastSlashIndex = url.lastIndexOf('/'), equalSignIndex = url.indexOf('=', lastSlashIndex);
    if (equalSignIndex > -1) { // url contians '=', apply patch
      const keyValArr = url.substr(lastSlashIndex + 1).split('=');
      const urlTree = this.defaultSerializer.parse(url);

      // Once you have serialized urlTree, you have two options to capture '=' part
      // Method 1. replace desired segment with whole "key=val" as segment
      urlTree.root.children['primary'].segments.forEach((segment: UrlSegment) => {
        if (segment.path === keyValArr[0]) {
          segment.path = keyValArr.join('='); // Suggestion: you can use other unique set of characters here too e.g. '$$$'
        }
      });

      return urlTree;
    } else {
      return this.defaultSerializer.parse(url);
    }
  }

  serialize(tree: UrlTree): string {
    return this.defaultSerializer.serialize(tree);
  }

}