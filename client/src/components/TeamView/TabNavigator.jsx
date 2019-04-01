import React, { useState } from "react";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

///////Components/////////
import TodoListContainer from "./TodoListContainer";
import TeamSettingsModal from "./TeamSettingsModal";

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

const TabNavigator = props => {
  const [tab, setTab] = useState(0);

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
        <TabContainer>Item One</TabContainer>
        <TabContainer>Item Two</TabContainer>
        <TabContainer>Item Three</TabContainer>
        <TabContainer>
          <TodoListContainer match={props.match} history={props.history} />
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
