import {connect} from "react-redux"
import {useRef} from "react"
import {createItem} from "../redux/items/thunks"

var React = require('react')

const AddListItem = (props) => {
  const formRef = useRef(null)
  const nameRef = useRef(null)
  const descriptionRef = useRef(null)
  const urlRef = useRef(null)

  const styleRequired = {
    color: "#ffaaaa"
  }

  const handleSubmitEvent = (event) => {
    event.preventDefault();

    let url = urlRef.current.value.trim()
    const completeUrl = url.length > 0 && url.substring(0, 4) !== "http" ? "http://" + url : url

    var item = {
      owner: props.owner,
      name: nameRef.current.value.trim(),
      url: completeUrl || '',
      description: descriptionRef.current.value.trim() || '',
      createdBy: props.currentUser,
    };
    props.createItem(item)
    formRef.current.reset()
  }

  return (
    <form onSubmit={handleSubmitEvent} ref={formRef}>
      <h3 className="page-header">Voeg toe</h3>

      <div className="form-group">
        <label htmlFor="listItemName">Naam <span style={styleRequired}>*</span></label>
        <input type="text" className="form-control" id="listItemName" placeholder="Naam" ref={nameRef} />
      </div>

      <div className="form-group">
        <label htmlFor="listItemUrl">URL</label>
        <input type="text" className="form-control" id="listItemUrl" placeholder="URL" ref={urlRef} />
      </div>

      <div className="form-group">
        <label htmlFor="listItemDescription">Omschrijving</label>
        <textarea className="form-control" rows="3" id="listItemDescription" placeholder="Omschrijving" ref={descriptionRef} />
      </div>

      <hr />

      <button type="submit" className="btn btn-primary">Voeg toe</button>
      <button type="reset" className="btn btn-link">Annuleer</button>
    </form>
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
