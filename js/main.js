(function(){
    var splashscreenIMG = new Image();
        splashscreenIMG.src="img/2egg.jpg";
	// Wait for device API libraries to load
            //
            document.addEventListener("deviceready", onDeviceReady, false);
            window.addEventListener("load", onDeviceReady, false);

            // device APIs are available
            //
            function onDeviceReady() { 
                var canvas = document.getElementById('canvas');
                var ctx=canvas.getContext('2d');
                new AutoScaler(canvas,1024,600,0.15);
                ctx.drawImage(splashscreenIMG,0,0,1024,600);
            	var preload= new BKGM.preload();           	
				preload.load("image","2egg","img/2egg.jpg")
                        .load("image","title1","img/slice1.png")
                        .load("image","title0","img/slice2.png")
                        .load("image","trung","img/monster1.png")
                        

					//		 .load("audio","slap","audio/slap");
				preload.onloadAll= function(){ //khi load xong het
    
					 //load xong het chay windowLoad
                     windowLoad(preload); 
				}
                
            }
	// window.onload=function(){
        function windowLoad(preload) {
   //      	if (navigator.isCocoonJS) {
			//     CocoonJS.App.setAntialias(true);
			// }
            var director;
            var _fb;
            var data1=[[1,1,1,1,1,1,1,1,1],[1,0,0,0,0,0,0,0,1],[1,0,1,1,1,1,1,0,1],[1,0,0,0,1,0,0,0,1],[1,1,1,1,1,0,1,1,1],[1,0,0,0,0,0,0,0,1],[1,1,1,1,1,1,1,1,1]];
            // BKGM.debug=1;
            var Game = new BKGM({
			    //setup luc dau vao
            setup :function(){
               this.addRes(preload);
               var Game = this;

                director = new BKGM.States();
                // this.addStates(director)
                
                var Images=Game.resource.images;
                director.state("menu", [
                        "menusetup",
                        "mainbg",
                        "button"
                ]);
                director.state("game", [
                        "gamesetup",
                        "gamemain",
                        "key",
                        "trung",
                        "title"
                ]);
                director.state("gameover", [
                    "gameoversetup",
                    "gameoverbg",
                    "button1"
                ]);
                var map=new BKGM.Map();
                map.init(data1,Game);
                var trung=new BKGM.Trung();
                trung.init(map,Game,5);
                var key=new BKGM.Actor();
                key.setBounds(500,500,50,50);
                key.visible=true;
                var level=1;
                var isOpen=false;
                var startTime=0;
                var durTime=30000;
                key._draw=function(){
                    var ctx=Game.ctx;
                    ctx.save();
                    ctx.fillStyle="#ff00ff";
                    ctx.translate(this.x,this.y);
                    ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height)
                    ctx.restore();
                }
                var gate=new BKGM.Actor();
                gate.setBounds(550,500,50,50);
                gate.visible=true;
                var isOpen=false;
                var lvlup=false;
                gate._draw=function(){
                    var ctx=Game.ctx;
                    ctx.save();
                    ctx.fillStyle="#ff0000";
                    ctx.translate(this.x,this.y);
                    ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height)
                    ctx.restore();
                }
                director.taskOnce("gamesetup",function(){
                    isOpen=false;
                    key.visible=true;
                    startTime=Game.time;
                    durTime=30000;
                    trung.setPosition(400,400);
                    lvlup=false;
                })
                director.task("gamemain",function(){   
                    if(keyState[37]) trung.move("left");               
                    if(keyState[38]) trung.move("up");                
                    if(keyState[39]) trung.move("right");                
                    if(keyState[40]) trung.move("down"); 
                    if(trung.isEat(key)&&!isOpen) {
                        isOpen=true;
                        key.visible=false;
                    }  
                    if(isOpen&&trung.isEat(gate)){
                        level++;
                        lvlup=true;
                        director.switch("gameover",true)
                    }           
                })
                director.task("gamemain",function(){
                    map.draw(Game);

                },true)
                director.task("title",function(){
                    var ctx=Game.ctx;
                    ctx.fillStyle="#ff0000";
                    ctx.font="30px UTM Avo ";
                    var text="Level "+level;                    
                    ctx.fillText(text,map.x+50,50);
                    var time="Time:";  
                    var atime=(durTime-(Game.time-startTime))/1000>>0;
                    if(atime<0) {
                        atime=0;
                        director.switch("gameover",true);
                    }
                    var x=Game.WIDTH/2 - ctx.measureText(atime).width/2          
                    ctx.fillText(atime,x,50);
                    ctx.fillText(time,x-100,50);
                },true)
                director.taskActor("trung",trung)
                director.task("key",function(){
                    if(key.visible)
                        key._draw(Game);
                    gate._draw(Game);
                },true);

                director.taskOnce("gameoversetup",function(){
                    // isOpen=false;
                    // key.visible=true;
                })
                
                director.task("gameoverbg",function(){
                    var ctx=Game.ctx;
                    ctx.save();
                    ctx.drawImage(director.cache,0,0);
                    ctx.fillStyle="#ff0000";
                    ctx.font="100pt UTM Avo ";
                    var text;
                    if(!lvlup) text="Game over"; 
                    else text="Next level";                    
                    ctx.fillText(text,Game.WIDTH/2 - ctx.measureText(text).width/2,300);
                    // ctx.fillRect(0,0,Game.WIDTH,Game.HEIGHT)
                    ctx.restore();                  
                },true)

                director.switch("game")
                Game.mouseDown=function(e){
                    switch (director.current){
                        case "menu":

                                    for (var i = buttonEvents.length - 1; i >= 0; i--) {
                                        if(BKGM.checkMouseBox(e,buttonEvents[i])){
                                            buttonEvents[i].action();
                                        }
                                    };
                                    break;  
                        case "gameover":   
                                    director.switch("game",true)                         
                                    // for (var i = buttonOverEvents.length - 1; i >= 0; i--) {
                                    //     if(BKGM.checkMouseBox(e,buttonOverEvents[i])){
                                    //         buttonOverEvents[i].action();
                                    //     }
                                    // };
                                    break;                      
                    }
                }
                var keyState=[];
                Game.keyDown=function(e){
                    switch(e.keyCode){
                        case 37: keyState[37]=true; e.preventDefault();  break;
                        case 38: keyState[38]=true; e.preventDefault();  break;
                        case 39: keyState[39]=true; e.preventDefault();  break;
                        case 40: keyState[40]=true; e.preventDefault();  break;
                        case 13: if(lvlup) director.switch("game",true);break;

                    }
                }
                Game.keyUp=function(e){
                    switch(e.keyCode){
                        case 37: keyState[37]=false; e.preventDefault();  break;
                        case 38: keyState[38]=false; e.preventDefault();  break;
                        case 39: keyState[39]=false; e.preventDefault();  break;
                        case 40: keyState[40]=false; e.preventDefault();  break;

                    }
                }
               

            },

            //chay vong lap lien tuc
            draw: function(game){
              // console.log(Game);
                 director.draw(game)
            },
            //Chay thuat toan
            update:function(Game){
               
               director.run();
            }
			}).run();
        }
	// };
})();
