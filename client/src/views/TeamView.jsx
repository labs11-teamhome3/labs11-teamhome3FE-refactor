import React from 'react';

////Components////
import TabNavigator from '../components/TeamView/TabNavigator';

const TeamView = props => {
  return (
    <div>
      <TabNavigator match={props.match} history={props.history} />
      {/* <TodoListContainer match={props.match} history={props.history} /> */}
    </div>
  );
};

export default TeamView;
