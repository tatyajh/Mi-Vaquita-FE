import styled from "styled-components";
import Button from "@mui/material/Button";

// Colors mirror the MUI theme's primary palette (src/theme.js) so this
// styled-components button stays visually consistent with the rest of the app.
const StyledButton = styled(Button)`
  font-weight: bold;
  font-size: 0.7rem;
  color: #ffffff;
  background-color: #36190d;
  &:hover {
    background-color: #59382e;
  }
`;

export default StyledButton;
