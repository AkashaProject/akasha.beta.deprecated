import React, { PropTypes } from 'react';
import { Column } from './';

const Dashboard = ({ columns, selectedDashboard }) => (
  <div style={{ display: 'flex', padding: '0 10px', height: '100%', backgroundColor: '#f7f7f7' }}>
    {selectedDashboard.get('columns').map((id) => {
        const column = columns.get(id);
        const width = column.get('large') ? '720px' : '360px';
        return (
          <div key={id} style={{ margin: '0 10px', width }}>
            <Column column={column} />
          </div>
        );
    })}
  </div>
);

Dashboard.propTypes = {
    columns: PropTypes.shape(),
    selectedDashboard: PropTypes.shape()
};

export default Dashboard;
