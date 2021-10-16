import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {
  Container,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Toolbar,
  Box,
  AppBar,
  Modal,
  FormControl,
  InputLabel,
  FormHelperText,
  OutlinedInput,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 400,
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
};

const styleLink = {
  cursor: 'pointer',
  flexGrow: 1,
};

export default function Header({ title, isAuthorized, toggleAuthorization }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [cookie, setCookie, removeCookie] = useCookies(['accessToken']);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await axios
      .post('http://localhost:5500/login', data)
      .then((res) => {
        const token = res.data.accessToken;
        setCookie('accessToken', token, {
          path: '/',
          maxAge: 3600 * 24,
          sameSite: true,
        });
        if (!isAuthorized) {
          toggleAuthorization();
        }
        handleCloseModal();
        setError(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
      });
    setLoading(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleExit = async () => {
    removeCookie('accessToken');
    if (isAuthorized) {
      toggleAuthorization();
    }
    setAnchorEl(null);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return (
    <>
      <Box sx={{ flexGrow: 1, marginBottom: '20px' }}>
        <AppBar position="static">
          <Container>
            <Toolbar disableGutters={true}>
              <Link href="/">
                <Typography variant="h6" component="div" sx={styleLink}>
                  {title}
                </Typography>
              </Link>
              <div>
                <IconButton size="large" onClick={handleMenu} color="inherit">
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}>
                  {isAuthorized ? (
                    <MenuItem onClick={handleExit}>Выйти</MenuItem>
                  ) : (
                    <MenuItem onClick={handleOpen}>Войти</MenuItem>
                  )}
                </Menu>
              </div>
            </Toolbar>
          </Container>
        </AppBar>
        <Modal
          open={open}
          onClose={handleCloseModal}
          sx={{ marginLeft: '8px', marginRight: '8px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={styleModal}>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ marginBottom: '10px' }}>
                Авторизация
              </Typography>

              <FormControl sx={{ width: '100%', marginBottom: '15px' }}>
                <InputLabel htmlFor="component-outlined">Логин</InputLabel>
                <Controller
                  name="login"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <OutlinedInput
                      error={error ? error : errors.login && errors.login.type === 'required'}
                      {...field}
                      id="component-outlined"
                      label="Логин"
                    />
                  )}
                />
                {errors.login && errors.login.type === 'required' && (
                  <FormHelperText>Это поле обязательно!</FormHelperText>
                )}
              </FormControl>

              <FormControl sx={{ width: '100%', marginBottom: '20px' }}>
                <InputLabel htmlFor="component-outlined">Пароль</InputLabel>
                <Controller
                  name="password"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <OutlinedInput
                      error={error ? error : errors.password && errors.password.type === 'required'}
                      {...field}
                      id="component-outlined"
                      label="Пароль"
                    />
                  )}
                />
                {errors.password && errors.password.type === 'required' && (
                  <FormHelperText>Это поле обязательно!</FormHelperText>
                )}
              </FormControl>
              <LoadingButton
                type="submit"
                loading={loading}
                loadingIndicator="Loading..."
                variant="contained"
                sx={{ width: '100%' }}>
                Авторизоваться
              </LoadingButton>
            </Box>
          </form>
        </Modal>
      </Box>
    </>
  );
}
