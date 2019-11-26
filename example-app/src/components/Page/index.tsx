import React from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

export interface PageProps {
  children: React.ReactElement;
}

const Page: React.FC<PageProps> = ({ children }: PageProps) => {
  return (
    <Container>
      <Paper>
        {children}
      </Paper>
    </Container>
  );
}

export default Page;
