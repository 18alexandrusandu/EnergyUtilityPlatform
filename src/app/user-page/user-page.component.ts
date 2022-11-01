import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { Router } from '@angular/router'
import { Chart } from 'chart.js';
import { ChartType } from 'chart.js';
import { Device } from '../device';
import { Measurement } from '../measurement';
import { Subject } from 'rxjs/internal/Subject';
import { LocatorService } from '../locator.service';



@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
   host="http://localhost:8080"
  user:any;
  devices:any;
  day:any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  url1=this.host+"/user/"
  constructor(private httpc:HttpClient,private router:Router,private lt: LocatorService) { this.dtOptions = {
   
    pagingType: 'full_numbers',
    pageLength: 5,
    processing: true


   }
   this.host=lt.getHost();
   this.url1=this.host+"/user/"
  }

        remove_duplicates_devices(){
         
          
          
            var copy_dev=[];
            

           
            if(this.devices.length>1){

             copy_dev.push(this.devices[0])
                
               
         for(let i=1;i<this.devices.length;i++)
         {    
              var  d=this.devices[i];
             
                    
          
             var inside=false;
             
              for(let k=0;k< copy_dev.length;k++)
              {
                     if(copy_dev[k].id==d.id)
                       inside=true;

              }
              if(!inside)
              copy_dev.push(this.devices[i])
             
             
         }
        }

         
         this.devices=copy_dev;
      
      }
            

   make_Chart(devices:any,date:any)
   {



    console.log("deve:",devices," ",devices.length);





       var canvases= document.getElementsByClassName("chart_use");

        while(canvases[0])
        if(canvases[0].parentNode)
        canvases[0].parentNode.removeChild(canvases[0])





      
     
          let i=0;
     for(let device of devices )
     {      var dataValues:any=[ ] 
            var labels:any=[]
           console.log("DEVICE:",i,device);
           i=i+1

           var div_device=document.createElement("div");
           div_device.classList.add("chart_use");

          var parag=document.createElement("p");
           parag.textContent=device.name;

           div_device.appendChild(parag);
          var dev:Device=device;


          var  measurements= dev.measurements
          console.log("measurementD",measurements);

          for(let measure of measurements)
          {
             console.log(measure["date"],this.day);

            if(measure["date"]==this.day)
            {
              console.log("Yes")
             dataValues.push(measure["energyConsumption"])
             labels.push(measure["time"])
            }

          }
          console.log("table data",labels,dataValues);


         var canvas= document.createElement("canvas");
                   
                   
                   
                   
                  var body= document.getElementById("charts_section");

                
                  


                   if(body)
                   {
                     div_device.appendChild(canvas);
                     body.appendChild(div_device);

                   }
                 var bdy=document.getElementById("body");
                   if(bdy && bdy instanceof HTMLBodyElement)
                   {
                     bdy.style.height= bdy.style.height+1000;


                   }




                  console.log(body);
                 
        var ctx=canvas.getContext("2d")
        if(ctx){
                   
               if($("body").width())
               {
                var num=$("body").width();
                console.log("num",num);
                if(num)
                {
                  $("body").width(num+10000);
                  console.log("2num",  $("body").width());

                }
                

               }
               
               

                 
                 console.log(canvas);
                 console.log("data values:",dataValues)

        const myChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: labels,
              datasets: [{
                  label: "Cunsumption on given day",
                  data: dataValues,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255, 99, 132, 1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });

    }

    


  }



    }

   


  change_title()
  {
    var title= document.getElementById("title");
    if(title)
     title.textContent=title.textContent+" "+this.user["name"];

  }

  setDate()
  {
    console.log("blurrr");
    var elem=document.getElementById("date");
    if(elem && elem instanceof HTMLInputElement)
    {

    this.day=elem.value;
    console.log(this.devices)
    this.make_Chart(this.devices,this.day);

    }


  }
  ngOnInit(): void {
   var ua= sessionStorage.getItem("type");
   if(ua=="USER")
   {

    console.log("este permis accesul");
   
      
             
      var idUser=sessionStorage.getItem("idUser");
      
        this.httpc.get(this.url1+idUser).subscribe(data=>{
          
          this.user=data;
          
          console.log("USER:",this.user);
          this.change_title();
           this.devices=this.user.devices;
           
           this.dtTrigger.next("2");
           this. remove_duplicates_devices()
           this.make_Chart(this.devices,this.day);







          
        });
      


   }
  else{
    console.log("nu este permis accesul");
    this.router.navigate(["/home"]);
   }

  }
}
