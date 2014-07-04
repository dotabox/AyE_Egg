(function(){

	BKGM.Trung= function () {
		BKGM.Trung.superclass.constructor.call(this);
		
        return this;
	};
	BKGM.Trung.prototype={
		init:function(map,Game,speed){
			this.map=map;
			this.speed=speed||2;
			var Images=Game.resource.images;
			// this.width=Images['trung'].width/4;
			// this.height=Images['trung'].height/4;
			// this.sprite=new BKGM.Sprite({image:Images['trung'],rows:4,columns:4});
			// this.setSize(TILE_SIZE,TILE_SIZE);
			var sprite = new BKGM.Sprite({image:Images["trung"],rows:4,columns:4})
						.addAnimation("down",[0,1],200,"loop")
						.addAnimation("up",[12,13],200,"loop")
						.addAnimation("left",[4,5],200,"loop")
						.addAnimation("right",[8,9],200,"loop")
						.playAnimation("down");

			// this.sprite.addAnimation("down",[0,1,2,3],200,'loop');
			// this.sprite.playAnimation("down")
			this.addSprite(sprite);

			this.x=400;
			this.y=400;
		},
		move:function(name){
			switch (name){
				case "left":
					if(this.sprite.name!="left")this.playAnimation("left"); 
					// var x=(this.x-this.map.x)/TILE_SIZE>>0;
					if(!this.collision("left"))
						this.x-=this.speed;
				break;
				case "right":
					if(this.sprite.name!="right")this.playAnimation("right"); 
					if(!this.collision("right"))
					this.x+=this.speed;
				break;
				case "up":
					if(this.sprite.name!="up")this.playAnimation("up"); 
					if(!this.collision("up"))
					this.y-=this.speed;
				break;
				case "down":
					if(this.sprite.name!="down")this.playAnimation("down"); 
					if(!this.collision("down"))
					this.y+=this.speed;
				break;
			}		
		},
		collision:function(name){
			// var TILE_SIZE =64;
			switch (name){
				case "left":					 
					var x=(this.x-this.map.x-this.width/2)/TILE_SIZE>>0;
					var y=(this.y-this.map.y)/TILE_SIZE>>0;
					if(this.x-this.map.x-this.width/2<0) {x=0;return true;}
					if(this.map.data[y][x]!=1) return true;					
					// var x1=(this.x-this.map.x)/TILE_SIZE>>0;
					// var y1=(this.y-this.map.y)/TILE_SIZE>>0;
					// console.log(this.map.data[y1][x1]==1)
					// console.log(BKGM.checkMouseBox({x:x,y:y},this.map.mapdata[x/TILE_SIZE>>0-1][y/TILE_SIZE>>0]))
					// if(this.map.data[y][x]==1) return true;
				break;
				case "right":
					var x=(this.x-this.map.x+this.width/2)/TILE_SIZE>>0;
					var y=(this.y-this.map.y)/TILE_SIZE>>0;
					var t=this.map.data[0].length-1;
					if(x>t) {x=t;return true;}
					if(this.map.data[y][x]!=1) return true;
					
				break;
				case "up":
					var x=(this.x-this.map.x)/TILE_SIZE>>0;
					var y=(this.y-this.map.y-this.height/2)/TILE_SIZE>>0;
					if(this.y-this.map.y-this.height/2<0) {y=0;return true;}
					if(this.map.data[y][x]!=1) return true;
					console.log(x,y)
				break;
				case "down":
					var x=(this.x-this.map.x)/TILE_SIZE>>0;
					var y=(this.y-this.map.y+this.height/2)/TILE_SIZE>>0;
					var t=this.map.data.length-1;
					if(y>t) {y=t;return true;}
					if(this.map.data[y][x]!=1) return true;
				break;
			}	
		},
		isEat:function(actor){
			var x = this.x;
			var y=this.y;
			var e={x:x,y:y};
			return BKGM.checkMouseBox(e,actor);
		}
	}
	extend(BKGM.Trung,BKGM.Actor);
})();