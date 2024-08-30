import React from 'react';
import { Box, Card, CardContent } from '@mui/material';
import { keyframes } from '@mui/system';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonLoader = ({ count = 6 }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {[...Array(count)].map((_, index) => (
        <Card
          key={index}
          sx={{
            width: 'calc(33.33% - 16px)',
            minWidth: '200px',
            height: '200px',
            mb: 2,
            backgroundColor: '#f0f0f0',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0, #f0f0f0)',
              backgroundSize: '200px 100%',
              animation: `${shimmer} 1.2s infinite`,
            },
          }}
        >
          <CardContent>
            <Box sx={{ width: '60%', height: '20px', mb: 1, backgroundColor: '#e0e0e0' }} />
            <Box sx={{ width: '80%', height: '20px', mb: 1, backgroundColor: '#e0e0e0' }} />
            <Box sx={{ width: '40%', height: '20px', backgroundColor: '#e0e0e0' }} />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default SkeletonLoader;
