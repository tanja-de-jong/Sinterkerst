import React, { useState } from "react"
import {connect} from "react-redux"
import {useRef} from "react"
import {createItem} from "../redux/items/thunks"
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const AddListItem = ({ owner, currentUser, open, setOpen, createItem }) => {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(false)

  const styleRequired = {
    color: "#ffaaaa"
  }

  const clearForm = () => {
    setName('')
    setUrl('')
    setDescription('')
    setError(false)
    setOpen(false)
  }

  const handleCancel = () => {
    clearForm()
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Name: " + name)
    console.log("URL: " + url)
    console.log("Description: " + description)

    if (name && name.length) {
      const completeUrl = url.trim().length > 0 && url.substring(0, 4) !== "http" ? "http://" + url : url

      var item = {
        owner: owner,
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
      </DialogContent>
      <DialogActions>
          <Button onClick={handleCancel} color="primary">
            Annuleer
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Voeg toe
          </Button>
        </DialogActions>
{/* 
      <form onSubmit={handleSubmitEvent} ref={formRef}>
        <h3 className="page-header">Voeg toe</h3>

        <div className="form-group">
          <label htmlFor="listItemName">Naam <span style={styleRequired}>*</span></label>
          <input type="text" className="form-control" id="listItemName" placeholder="Naam" ref={nameRef} />
        </div>

        <div className="form-group">
          <label htmlFor="listItemUrl">Website</label>
          <input type="text" className="form-control" id="listItemUrl" placeholder="URL" ref={urlRef} />
        </div>

        <div className="form-group">
          <label htmlFor="listItemDescription">Omschrijving</label>
          <textarea className="form-control" rows="3" id="listItemDescription" placeholder="Omschrijving" ref={descriptionRef} />
        </div>

        <hr />

        <button type="submit" className="btn btn-primary">Voeg toe</button>
        <button type="reset" className="btn btn-link">Annuleer</button>
      </form> */}
    </Dialog>
  )
}

const mapStateToProps = state => ({
  currentUser: state.currentUser
});

const mapDispatchToProps = dispatch => ({
  createItem: (item) => dispatch(createItem(item))
});


const ConnectedAddListItem = connect(mapStateToProps, mapDispatchToProps)(AddListItem)
export default ConnectedAddListItem;
