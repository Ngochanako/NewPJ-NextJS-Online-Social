// function convert time
export const convertTime=(time:number)=>{
    if(time<1){
        return 'Vừa xong'
    }else if(time<60){
     return `${Math.floor(time)} minutes`
    }else if(time<720){
     return `${Math.floor(time/60)} h`
    }else{
     return `${Math.floor(time/720)} days ago`
    }
 }