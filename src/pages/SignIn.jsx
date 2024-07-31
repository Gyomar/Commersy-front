import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import AdbIcon from '@mui/icons-material/Adb';
import Button from '@mui/material/Button';
import { useAuth0 } from "@auth0/auth0-react";

const SignIn = () => {

  const { loginWithRedirect } = useAuth0();

  return (
    <Box sx={{ height: '100vh', flexGrow: 1 }}>
      <Stack direction="row" spacing={2}>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              top: '16px',
              left: '16px',
              objectFit: 'cover',
              position: 'absolute',
              width: 'calc(100% - 32px)',
              height: 'calc(100vh - 32px)',
              bgcolor: 'rgba(0, 0, 0, .03)',
            }}
          />
        </Stack>
        <Stack spacing={2} sx={{ px: 8, width: '100%', maxWidth: '480px' }}>
          <Typography variant="subtitle2" gutterBottom>
            <Link href="#">
              <Box sx={{ height: 8, width: 8, display: 'inline-flex', my: 8 }}>
                <AdbIcon />
              </Box>
            </Link>
          </Typography>
          <Paper elevation={0}>
            <Stack spacing={2} sx={{ mb: 5 }}>
              <Typography variant="h6" gutterBottom>
                Inicia Sesion en Commersy
              </Typography>
            </Stack>
            <Stack spacing={2}>
            <Button variant="contained" onClick={() => loginWithRedirect()}>Iniciar Sesion</Button>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SignIn;
