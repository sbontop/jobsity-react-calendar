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
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";

import { hours } from "../extras/DayHelper";
import { simpleModal } from "./CreateReminder";

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

function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [day, setDay] = React.useState(props.day);
  const [time, setTime] = React.useState(props.time);
  const [reminderDescription, setReminderDescription] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log("reminderDescription", reminderDescription);
  };

  const onChangeReminder = e => {
    // console.log(e.target.value);
    setReminderDescription(e.target.value);
  };

  const body = (
    <div style={modalStyle} className={classes.modal}>
      <Grid container>
        <h2 id="simple-modal-title">Create Reminder</h2>
      </Grid>
      <Grid id="simple-modal-description" container spacing={3}>
        <form className={classes.form} noValidate autoComplete="off">
          <Grid item xs>
            <TextField
              id="outlined-basic"
              label="Date"
              variant="outlined"
              value={day}
            />
          </Grid>

          <Grid item xs>
            <TextField
              id="outlined-basic"
              label="Time"
              variant="outlined"
              value={time}
            />
          </Grid>

          <Grid item xs>
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              value={reminderDescription}
              onChange={e => onChangeReminder(e)}
            />
          </Grid>
        </form>
      </Grid>

      <Grid container spacing={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSubmit()}
        >
          Create
        </Button>
      </Grid>
    </div>
  );

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        New
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
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();
  const classes = useStyles();
  const rows = loadData();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs>
          <h3>ID: {id}</h3>
          <Link to="/">
            <span>Go back to calendar!</span>
          </Link>
        </Grid>
        <Grid item xs>
          <SimpleModal />
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
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.hour}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>
                  <SimpleModal day="2020-02-15" time="12:00" />
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
