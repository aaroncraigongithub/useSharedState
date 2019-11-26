import React from 'react';
import Page from '../components/Page';
import ListDetail from '../components/ListDetail';
import { useParams } from 'react-router';

export interface ListParams {
  id: string;
}

const List: React.FC = () => {
  const params = useParams<ListParams>();

  return (
    <Page><ListDetail id={params.id} /></Page>
  );
}

export default List;
