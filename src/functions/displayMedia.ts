import { IMediaDeviceInfo } from '../@types/common';

let mediaRecorder: MediaRecorder;
const recorderChunks: Blob[] = [];

export function captureScreenVideoWithAudio(
  source: IMediaDeviceInfo,
  setMediaRecorder: (mediaRecorder: MediaRecorder) => void
) {
  const NAVIGATOR = navigator as INavigator;
  NAVIGATOR.getUserMedia(
    { audio: true },
    function (audioStream: MediaStream) {
      NAVIGATOR.getUserMedia(
        {
          audio: false,
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: source.id,
              minWidth: 1920,
              maxWidth: 3840,
              minHeight: 1080,
              maxHeight: 2160,
              minFrameRate: 0,
              maxFrameRate: 60
            }
          }
        },
        handleVideoStream(audioStream, setMediaRecorder),
        handleUserMediaError
      );
    },
    function () {}
  );
}

function handleVideoStream(
  audioStream: MediaStream,
  setMediaRecorder: (mediaRecorder: MediaRecorder) => void
) {
  return function (videoStream: MediaStream) {
    if (audioStream) {
      const audioTracks = audioStream.getAudioTracks();
      if (audioTracks.length > 0) {
        videoStream.addTrack(audioTracks[0]);
      }
    }

    const video = document.querySelector('video')!;

    video.classList.add('active');
    video.srcObject = videoStream;
    video.play();

    mediaRecorder = new MediaRecorder(videoStream, {
      mimeType: 'video/webm;codecs=vp8,opus'
      // mimeType: 'video/x-matroska;codecs=h264'
    });

    setMediaRecorder(mediaRecorder);

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
    mediaRecorder.start();
  };
}

const handleDataAvailable = (e: BlobEvent) => {
  if (e.data.size > 0) {
    recorderChunks.push(e.data);
  }
};

const handleStop = async () => {
  const blob = new Blob(recorderChunks, {
    // type: 'video/x-matroska;codecs=h264'
    type: 'video/webm;codecs=vp8,opus'
  });

  await window.electron.saveFile(blob);

  recorderChunks.length = 0;
};

function handleUserMediaError(e: Error) {
  console.error('handleUserMediaError', e);
}
