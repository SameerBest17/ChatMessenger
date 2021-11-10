export const logIn =(user)=>{
    return {
        type:"Login_Success",
        payload:user
    }
};
export const logout =()=>{
    return {
        type:"LOGOUT",
    }
};

