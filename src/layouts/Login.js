import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Button, Card, CardHeader, CardBody, CardFooter, Form, Input, InputGroupAddon, InputGroupText, InputGroup, Container, Col, } from "reactstrap";
import Axios from "axios";
import logo from "cp-logo.png";

const Login = ({ setAuth }) => {

    const loginValidate = () => {
        Axios.post("http://localhost:5000/ceciles/users/login",{
            email: emailReg,
            password: passwordReg
        }).then((response) =>{
            if(response.data.success == 1){
                console.log(response.data.token);
                setAuth(true);
            } else {
                console.log(response.data.message);
            }
        });
    }

    const [firstFocus, setFirstFocus] = useState(false);
    const [lastFocus, setLastFocus] = useState(false);

    const [emailReg, setEmail] = useState("");
    const [passwordReg, setPassword] = useState("");

    useEffect(() => {
        document.body.classList.add("login-page");
        document.body.classList.add("sidebar-collapse");
        document.documentElement.classList.remove("nav-open");
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        return function cleanup() {
        document.body.classList.remove("login-page");
        
        };
    }, []);

    const style = {width:"69%"};

    return (
        <>
        <div className="login"> 
            <div className="page-header clear-filter" filter-color="blue">
            <div className="content">
                <div className="container">
                    <Container>
                        <Col className="ml-auto mr-auto" md="4">
                            <Card className="card-login card-plain">
                                <Form action="" className="form" method="post">
                                    <CardHeader className="text-center">
                                        <img  alt=" " style={style} src={logo} />
                                        <h3>Stock Allocation System</h3>
                                    </CardHeader>
                                    <CardBody>
                                        <InputGroup  className={ "no-border input-lg" + (firstFocus ? " input-group-focus" : "") }>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="now-ui-icons users_circle-08"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input placeholder="Username"  type="text" onChange={(e) => setEmail(e.target.value)}  onFocus={() => setFirstFocus(true)} onBlur={() => setFirstFocus(false)} />
                                        </InputGroup>

                                        <InputGroup className={ "no-border input-lg" + (lastFocus ? " input-group-focus" : "") }>
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="now-ui-icons ui-1_lock-circle-open"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)}  onFocus={() => setLastFocus(true)} onBlur={() => setLastFocus(false)} />
                                        </InputGroup>
                                       
                                        <Button block className="btn-round" color="info" href="" onClick={() => loginValidate() } size="lg" >
                                            LOG IN{/* <Link  style={{color: "white"}} to="/admin"> LOG-IN  </Link> */}
                                        </Button>
                                       
                                    </CardBody>
                                    <CardFooter className="text-center">
                                        <div className="pull-center">
                                            <h6>
                                                <a className="link" href="#pablo" onClick={(e) => e.preventDefault()} >
                                                    Need Help?
                                                </a>
                                            </h6>
                                        </div>
                                    </CardFooter>
                                </Form>
                            </Card>
                        </Col>
                    </Container>
                </div>
            </div>
            </div>
        </div>
        </>
      );
}
 
export default Login;