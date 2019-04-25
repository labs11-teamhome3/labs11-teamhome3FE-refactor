import React from 'react'

import './css/Landing.css'

class LandingPage extends React.Component {

    login = async () => {
        await this.props.auth.login();
    };
    
    signup = async () => {
        await this.props.auth.signup();
    };

    render(props) {
        return (
            <div className="container">
                <div className="position-nav">
                    <div className="nav-container">
                        <img src="https://res.cloudinary.com/color-shift-studio/image/upload/v1555968080/manaje/favicon.jpg" alt="manaje logo" className="logo" />
                        <div className="button-container">
                            <div className="login" onClick={this.login}>Log In</div>
                            <div className="signup" onClick={this.signup}>Sign Up</div>
                        </div>
                    </div>  
                </div>
                
                <section className="main">
                    <div className="cta-text">
                    <h2>
                        Manaje was created to help teams. Period.
                    </h2>
                    <h4>Manaje messaging, documents, and todolists enable you to keep work organized and easy.</h4>
                    <div className="cta-signup" onClick={this.signup}>Sign Up - It's Free!</div>
                    </div>
                    
                    <div className="img-container">
                        <img src="https://res.cloudinary.com/color-shift-studio/image/upload/v1556155919/manaje/CreateDocument.gif" alt="create document gif" />
                    </div>
                </section>
                
                <section className="second">
                    <div className="display">
                        <img src="https://res.cloudinary.com/color-shift-studio/image/upload/v1556171858/manaje/undraw_checking_boxes_2ibd.svg" alt="todolist" className="img" />
                        <div className="text">
                            <h5>Work with others</h5>
                            <h6>Write out lists, assign members, and check off boxes.</h6>
                            <div className="start-button" onClick={this.signup}>Get started</div>
                        </div>
                    </div>
                    
                    <div className="display second-display">
                        <img src="https://res.cloudinary.com/color-shift-studio/image/upload/v1556171850/manaje/undraw_online_friends_x73e.svg" alt="messages" className="img" />
                        <div className="text">
                            <h5>Communicate more often</h5>
                            <h6>Talk openly, reply, keep all team members in the loop.</h6>
                            <div className="start-button" onClick={this.signup}>Try it</div>
                        </div>
                    </div>
                    
                    <div className="display third-display">
                        <img src="https://res.cloudinary.com/color-shift-studio/image/upload/v1556171847/manaje/undraw_filing_system_b5d2.svg" alt="documents" className="img" />
                        <div className="text">
                            <h5>Keep all files centralized</h5>
                            <h6>Upload files, comment on those files, organize them in folders.</h6>
                            <div className="start-button" onClick={this.signup}>Begin now</div>
                        </div>
                    </div>
                </section> 
                <footer className="footer">
                    <div className="name">Manaje</div>
                    <div className="copy-right"> &nbsp;© Copyright 2019. All rights reserved. </div>
                </footer>
            </div>
        )
    }
}

export default LandingPage;