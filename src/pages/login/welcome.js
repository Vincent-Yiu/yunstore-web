import React from 'react';
import {Redirect, withRouter} from "react-router-dom";
import axios from 'axios';
import '../../config';
import './welcome.css'
import 'animate.css';
import { Input,  Icon } from 'antd';


// axios.defaults.withCredentials = true;
class Welcome extends React.Component
{
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:'',
            // auth:'false' ,
            loginForm:true,
        };
        this.onChangeValue=this.onChangeValue.bind(this);
        this.submitfunc=this.submitfunc.bind(this);
    }
    
    onChangeValue(e)
    {
        this.setState({[e.target.name]:e.target.value});
        console.log(e.target.value);
    }

    showLogin=()=>{this.setState({loginForm:true})}
    showRegister=()=>{this.setState({loginForm:false})}
    submitfunc(e)
    {
        e.preventDefault();
        axios({
            url: global.host+'/login',
            method: 'post',
            params: {
                username: this.state.username,
                password: this.state.password,
            },
            type: 'json',
        }).then(res=>{
            if(res.data.msg==='success')
            {
                this.props.history.push('/yunstore');
                localStorage.setItem('auth','true');
            }
            else
            {
                alert("密码错误");
            }
        }).catch(res=>{
            // console.log('error');
        })
    }
    

    render()
    {
        let { from } = this.props.location.state || { from: { pathname: "/" } };
        let { redirectToReferrer } = this.state;

        if (redirectToReferrer) return <Redirect to={from} />;

        const login=(
        <div className='container'>
            <div className='wrapper'>
            <div id='login'>
                <form> 
                    <h1>Login</h1> 
                    <p> 
                        <label >您的电子邮件或用户名</label>
                        <Input id="username" name="username" placeholder="123" onChange={this.onChangeValue} prefix={<Icon type="user" />} required="required" type="text" />
                    </p>
                    <p> 
                        <label >密码</label>
                        <Input id="password" name="password" placeholder="12345" onChange={this.onChangeValue} prefix={<Icon type="key" />} required="required" type="password"  /> 
                    </p>
                    <p className="keeplogin"> 
					    <input type="checkbox" name="loginkeeping" id="loginkeeping" value="loginkeeping" /> 
						<label >记住登录状态</label>
					</p>
                    <p className="login button"> 
                        <input type="submit" value="Login" onClick={this.submitfunc}/> 
					</p>
                    <p className="change_link">
									还不是会员？
						<a href="#register"  onClick={this.showRegister}>加入我们</a>
					</p>
                </form>
            </div>
            </div>
        </div>
        );

        const register=(
            <div className="container" >
                <div className="wrapper">
                    <div id="register" >
                        <form  action="mysuperscript.php" autocomplete="on"> 
                            <h1> Sign up </h1> 
                            <p> 
                                <label >Your username</label>
                                <input id="usernamesignup" name="usernamesignup" required="required" type="text" placeholder="mysuperusername690" />
                            </p>
                            <p> 
                                <label > Your email</label>
                                <input id="emailsignup" name="emailsignup" required="required" type="email" placeholder="mysupermail@mail.com"/> 
                            </p>
                            <p> 
                                <label >Your password </label>
                                <input id="passwordsignup" name="passwordsignup" required="required" type="password" placeholder="eg. X8df!90EO"/>
                            </p>
                            <p> 
                                <label >Please confirm your password </label>
                                <input id="passwordsignup_confirm" name="passwordsignup_confirm" required="required" type="password" placeholder="eg. X8df!90EO"/>
                            </p>
                            <p className="signin button"> 
								<input type="submit" value="Sign up"/> 
							</p>
                            <p className="change_link">  
								Already a member ?
								<a href="#login"  onClick={this.showLogin}> Go and log in </a>
							</p>
                        </form>
                    </div>	
                </div>
            </div>  
            );    
       
        return this.state.loginForm?login: register;
    }
}

export default withRouter(Welcome);