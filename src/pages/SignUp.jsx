import { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AdbIcon from "@mui/icons-material/Adb";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const formSignUp = useRef(null)

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const createAnAccount = () => {
		const formData = new FormData(formSignUp.current)
		const data = {
			name: formData.get('name'),
			email: formData.get('email'),
			password: formData.get('password')
		}

    const stringifiedAccount = JSON.stringify(data)
    localStorage.setItem('account', stringifiedAccount)
    //context.setAccount(data)

    //handleSignIn()
	}

  return (
    <Box sx={{ height: "100vh", flexGrow: 1 }}>
      <Stack direction="row" spacing={2}>
        <Stack spacing={2} sx={{ px: 8, width: "100%", maxWidth: "480px" }}>
          <Typography variant="subtitle2" gutterBottom>
            <Link href="#">
              <Box sx={{ height: 8, width: 8, display: "inline-flex", my: 8 }}>
                <AdbIcon />
              </Box>
            </Link>
          </Typography>
          <Paper elevation={0}>
            <Stack spacing={2} sx={{ mb: 5 }}>
              <Typography variant="h6" gutterBottom>
                Empieza a gestionar tu negocio
              </Typography>
              <Stack direction="row" spacing={2}>
                <Typography variant="body2" gutterBottom>
                  Ya tiene una cuenta?
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  <Link href="#">Iniciar Sesion</Link>
                </Typography>
              </Stack>
            </Stack>
            <Stack spacing={2} ref={formSignUp}>
              <Stack direction="row" spacing={2}>
                <TextField
                  required
                  id="firstName"
                  label="Nombre"
                  variant="outlined"
                  type="text"
                  autoComplete="given-name"
                />
                <TextField
                  required
                  id="lastName"
                  label="Apellido"
                  variant="outlined"
                  type="text"
                  autoComplete="family-name"
                />
              </Stack>
              <TextField
                required
                id="email"
                label="Email"
                variant="outlined"
                type="email"
                autoComplete="email"
              />
              <FormControl variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Contraseña
                </InputLabel>
                <OutlinedInput
                  required
                  id="password"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Contraseña"
                  autoComplete="new-password"
                />
              </FormControl>
              <Button variant="contained" onClick={createAnAccount} >Crear Cuenta</Button>
            </Stack>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ mt: 2, fontSize: "0.75rem" }}
            >
              Al crear tu cuenta, estas de acuerdo con{" "}
              <Link href="#">Terminos del Servicio</Link> y{" "}
              <Link href="#">Politicas de Privacidad</Link>
            </Typography>
          </Paper>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ display: "flex", flexDirection: "column", flexGrow: 1, position: "relative" }}>
          <Box
            sx={{
              top: "16px",
              left: "16px",
              objectFit: "cover",
              position: "absolute",
              width: "calc(100% - 32px)",
              height: "calc(100vh - 32px)",
              bgcolor: "rgba(0, 0, 0, .03)",
            }}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

export default SignUp;
