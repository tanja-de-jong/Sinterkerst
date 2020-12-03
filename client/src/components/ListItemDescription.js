var React = require('react');

const ListItemDescription = ({ description }) => {
    return (
      <div className="panel-body">
        {description}
      </div>
    );
};

export default ListItemDescription