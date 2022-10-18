export {};

declare global {
  interface Window {
    Y: any;
    WebsocketProvider: any;
    syncmetaRoom: string;
    caeFrames: any;
  }
}
