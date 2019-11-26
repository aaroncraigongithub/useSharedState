export enum ListItemStatus {
  DONE = 'done',
  PENDING = 'pending',
  EXPIRED = 'expired'
}

export interface ListItem {
  id: string;
  title: string;
  dueBy: Date;
  status: ListItemStatus;
}

export interface List {
  id: string;
  name: string;
  items: ListItem[];
}