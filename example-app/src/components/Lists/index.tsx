import React from 'react';
import { useHistory } from "react-router-dom";
import { useSharedState } from 'hook-shared-state';
import Typography from '@material-ui/core/Typography';
import { List } from '../../types/lists';
import { Button, Card } from '@material-ui/core';
import AppMenu from '../AppMenu';

const NoList: React.FC = () => (
  <Card>
    <Typography component="p">You don't have any lists.</Typography>
  </Card>
);

const Lists: React.FC = () => {
  const history = useHistory();
  const [lists] = useSharedState<List[]>('lists', []);

  function onClick() {
    history.push('list/new');
  }

  return (
    <>
      <AppMenu
        title="Todo Lists"
        action={
          <Button onClick={onClick} color="inherit">
            New list
          </Button>
        }
      />
      {(lists === undefined || lists.length === 0) && <NoList />}
    </>
  );
}

export default Lists;
