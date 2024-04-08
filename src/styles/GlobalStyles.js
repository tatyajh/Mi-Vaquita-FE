import styled from "styled-components";
import Button from "@mui/material/Button";

const StyledButton = styled(Button)`
  font-weight: bold;
  font-size: 0.7rem;
  color: white;
  background-color: #36190d;
  &:hover {
    background-color: #59382e;
  }
`;

export default StyledButton;
