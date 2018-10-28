import { Component, OnInit,OnDestroy } from '@angular/core';
import { HttpService } from './services/http.service';
import { WeBSocketService } from './services/we-bsocket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit,OnDestroy {

    
    connection: any;
    arrAllOrders:any=[];
    arrDish:any=[];
    selectedDish:any;
    qty:any=1;
    constructor(public http:HttpService,public websocket:WeBSocketService) { }

    ngOnInit() {
        try{
            this.getDishList();
            this.getAllOrders();
            this.subscribeSocket();
        }catch(e) {
            console.log(e,"ngOnInit()"+"app.component");
        }
    }
    getDishList(){
        this.http.get('GetAllDish').subscribe((resp:any)=>{
            if(resp!=null){
            this.arrDish= resp.data;
            this.selectedDish=this.arrDish[0];
            }
        });
    }
    subscribeSocket(){
        this.connection = this.websocket.getMessages().subscribe((message:any) => {
            console.log("scojeee",message);
            if(message!=null){
                if(message.data.type=="modify")
                    this.updateOrders(message.data.value);
                else
                    this.addOrder(message.data.value)
            }
        });
    }
    addOrder(order){
        this.arrAllOrders.push(order);
    }
    updateOrders(orders){
        try{
                for(var index=0;index<this.arrAllOrders.length;index++){
                    if(orders.Id==this.arrAllOrders[index].Id){
                        this.arrAllOrders[index]=orders;
                        break;
                    }
                }
        } catch(e) {
            console.log("updateOrders()"+"app.component",e);
        }
    }
   
    sendMessageOnSocket(data) {
        try{  
            this.websocket.sendMessage(data);
        }catch(e)  {
            console.log("sendMessageOnSocket()"+"app.component",e);
        }
    }

   
     
      getAllOrders(){
        try{
            this.http.get('GetFirstOrders').subscribe((resp:any)=>{
                if(resp!=null){
                this.arrAllOrders= resp.data;
                }
            });
        }catch(e)  {
            console.log("getAllOrders()"+"app.component",e);
        }
      }
      onClickDone(data){
          try{
            data.CTN=Number(data.CTN)+Number(data.Quantity);
            data.Status="Done";
            var dataToSend={"type":"modify","value":data}
            this.sendMessageOnSocket(dataToSend);
        }catch(e)  {
            console.log("onClickDone()"+"app.component",e);
        }
      }

      exportToCSV()
      {
          try{
            var data=this.arrAllOrders;
            var filename="orders";
            var csvData = this.ConvertToCSV(data);
            var a: any = document.createElement("a");
            a.setAttribute('style', 'display:none;');
            document.body.appendChild(a);
            var blob = new Blob([csvData], { type: 'text/csv' });
            var url= window.URL.createObjectURL(blob);
            a.href = url;
            
            var isIE = /*@cc_on!@*/false || !!(<any> document).documentMode;
            
            if (isIE)
            {   
                var retVal = navigator.msSaveBlob(blob, filename+'.csv');
            }
            else{
                a.download = filename+'.csv';
            }
            // If you will any error in a.download then dont worry about this. 
            a.click();
        }catch(e)  {
            console.log("exportToCSV()"+"app.component",e);
        }
      }
        // convert Json to CSV data
        ConvertToCSV(objArray:any) {
            try{
                var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
                var str = '';
                var row = "";

                for (var index in objArray[0]) {
                    //Now convert each value to string and comma-seprated
                    row += index + ',';
                }
                row = row.slice(0, -1);
                //append Label row with line break
                str += row + '\r\n';

                for (var i = 0; i < array.length; i++) {
                    var line = '';
                    for (var index in array[i]) {
                        if (line != '') line += ','

                        line += '"'+array[i][index]+'"';
                    }

                    str += line + '\r\n';
                }

                return str;
            }catch(e)  {
                console.log("ConvertToCSV()"+"app.component",e);
            }
        }
        placeOrder(){
            var id=Number(this.arrAllOrders[this.arrAllOrders.length-1].Id);
            var objOrder={ 
            "Id":id+1,
            "Name":this.selectedDish.Name,
            "CTN":0,
            "Quantity":this.qty,
            "Predicted":76,
            "Status":"Pending"
            };

            var data={"type":"add","value":objOrder}
            this.sendMessageOnSocket(data);
        }
        ngOnDestroy() {
            try{
                this.connection.unsubscribe();
            } catch(e) {
                console.log("ngOnDestroy()"+"app.component",e);
            }
        }
}

