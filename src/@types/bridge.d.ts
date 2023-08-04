import { API } from '../../electron/preload';

declare global {
  export interface Window {
    electron: typeof API;
  }

  export interface IMediaTrackConstraints extends MediaTrackConstraints {
    chromeMediaSource: string;
    chromeMediaSourceId: string;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    minFrameRate: number;
    maxFrameRate: number;
  }

  export interface INavigator extends Navigator {
    getUserMedia(
      constraints: {
        audio?: boolean;
        video?: {
          mandatory: IMediaTrackConstraints;
        };
      },
      successCallback: NavigatorUserMediaSuccessCallback,
      errorCallback: NavigatorUserMediaErrorCallback
    ): void;
  }
}

export {};
