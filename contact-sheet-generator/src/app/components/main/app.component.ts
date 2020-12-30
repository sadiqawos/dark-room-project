import { Component } from '@angular/core';

class Frame {
  public url: String;
  public shouldRotate: boolean;
  public flip: boolean;

  constructor(url: String, shouldRotate: boolean = false, flip: boolean = false) {
    this.url = url;
    this.shouldRotate = shouldRotate;
    this.flip = flip;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  pages: Array<Array<Frame>> = [];

  framePerPage: number = 28;
  framesPerRow: number = 5;
  reader: FileReader = new FileReader();

  constructor() { }

  async onFileSelected($event: any) {
    this.reset();
    for (let file of $event.target.files) {
      let frame = await this.processFile(file);
      this.addFrameToPage(frame);
    }
  }

  addFrameToPage(frame: Frame) {
    if (!frame || !frame.url) {
      return;
    }
    let noPages = this.pages.length === 0;
    let isEndOfCurrentPage = !noPages && this.pages[this.pages.length - 1].length >= this.framePerPage;

    if (noPages || isEndOfCurrentPage) {
      this.pages.push([]);
    }
    this.pages[this.pages.length - 1].push(frame);
  }

  processFile(file: any): Promise<Frame> {
    return new Promise((resolve) => {
      let mimeType = file.type;
      let isValidImage = !(mimeType.match(/image\/*/) == null);

      if (!isValidImage) {
        resolve(undefined);
      }

      this.reader.onload = (_event) => {
        let url: String;
        if (this.reader.result) {
          url = this.reader.result.toString();
        } else {
          return resolve(undefined);
        }

        resolve(new Frame(url));
      };

      this.reader.readAsDataURL(file);
    });
  }

  /**
   * Detect orientation after loading image in view. adjust to landscape if necessary
   * @param imgRef
   */
  onImageLoad(imgRef: HTMLImageElement, frame: Frame) {
    if (imgRef && frame && this.isPortrait(imgRef)) {
      frame.shouldRotate = true;
    }
  }

  isPortrait(img: HTMLImageElement): boolean {
    let w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    return h > w;
  }

  print() {

  }

  reset() {
    this.pages.length = 0;
  }
}
