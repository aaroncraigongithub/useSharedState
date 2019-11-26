import React, { useState } from 'react';
import { useSharedState } from 'hook-shared-state';
import { Box, TextField, Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import uuid from 'uuid/v1';
import { List } from '../../types/lists';
import AppMenu from '../AppMenu';

export interface ListDetailProps {
  id: string;
}

const ListDetail: React.FC<ListDetailProps> = ({ id }: ListDetailProps) => {
  const ourId = id === 'new' ? uuid() : id;
  const [list, saveList] = useSharedState<List>(ourId);
  const history = useHistory();
  const [localList, setLocalList] = useState<List>(list || { id: ourId, name: '', items: [] });

  function onTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    const newList = { ...localList, name }

    setLocalList(newList);
  }

  function onDoneClick() {
    if (localList.name === '') {
      return;
    }

    saveList(localList as List);
    history.push('/');
  }

  function onCancelClick() {
    history.push('/');
  }

  return (
    <>
      <AppMenu
        title={localList.name || "New list"}
      />

      <Box p={2}>
        <TextField onChange={onTitleChange} label="List name" placeholder="My new list" value={localList.name} />
      </Box>
      <Box p={2}>
        <Button onClick={onDoneClick} variant="contained" color="primary" disabled={localList.name === ''}>Done</Button>
        <Button onClick={onCancelClick}>Cancel</Button>
      </Box>
    </>
  );
}

export default ListDetail;
