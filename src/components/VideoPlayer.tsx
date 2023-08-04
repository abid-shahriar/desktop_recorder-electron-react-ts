import { styled } from 'styled-components';

export const VideoPlayer = () => {
  return (
    <>
      <div>
        <Video src='#' muted className=''></Video>
      </div>
    </>
  );
};

const Video = styled.video`
  display: none;

  &.active {
    border: 1px solid rgba(255, 255, 255, 0.5);
    display: block;
    width: 384px;
    height: 216px;
    margin-bottom: 40px;
    border-radius: 10px;
    box-shadow: 5px 10px 20px 0px rgba(0, 0, 0, 0.2);
  }
`;
