export const HubConnection =(conc)=>{
    console.log(conc)
    return {
        type:"Hubstart",
        payload:conc
    }
};

