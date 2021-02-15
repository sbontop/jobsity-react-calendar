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
import DayServices from "../services/DayServices";
import axios from "axios";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

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
  paper: {
    /**GRID STYLE */
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
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

function CreateReminder(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState(props.day);
  const [time, setTime] = useState(props.time);
  const [reminderDescription, setReminderDescription] = useState("");
  const [city, setCity] = useState("Guayaquil");
  const [color, setColor] = useState("#ff0000");

  const MAX_LENGTH_CHARACTER = 30;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const createReminder = () => {
    console.log("reminderDescription", reminderDescription);
    const reminderObjToSave = {
      description: reminderDescription,
      city: city,
      color: color
    };
    localStorage.setItem(`${day}-${time}`, JSON.stringify(reminderObjToSave));

    /** CONFIRMAR GUARDADO CORRECTO */
    const reminderObjSaved = JSON.parse(localStorage.getItem(`${day}-${time}`));
    alert(
      `Reminder saved with day ${day} time ${time} description ${
        reminderObjSaved.description
      } city ${city} color ${color}`
    );
    handleClose();
    location.reload();
  };

  const onChangeReminder = e => {
    setReminderDescription(e.target.value);
  };

  const onChangeCity = e => {
    setCity(e.target.value);
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
      <Grid id="simple-modal-description" container spacing={3}>
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
              helperText={`${
                reminderDescription.length
              }/${MAX_LENGTH_CHARACTER}`}
            />
          </FormControl>

          <FormControl>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Country"
              value={city}
              onChange={onChangeCity}
            >
              <MenuItem value="Guayaquil">Guayaquil</MenuItem>
              <MenuItem value="Quito">Quito</MenuItem>
              <MenuItem value="Cuenca">Cuenca</MenuItem>
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
            <Button
              variant="contained"
              color="primary"
              onClick={() => createReminder()}
            >
              {localStorage.getItem(`${day}-${time}`) ? "Edit" : "Create"}
            </Button>
          </FormControl>
        </form>
      </Grid>
    </div>
  );

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        {localStorage.getItem(`${day}-${time}`) ? "Edit" : "Create"}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
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
  const [weather, setWeather] = useState();

  const { id } = useParams();

  useEffect(async () => {
    const data = await DayServices.getWeatherByCity();
    console.log(data);
  }, []);

  const classes = useStyles();
  const rows = loadData();

  return (
    <div className={classes.root}>
      <p>{JSON.stringify(weather)}</p>
      <Grid container spacing={3}>
        <Grid item xs>
          <h3>Day: {id}</h3>
          <h3>Weather: {}</h3>
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
                  <CreateReminder day={id} time={row.hour} />
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
