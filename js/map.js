var TILE_SIZE=80;
(function(){
	

	BKGM.Map= function () {
		// BKGM.Map.superclass.constructor.call(this);
		
        return this;
	};
	BKGM.Map.prototype={
		init:function(data,Game){
			this.data=data;
			this.mapdata=data.concat();
			this.x=Game.width/2-TILE_SIZE*data[0].length/2;
			this.y=Game.height/2-TILE_SIZE*data.length/2;
			for (var i = this.data.length - 1; i >= 0; i--) {
				for (var j = this.data[0].length - 1; j >= 0; j--) {

					if(this.data[i][j]===1){
						this.mapdata[i][j].x=j*TILE_SIZE;
						this.mapdata[i][j].y=i*TILE_SIZE;
						this.mapdata[i][j].width=TILE_SIZE;
						this.mapdata[i][j].height=TILE_SIZE;
					}
					if(this.data[i][j]===0){					
						this.mapdata[i][j].x=j*TILE_SIZE;
						this.mapdata[i][j].y=i*TILE_SIZE;
						this.mapdata[i][j].width=TILE_SIZE;
						this.mapdata[i][j].height=TILE_SIZE;
					}
				};
				// ctx.drawImage(Images[this.data[i]])
			};
		},
		draw:function(Game){
			var ctx=Game.ctx;
			var Images=Game.resource.images;
			ctx.save();
			ctx.translate(this.x,this.y)
			for (var i = this.data.length - 1; i >= 0; i--) {
				for (var j = this.data[0].length - 1; j >= 0; j--) {

					if(this.data[i][j]===1){
					ctx.drawImage(Images['title1'],j*TILE_SIZE, i*TILE_SIZE,
							TILE_SIZE, TILE_SIZE);
					}
					if(this.data[i][j]===0){					
					ctx.drawImage(
						Images['title0'],
							j*TILE_SIZE, i*TILE_SIZE,
							TILE_SIZE, TILE_SIZE);
					}
				};
				// ctx.drawImage(Images[this.data[i]])
			};
			ctx.restore();
		}
	}

})();