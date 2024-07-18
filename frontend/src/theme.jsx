import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      background: {
        default: '#202124',
        paper: '#2d2e31',
      },
    } : {}),
  },
});
