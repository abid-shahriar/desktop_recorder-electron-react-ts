import { styled } from 'styled-components';

interface Props {
  children: React.ReactNode;
  onClick: () => void;
  bg?: string;
  hoverbg?: string;
}
export const CustomButton = (props: Props) => {
  const { children, onClick, bg, hoverbg } = props;

  return (
    <Button onClick={onClick} $bg={bg} $hoverbg={hoverbg}>
      {children}
    </Button>
  );
};

interface IButton {
  $bg?: string;
  $hoverbg?: string;
}

const Button = styled.button<IButton>`
  background-color: ${(props) => props.$bg || '#015389'};
  border-radius: 5px;
  border: none;
  color: white;
  padding: 10px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => props.$hoverbg || '#014a7a'};
  }
`;
