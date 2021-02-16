import React, { Component, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import { hours } from "../extras/DayHelper";

function getModalStyle() {
  const top = 50 
  const left = 50 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  table: {
    minWidth: 300
  },
  modal: {
    /**MODAL STYLE */
    position: "absolute",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
  form: {
    /**FORM STYLE */
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch"
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    }
  }
}));

function createData(id, hour, description) {
  return { id, hour, description };
}

const loadData = () => {
  let rows = [];
  let description = "available";
  hours.map(hour => {
    rows.push(createData(hour.id, hour.name, description));
  });
  return rows;
};

function ModalCreateReminder(props) {
  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [openModal, setOpenModal] = useState(false);

  const [day, setDay] = useState(props.day);
  const [time, setTime] = useState(props.time);
  const [reminderDescription, setReminderDescription] = useState(localStorage.getItem(`${day}-${time}`) ? JSON.parse(localStorage.getItem(`${day}-${time}`)).description : "");
  const [city, setCity] = useState(localStorage.getItem(`${day}-${time}`) ? JSON.parse(localStorage.getItem(`${day}-${time}`)).city : "");
  const [color, setColor] = useState(localStorage.getItem(`${day}-${time}`) ? JSON.parse(localStorage.getItem(`${day}-${time}`)).color : "#ff0000");
  const [cityWeather, setCityWeather] = useState(localStorage.getItem(`${day}-${time}`) ? JSON.parse(localStorage.getItem(`${day}-${time}`)).weather : "");
  // max length for reminder description field
  const MAX_LENGTH_CHARACTER = 30;

  const getWeatherByCity = (str_city) => {
    fetch(`https://5616dab3-55ed-4549-a791-78913e0a09e0.mock.pstmn.io/api/weather/${str_city}/2021-02-15`)
      .then(res => res.json())
      .then(res => {
        console.log(res.weather)
        setCityWeather(res.weather)
      })
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const createReminder = () => {
    // Create reminder object to save in local storage
    const reminderObjToSave = {
      description: reminderDescription,
      city: city,
      color: color,
      weather: cityWeather,
    };
    console.log(reminderObjToSave)

    localStorage.setItem(`${day}-${time}`, JSON.stringify(reminderObjToSave));

    // confirm reminder object saved
    const reminderObjSaved = JSON.parse(localStorage.getItem(`${day}-${time}`));
    alert(
      `Reminder saved with day ${day} time ${time} description ${reminderObjSaved.description
      } city ${city} color ${color} weather ${cityWeather}`
    );
    handleCloseModal();
    location.reload();
  };

  const onChangeReminder = e => {
    setReminderDescription(e.target.value);
  };

  function onChangeCity(e) {
    /*console.log(e.target.value)*/
    setCity(e.target.value);

    // get weather by city
    getWeatherByCity(e.target.value);
  };

  const onChangeColor = e => {
    setColor(e.target.value);
  };

  const body = (
    <div style={modalStyle} className={classes.modal}>
      <Grid container>
        <h2 id="simple-modal-title">
          {localStorage.getItem(`${day}-${time}`)
            ? "Edit Reminder"
            : "Create Reminder"}
        </h2>
      </Grid>

      <Grid id="simple-modal-description" container >
        <form className={classes.form} noValidate autoComplete="off">
          <FormControl>
            <TextField
              id="outlined-basic"
              label="Date"
              variant="outlined"
              value={day}
              InputProps={{
                readOnly: true
              }}
            />
          </FormControl>

          <FormControl>
            <TextField
              id="outlined-basic"
              label="Time"
              variant="outlined"
              value={time}
              InputProps={{
                readOnly: true
              }}
            />
          </FormControl>

          <FormControl>
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              value={reminderDescription}
              onChange={e => onChangeReminder(e)}
              required
              inputProps={{
                maxLength: MAX_LENGTH_CHARACTER
              }}
              helperText={`${reminderDescription.length
                }/${MAX_LENGTH_CHARACTER}`}
            />
          </FormControl>

          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Country"
              value={city}
              onChange={e => onChangeCity(e)}
            >
              <MenuItem value="Monterrey">Monterrey</MenuItem>
              <MenuItem value="Brasilia">Brasilia</MenuItem>
              <MenuItem value="Bogota">Bogota</MenuItem>
              <MenuItem value="Quito">Quito</MenuItem>
              <MenuItem value="Santiago">Santiago</MenuItem>
              <MenuItem value="Cordova">Cordova</MenuItem>
              <MenuItem value="Lima">Lima</MenuItem>
              <MenuItem value="Caracas">Caracas</MenuItem>
              <MenuItem value="Asuncion">Asuncion</MenuItem>
              <MenuItem value="Montevideo">Montevideo</MenuItem>            
            </Select>
            <FormHelperText>Select a city</FormHelperText>
          </FormControl>

          <FormControl>
            <label htmlFor="favcolor">Select your favorite color:</label>
            <input
              type="color"
              id="favcolor"
              name="favcolor"
              value="#ff0000"
              onChange={e => onChangeColor(e)}
            />
          </FormControl>

          <FormControl>

          </FormControl>

        </form>
        <Grid container >
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => createReminder()}
            >
              {localStorage.getItem(`${day}-${time}`) ? "Edit" : "Create"}
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleCloseModal()}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>

      </Grid>
    </div>
  );

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpenModal}>
        {localStorage.getItem(`${day}-${time}`) ? "Edit" : "Create"}
      </Button>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}

function Day() {
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const { id } = useParams();

  const classes = useStyles();
  const rows = loadData();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs>
          <h3>Day: {id}</h3>
          <Link to="/">
            <span>Go back to calendar!</span>
          </Link>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Hour</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">City</TableCell>
              <TableCell align="left">Weather</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow
                key={`${id}-${row.hour}`}
                style={{
                  backgroundColor: localStorage.getItem(`${id}-${row.hour}`)
                    ? JSON.parse(localStorage.getItem(`${id}-${row.hour}`))
                      .color
                    : ""
                }}
              >
                <TableCell>{row.hour}</TableCell>
                <TableCell>
                  {localStorage.getItem(`${id}-${row.hour}`)
                    ? JSON.parse(localStorage.getItem(`${id}-${row.hour}`))
                      .description
                    : "No data"}
                </TableCell>
                <TableCell>
                  {localStorage.getItem(`${id}-${row.hour}`)
                    ? JSON.parse(localStorage.getItem(`${id}-${row.hour}`)).city
                    : "No data"}
                </TableCell>
                <TableCell>
                  {localStorage.getItem(`${id}-${row.hour}`)
                    ? JSON.parse(localStorage.getItem(`${id}-${row.hour}`)).weather
                    : "No data"}
                </TableCell>
                <TableCell>
                  <ModalCreateReminder day={id} time={row.hour} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Day;
