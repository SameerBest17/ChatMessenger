const initState = {
    Rooms:{}
          }


 export const roomReducer = (state = initState, action) =>{
      switch(action.type){
          case "JoinedRooms":
              console.log(action.payload)
              return  {
            ...state,
            Rooms:action.payload
        }
        default:
            return state;
      }
   
  }