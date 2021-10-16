import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  red,
  purple,
  blue,
  green,
  yellow,
  pink,
  cyan,
  lightGreen,
  brown,
  grey,
} from '@mui/material/colors';
import {
  Button,
  Typography,
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import moment from 'moment';
import 'moment/locale/ru';
import axios from 'axios';

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

export default function CardItem({
  id,
  source,
  author,
  title,
  description,
  image,
  date,
  isAuthorized,
  authorizationCookie,
  handleRemoveCardItem,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [color, setColor] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Menu
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    setAnchorEl(null);
  };

  // Avatar color
  const colors = {
    1: red,
    2: purple,
    3: blue,
    4: green,
    5: yellow,
    6: pink,
    7: cyan,
    8: lightGreen,
    9: brown,
    10: grey,
  };

  useEffect(() => {
    setColor(getColor()[500]);
  }, []);

  const getColor = () => {
    return colors[Math.ceil(Math.random() * (Object.keys(colors).length - 0) + 0)];
  };

  // Format date
  const getDate = (date) => {
    moment.locale('ru');
    date = moment(date).format('MMMM D, YYYY');
    return date.replaceAt(0, date[0].toUpperCase());
  };

  // Dialog
  const handleOpenDeleteDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDialog(false);
  };

  const handleDeletePost = async () => {
    setLoading(true);

    const headers = {
      Authorization: 'Bearer ' + authorizationCookie,
    };

    console.log(authorizationCookie);
    await axios
      .delete(`http://localhost:5500/articles/${id}`, { headers: headers })
      .then(() => {
        handleRemoveCardItem(id);
        setLoading(false);
        setOpenDialog(false);
      })
      .catch((err) => {
        console.error(err);
      });

    setLoading(false);
  };

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Tooltip title={author}>
              <Avatar sx={{ bgcolor: color }}>{author[0].toUpperCase()}</Avatar>
            </Tooltip>
          }
          action={
            <div>
              <IconButton aria-label="settings" onClick={handleMenu}>
                <MoreVertIcon />
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
                onClose={handleClose}>
                <Link href={`/article/${id}`}>
                  <MenuItem onClick={handleClose}>Открыть</MenuItem>
                </Link>
                {isAuthorized && [
                  <Link href={`/article/${id}`}>
                    <MenuItem onClick={handleClose}>Редактировать</MenuItem>
                  </Link>,
                  ,
                  <MenuItem onClick={handleOpenDeleteDialog}>Удалить</MenuItem>,
                ]}
              </Menu>
            </div>
          }
          title={title}
          subheader={getDate(date)}
        />

        {source ? (
          <Tooltip title={`Источник: ${source}`}>
            <CardMedia component="img" height="194" image={image} alt="coverImage" />
          </Tooltip>
        ) : (
          <CardMedia component="img" height="194" image={image} alt="coverImage" />
        )}

        <CardContent sx={{ minHeight: '150px', maxHeight: '150px' }}>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>

        <CardActions disableSpacing>
          <Link href={`/article/${id}`}>
            <Button>Открыть</Button>
          </Link>
        </CardActions>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">Удаление записи</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены, что хотите удалить запись?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} autoFocus>
            Закрыть
          </Button>
          <LoadingButton onClick={handleDeletePost} loading={loading} loadingIndicator="Loading...">
            Удалить
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
