const initState = {
    allUsers:{}
          }


 export const allUsersReducer = (state = initState, action) =>{
      switch(action.type){
              case "ALLUSERS":
              return  {
                  ...state,
               allUsers:action.payload
              }

              case "CLEAR":
                return  {
                    ...state,
                 allUsers:{}
                }

        default:
            return state;
        

      }

      
  }