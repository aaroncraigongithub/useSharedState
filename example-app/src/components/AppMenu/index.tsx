import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export interface AppMenuProps {
  title: string;
  action?: React.ReactElement;
}

const AppMenu: React.FC<AppMenuProps> = ({ title, action }: AppMenuProps) => {
  const styles = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" className={styles.menuButton}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={styles.title}>
          {title}
        </Typography>
        {action && action}
      </Toolbar>
    </AppBar>
  );
}

export default AppMenu;
