import { useState } from 'react';
import styled from 'styled-components';

import { Modal } from './components/Modal';
import { IMediaDeviceInfo } from './@types/common';
import { VideoPlayer } from './components/VideoPlayer';
import { CustomButton } from './components/CustomButton';

function App() {
  const [selectedSource, setSelectedSource] = useState<IMediaDeviceInfo | null>(
    null
  );
  const [mediaSources, setMediaSources] = useState<IMediaDeviceInfo[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const handleChooseSource = async () => {
    setModalOpen(true);

    try {
      const has_video_access = window.electron.getScreenAccess();
      const has_microphone_access = window.electron.getMicrophoneAccess();

      if (!has_video_access || !has_microphone_access) {
        console.log('no access');
        return;
      }

      const sources = await window.electron.getScreenSources();

      setMediaSources(sources);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopRecording = () => {
    setSelectedSource(null);

    mediaRecorder?.stop();

    const videoElement = document.querySelector('video')!;

    videoElement.classList.remove('active');
    videoElement.srcObject = null;
  };

  return (
    <Container>
      <VideoPlayer />
      {selectedSource ? (
        <CustomButton
          onClick={handleStopRecording}
          bg='#802c2c'
          hoverbg='#821e1e'
        >
          Stop Recording
        </CustomButton>
      ) : (
        <CustomButton onClick={handleChooseSource}>
          Start Recording
        </CustomButton>
      )}

      {modalOpen && (
        <Modal
          setModalOpen={setModalOpen}
          videoSources={mediaSources}
          setMediaRecorder={setMediaRecorder}
          setSelectedSource={setSelectedSource}
        />
      )}
    </Container>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  position: relative;
`;
