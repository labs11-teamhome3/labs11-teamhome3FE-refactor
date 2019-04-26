import styled from 'styled-components';

export const styles = theme => ({
  root: {},
  listPaper: {
    overflow: "hidden",
    paddingBottom: "10px",
  },
  listTeamsPaper: {
    height: "279px",
    width: "50%",
    '@media (max-width: 850px)': {
      width: 'auto'
    },
    margin: "0 12px 15px 12px",
    overflow: "auto"
  },
  tabHeaders: {
    textAlign: 'left',
  },
  userSettingInput: {
    marginBottom: '10px',
  },
  userCard: {
    // padding: "0px 60px 20px 60px",
    '@media (max-width: 850px)': {
      width: 'auto'
    },
    position: "relative",
    margin: "0 12px 15px 12px",
    width: "50%",
    overflow: "hidden",
    maxHeight: "279px"
  },
  userCardFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "10px 60px 20px 20px",
    marginTop: "20px",
    minWidth: "450px",
  },
  userInfoIcons: {
    position: 'relative',
    top: '5px',
  },
  userInfoTypog: {
    cursor: 'pointer',
    '&:hover svg': {
      opacity: '1',
    },
  },
  myTeamsList: {
    maxHeight: '210px',
    overflow: 'auto',
  },
  pencils: {
    opacity: '1',
    transition: 'opacity 0.2s ease',
  },
  cardAppBar: {
    backgroundColor: theme.palette.secondary.dark
  },
  tabNav: {},
  tabNavCont: {
    margin: "0px 12px 0px 12px",
    overflow: "hidden"
  }
});

export const StyledAvatar = styled.img`
   {
    border-radius: 100px;
    height: 150px;
    @media (max-width: 850px) {
      height: 130px;
    }
    width: auto;
    margin-right: 20px;
  }
`;

export const StyledContainer = styled.div`
   {
    display: flex;
    justify-content: space-between;
    @media (max-width: 850px) {
      flex-direction: column; 
    }
    padding-top: 30px;
  }
`;

export const StyledTeams = styled.div`
  /* // border: solid gray 1px;
    display: flex;
    margin-left: 25px;
    flex-direction: column; */
    padding: 12px 12px 0 12px;
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 340px;
  button {
    position: absolute;
    top: 14px;
    right: 20px;
  }
  input {
    /* border: solid gray 1px;
      padding: 0px;
      margin-bottom: 20px;
      width: 500px;
      height: 50px;
      border-radius: 15px;
      ::placeholder {
        padding-left: 10px;
      } */
  }
`;