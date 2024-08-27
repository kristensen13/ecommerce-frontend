declare module 'bootstrap' {
  export class Offcanvas {
    constructor(element: HTMLElement, options?: any);
    toggle(): void;
    show(): void;
    hide(): void;
    dispose(): void;
  }
}
