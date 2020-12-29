import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';

class Frame {
  public id: String;
  public url: String;
  public shouldRotate: boolean;
  public flip: boolean;

  constructor(id: String, url: String, shouldRotate: boolean = false, flip: boolean = false) {
    this.id = id;
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
export class AppComponent implements OnInit {
  framesHash: Map<String, Frame> = new Map();
  files: Array<any> = [];
  pages: Array<Array<Frame>> = [];

  framePerPage: number = 28;
  framesPerRow: number = 5;
  reader: FileReader = new FileReader();
  @ViewChildren('frames') framesDiv?: QueryList<any>;

  constructor() { }

  ngOnInit(): void {
    this.reader.onload = (_event) => this.onFileLoaded();
  }

  onFileLoaded() {
    let url: String;
    if (this.reader.result) {
      url = this.reader.result.toString();
    } else {
      return;
    }

    let id = `frame_${this.framesHash.size + 1}`;
    let frame: Frame = new Frame(id, url);
    this.framesHash.set(id, frame);
    this.addFrameToPage(frame);
    this.fixOrientation(id);
    this.processNextImage();
  }

  onFileSected($event: any) {
    this.reset();
    this.files.push(...$event.target.files);
    this.processNextImage();
  }

  addFrameToPage(frame: Frame) {
    if (this.pages.length === 0 || this.pages[this.pages.length - 1].length >= this.framePerPage) {
      this.pages.push([]);
    }
    this.pages[this.pages.length - 1].push(frame);
  }

  processNextImage() {
    if (this.files.length == 0) {
      return;
    }
    let file = this.files.shift();
    let mimeType = file.type;
    let isValidImage = !(mimeType.match(/image\/*/) == null);

    if (!isValidImage) {
      this.processNextImage();
      return;
    }

    this.reader.readAsDataURL(file);
  }

  fixOrientation(elementId: string) {
    // The timeout ensures that the image has been rendered
    setTimeout(() => {
      let img = <HTMLImageElement>document.getElementById(elementId);
      if (this.isPortrait(img)) {
        let frame = this.framesHash.get(elementId);
        if (frame) {
          frame.shouldRotate = true;
        }
      }
    }, 500);
  }

  isPortrait(img: HTMLImageElement): boolean {
    let w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    return h > w;
  }

  print() {

  }

  reset() {
    this.pages.length = 0;
    this.files.length = 0;
    this.framesHash = new Map();
  }
}
