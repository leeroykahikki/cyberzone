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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TagIcon from '@mui/icons-material/Tag';
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
} from '@mui/material';
import moment from 'moment';
import 'moment/locale/ru';

String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

export default function CardItem({
  source,
  tags,
  author,
  title,
  description,
  image,
  date,
  content,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [color, setColor] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const getData = () => {
    moment.locale('ru');
    let date = moment().format('MMMM D, YYYY');
    return date.replaceAt(0, date[0].toUpperCase());
  };

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Tooltip title="Ник">
              <Avatar sx={{ bgcolor: color }} aria-label="recipe">
                R
              </Avatar>
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
                <MenuItem onClick={handleClose}>Редактировать</MenuItem>
                <MenuItem onClick={handleClose}>Удалить</MenuItem>
              </Menu>
            </div>
          }
          title="Shrimp and Chorizo Paella"
          subheader={getData()}
        />
        <CardMedia component="img" height="194" image="/paella.jpg" alt="Paella dish" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            This impressive paella is a perfect party dish and a fun meal to cook together with your
            guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <Button>Открыть</Button>
        </CardActions>
      </Card>
    </>
  );
}
