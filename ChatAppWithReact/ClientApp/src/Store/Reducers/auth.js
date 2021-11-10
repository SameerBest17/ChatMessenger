const initState = {
    authUser:{},
    allUsers:{},
    Rooms:{},
    authLogin:false,
    HubConnection:''
          }


 export const authReducer = (state = initState, action) =>{
    switch(action.type){
          case "Login_Success":
              return  {
                  ...state,
                authUser: action.payload,
                authLogin:true
              }

              case "ALLUSERS":
              return  {
                  ...state,
               allUsers:action.payload
              }

              case "JoinedRooms":
                return  {
              ...state,
              Rooms:action.payload
          }
          case "Hubstart":
            return  {
          ...state,
          HubConnection:action.payload
      }
          case "LOGOUT":
              console.log("LOGOUT!")
            return  {
                ...state,
                authUser:{},
                allUsers:{},
                Rooms:{},
                HubConnection:'',
                authLogin:false}

        default:
            return state;
        

      }

      
  }