export {};

declare global {
  interface Window {
    Y: any;
    WebsocketProvider: any;
    yjsRoom: string;
    caeFrames: any;
    _iwc_instance_: any;
    _addIwcIntentListener: (f: any) => void;
    _reloadPage: () => void;
    spaceTitle: string;
    syncmeta: {
      EntityManagerInstance: any;
    };
  }
}
