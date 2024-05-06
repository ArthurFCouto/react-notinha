import Link from 'next/link';
import { Box, Button, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box>
      <Typography>Hello Word</Typography>
      <Button LinkComponent={Link} href='/home'>Home</Button>
    </Box>
  );
}
