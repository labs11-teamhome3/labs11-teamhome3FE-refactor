import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import TodoListContainer from './TodoListContainer';
import TeamSettingsModal from './TeamSettingsModal';
import MessageTab from './Tabs/MessageTab/MessageTab';
import DocumentTab from './Tabs/DocumentTab/DocumentTab'
import ActivityTimelineTab from './Tabs/ActivityTimelineTab/ActivityTimelineTab';

import { useMutation } from '../../graphQL/useMutation';

import { CREATE_EVENT } from '../../graphQL/Mutations';
import {
  MESSAGES_QUERY,
  USERS_QUERY,
  MESSAGE_QUERY,
  EVENTS_QUERY
} from "../../graphQL/Queries";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

const TabNavigator = props => {
  const userId = localStorage.getItem('userId')
  const [tab, setTab] = useState(0);
  const [msg, setMsg] = useState(null);

  useEffect( _ => {
    createEvent();
  }, [msg])

  const [createEvent] = useMutation(CREATE_EVENT, {
    update: (cache, { data }) => {
      // console.log(data.createMessage)
      const {findEventsByTeam} = cache.readQuery({
        query: EVENTS_QUERY,
        variables: { teamId: props.match.params.id },
      });
      cache.writeQuery({
        query: EVENTS_QUERY,
        variables: { teamId: props.match.params.id },
        data: { findEventsByTeam: [...findEventsByTeam, data.addEvent] },
      });
    },
    variables: {
      action_string: msg,
      object_string: '',
      userId: userId,
      teamId: props.match.params.id,
    },
    onCompleted: e => {
    },
    onError: err => console.log(err),
  });

  const handleChange = (event, value) => {
    setTab(value);
  };

  const handleChangeIndex = index => {
    setTab(index);
  };

  console.log(props);

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Message Board" />
          <Tab label="Activity Timeline" />
          <Tab label="Documents" />
          <Tab label="Todos" />
        </Tabs>
      </AppBar>
      <SwipeableViews axis="x" index={tab} onChangeIndex={handleChangeIndex}>
        <TabContainer>
          <MessageTab teamId={props.match.params.id} setMsg={setMsg} />
        </TabContainer>

        <TabContainer>
          <ActivityTimelineTab teamId={props.match.params.id} setMsg={setMsg} />
        </TabContainer>

        <TabContainer>
          <DocumentTab teamId={props.match.params.id} setMsg={setMsg} />
        </TabContainer>

        <TabContainer>
          <TodoListContainer match={props.match} history={props.history} setMsg={setMsg} />
        </TabContainer>
      </SwipeableViews>
      <TeamSettingsModal
        teamID={props.match.params.id}
        history={props.history}
      />
    </div>
  );
};

export default TabNavigator;
