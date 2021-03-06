import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import TodosTab from './Tabs/TodosTab/TodosTab';

import MessageTab from './Tabs/MessageTab/MessageTab';
import DocumentTab from './Tabs/DocumentTab/DocumentTab'
import TeamSettingsTab from './Tabs/TeamSettingsTab/TeamSettingsTab';
import Tutorial from './Tutorial';

import { useQuery } from 'react-apollo-hooks';
import { TEAM_QUERY } from '../../graphQL/Queries';

const styles = theme => ({
  root: {

  }
})

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

const TabNavigator = props => {
  // const userId = localStorage.getItem('userId')
  const [tab, setTab] = useState(0);

  const handleChange = (event, value) => {
    setTab(value);
  };

  const handleChangeIndex = index => {
    setTab(index);
  };

  const teamQuery = useQuery(TEAM_QUERY, {
    variables: {
      id: props.match.params.id
    }
  })

  console.log('tq data', teamQuery.data)

  const { classes } = props; 
  return (
    <div className={classes.root}>
      <AppBar position="static" color='primary'>
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          <Tab style={{color: '#ffffff'}} label="Messages" />
          <Tab style={{color: '#ffffff'}} label="Documents" />
          <Tab style={{color: '#ffffff'}} label="Todos" />
          <Tab style={{color: '#ffffff'}} label="Settings" />
        </Tabs>
      </AppBar>
      {teamQuery.data.team && teamQuery.data.team.members.length < 2 &&
        <Tutorial team={teamQuery.data.team} />
      }
      <SwipeableViews axis="x" index={tab} onChangeIndex={handleChangeIndex}>
        <TabContainer>
          <MessageTab teamId={props.match.params.id} setMsg={props.setMsg} />
        </TabContainer>

        <TabContainer>
          <DocumentTab teamId={props.match.params.id} setMsg={props.setMsg} />
        </TabContainer>

        <TabContainer>
          <TodosTab teamId={props.match.params.id} setMsg={props.setMsg} />
        </TabContainer>

        <TabContainer>
          <TeamSettingsTab teamId={props.match.params.id} match={props.match} history={props.history} setMsg={props.setMsg}/>
        </TabContainer>
      </SwipeableViews>
    </div>
  );
};

export default withStyles(styles)(TabNavigator);
