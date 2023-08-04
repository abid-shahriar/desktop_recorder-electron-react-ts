import { styled } from 'styled-components';
import { Dispatch, SetStateAction } from 'react';

import { CustomButton } from './CustomButton';
import { IMediaDeviceInfo } from '../@types/common';
import { captureScreenVideoWithAudio } from '../functions/displayMedia';

interface Props {
  setModalOpen: (value: boolean) => void;
  videoSources: IMediaDeviceInfo[];
  setMediaRecorder: (value: MediaRecorder | null) => void;
  setSelectedSource: Dispatch<SetStateAction<IMediaDeviceInfo | null>>;
}

export const Modal = (props: Props) => {
  const { setModalOpen, videoSources, setMediaRecorder, setSelectedSource } =
    props;

  const filteredSources = videoSources?.filter((source) => {
    return source.thumbnailURL?.length > 100 && source.display_id;
  });

  const handleStartRecording = (source: IMediaDeviceInfo) => {
    setModalOpen(false);
    setSelectedSource(source);

    captureScreenVideoWithAudio(source, setMediaRecorder);
  };

  return (
    <>
      <ModalContainer>
        <Title>Select a Screen to Record:</Title>

        <CardWrapper>
          {filteredSources?.map((source) => {
            const { name, thumbnailURL, id } = source;
            return (
              <Card key={id} onClick={() => handleStartRecording(source)}>
                <img src={thumbnailURL} alt={name} />
                <p>{name}</p>
              </Card>
            );
          })}
        </CardWrapper>

        <StyledButton onClick={() => setModalOpen(false)}>Close</StyledButton>
      </ModalContainer>
    </>
  );
};

const StyledButton = styled(CustomButton)``;

const ModalContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  width: 100%;
  height: 100%;
  max-height: 400px;
  background-color: #191d24;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  button {
    align-self: flex-end;
    justify-self: flex-end;
    font-size: 16px;
  }
`;

const Title = styled.p`
  color: white;
  font-size: 20px;
  font-weight: 400;
  border-bottom: 1px solid #6d7581;
  padding-bottom: 10px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 200px;
  width: 100%;
  gap: 10px;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 5px;
  padding-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  & > * {
    pointer-events: none;
  }

  &:hover {
    border: 1px solid white;
  }

  img {
    width: 100%;
  }

  p {
    color: white;
    font-size: 16px;
    font-weight: 400;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;
