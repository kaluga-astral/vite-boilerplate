import { styled } from '@example/shared';

import { Preview } from './Preview';

export const Wrapper = styled.form`
  display: grid;
  grid-gap: ${({ theme }) => theme.spacing(5)};
  grid-template-columns: 1fr 200px;
  align-items: start;
`;

export const StyledPreview = styled(Preview)`
  position: sticky;
  top: 0;

  grid-column: 2;
  grid-row: 1 / 5;
`;
