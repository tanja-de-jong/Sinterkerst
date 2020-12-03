import React, { useState } from "react"
import {connect} from "react-redux"
import {createItem} from "../redux/items/thunks"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AddListItem = ({ currentUser, users, open, setOpen, createItem }) => {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(false)
  const [owners, setOwners] = useState([])

  const classes = useStyles();

  const styleRequired = {
    color: "#ffaaaa"
  }

  const clearForm = () => {
    setName('')
    setUrl('')
    setDescription('')
    setOwners([])
    setError(false)
    setOpen(false)
  }

  const handleCancel = () => {
    clearForm()
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (name && name.length) {
      const completeUrl = url.trim().length > 0 && url.substring(0, 4) !== "http" ? "http://" + url : url
      owners.push(currentUser)
    

      var item = {
        owners: owners,
        name: name.trim(),
        url: completeUrl || '',
        description: description.trim() || '',
        createdBy: currentUser,
      };
      createItem(item)

      clearForm()
      setOpen(false)
    } else {
      setError(true)
    }
  }

  return (
    <Dialog open={open} onClose={() => clearForm()}>
      <DialogTitle id="form-dialog-title">Voeg toe</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          onChange={(event) => setName(event.target.value)}
          error={error}
          margin="dense"
          id="name"
          label="Naam"
          type="text"
          fullWidth
        />
        <TextField
          onChange={(event) => setUrl(event.target.value)}
          margin="dense"
          id="url"
          label="Website"
          type="url"
          fullWidth
        />
        <TextField
          multiline
          onChange={(event) => setDescription(event.target.value)}
          margin="dense"
          id="description"
          label="Omschrijving"
          type="text"
          fullWidth
        />
        <FormControl className={classes.formControl}>
          <InputLabel id="with-select-label">Samen met</InputLabel>
          <Select
            multiple
            id="with-select"
            labelId="with-select-label"
            value={owners}
            onChange={(event) => setOwners(event.target.value)}
            input={<Input />}
            MenuProps={MenuProps}
          >
            {users.filter(user => user.id !== currentUser).map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Annuleer
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Voeg toe
          </Button>
        </DialogActions>
    </Dialog>
  )
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  users: state.users.users
});

const mapDispatchToProps = dispatch => ({
  createItem: (item) => dispatch(createItem(item))
});


const ConnectedAddListItem = connect(mapStateToProps, mapDispatchToProps)(AddListItem)
export default ConnectedAddListItem;
