(function(){
	BKGM.getCorner=function (pivotX, pivotY, cornerX, cornerY, angle) {
 
	    var x, y, distance, diffX, diffY;
	 
	    /// get distance from center to point
	    diffX = cornerX - pivotX;
	    diffY = cornerY - pivotY;
	    distance = Math.sqrt(diffX * diffX + diffY * diffY);
	 
	    /// find angle from pivot to corner
	    angle += Math.atan2(diffY, diffX);
	 
	    /// get new x and y and round it off to integer
	    x = pivotX + distance * Math.cos(angle);
	    y = pivotY + distance * Math.sin(angle);
	 
	    return {x:x, y:y};
	}
	function getBounds(w, h, radians){
	    var a = Math.abs(Math.cos(radians)),
	        b = Math.abs(Math.sin(radians));
	 
	    return {h: h * a + w * b,
	            w: h * b + w * a}
	}
	BKGM.Actor = function(obj){
		var _this = this;
		if(obj){
			_this.setup = obj.setup || _this.setup;
			//_this.draw = obj.draw || _this.draw;
			//_this.update = obj.update || _this.update;
		}
		this.canvas = document.createElement('canvas');
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx=this.canvas.getContext('2d');
		return this;
    }
	BKGM.Actor.prototype={
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		_eventenable:true,
		_strokeStyle: "black",
		_fillStyle: "black",
		_BKGMIsMouseDown: false,
		childrentList: [],
		behaviorList:[],
		parent: null,
		setup: function (){
			return this;
		},
		_update: function(time){
			this.update();
			for (var i = this.behaviorList.length - 1; i >= 0; i--) {
				this.behaviorList[i].update();
			};
			for (var i = this.childrentList.length - 1; i >= 0; i--) {
				this.childrentList[i]._update();
			};
			return this;	
		},
		_draw: function(game){
			var ctx=game.ctx;
			// if(this.rotation){
			// 	this.sprite ? this.sprite.draw(this) : this.draw(this);	
			// }else {
				ctx.save();
				ctx.translate(this.x,this.y);
				
				
				
				var rotation=this.rotation;
				this.sprite ? this.sprite.draw(game,this.rotation) : this.draw(game);	
				if(BKGM.debug){
					ctx.rect(-this.width/2,-this.height/2,this.width,this.height);
					ctx.strokeStyle = this._strokeStyle;
					ctx.stroke();
				}
				ctx.restore();
				if(BKGM.debug){
					ctx.save();
					var rect = [this.x-this.width/2,this.y-this.height/2,this.width,this.height];
					var  c1, c2, c3, c4, b1 = {},  /// corners
					     bx1, by1, bx2, by2;       /// bounding box
					var px=this.x,py=this.y,ar=this.rotation;
					/// get corner coordinates
					c1 = BKGM.getCorner(px, py, rect[0], rect[1], ar);
					c2 = BKGM.getCorner(px, py, rect[0] + rect[2], rect[1], ar);
					c3 = BKGM.getCorner(px, py, rect[0] + rect[2], rect[1] + rect[3], ar);
					c4 = BKGM.getCorner(px, py, rect[0], rect[1] + rect[3], ar);
					 
					/// get bounding box
					bx1 = Math.min(c1.x, c2.x, c3.x, c4.x);
					by1 = Math.min(c1.y, c2.y, c3.y, c4.y);
					bx2 = Math.max(c1.x, c2.x, c3.x, c4.x);
					by2 = Math.max(c1.y, c2.y, c3.y, c4.y);
					// var bounds = [bx1, by1, bx2 - bx1, by2 - by1];
					ctx.rect(bx1, by1, bx2 - bx1, by2 - by1);
					ctx.strokeStyle = "red";
					ctx.stroke();
					ctx.restore();
				}
				

			// } 		
			for (var i = this.childrentList.length - 1; i >= 0; i--) {
				this.childrentList[i]._draw(game);
			};
			return this;
		},
		update:function(){
			return this;
		},
		draw:function(game){
			var ctx=game.ctx;
			this.rotation ? ctx.rotate(this.rotation):null;
			ctx.beginPath();
			ctx.rect(-this.width/2,-this.height/2,this.width,this.height);
			ctx.fillStyle=this._fillStyle;
			ctx.fill();
			ctx.strokeStyle = this._strokeStyle
			ctx.stroke();
			ctx.closePath();
			return this;
		},
		addChild: function(child){
			if(!child) return this;
			this.childrentList.push(child)
			child._id = this.childrentList.length;
			child.parent = this;
			return this;
		},
		removeChild:function (child) {
			var pos = this.findChild(child);
			var ret = this.removeChildAt(pos);
			return ret;
        },
		findChild:function (child) {
			var cl = this.childrenList;
			var i;
			var len = cl.length;
			for (i = 0; i < len; i++) {
				if (cl[i] === child) {
					return i;
				}
			}
			return -1;
        },
		removeChildAt:function (pos) {
			var cl = this.childrenList;
			var rm;
			if (-1 !== pos && pos>=0 && pos<this.childrenList.length) {
				cl[pos].setParent(null);
				rm = cl.splice(pos, 1);
				return rm[0];
			}
			return null;
		},
		setParent:function (parent) {
			if(!parent) return this;
			this.parent = parent;
			return this;
        },
		setBounds: function (x,y,w,h){
			this.x = x || this.x;
			this.y = y || this.y;
			this.width = w || this.width;
			this.height = h || this.height;
			return this;
		},
		setSize: function(w,h){
			this.width = w || this.width
			this.height = h || this.height;
			return this;
		},
		setPosition: function(x,y){
			this.x = x || this.x;
			this.y = y || this.y;
			return this;
		},
		getPosition: function(){
			return {
				x: this.x,
				y: this.y
			}
		},
		setFillStyle: function(fillStyle){
			this._fillStyle= fillStyle;
			return this;
		},
		setStrokeStyle: function(strokeStyle){
			this._strokeStyle= strokeStyle;
			return this;
		},
		setRotationAnchored:function(rotation,achorX,achorY){
			this.rotation=rotation;
			// console.log(rotation)
			// this.
			return this;
		},
		addSprite:function(sprite){
			this.sprite=sprite;
			this.canvas.width= this.width=sprite.width;
			this.canvas.height=this.height=sprite.height;

			return this;
		},
		removeSprite:function(){
			this.sprite=null;
			return this;
		},
		addAnimation:function(name, arr, time, endfn){
            this.sprite.animation[name]={arr:arr,time:time};
            this.sprite.endfn=endfn;
            return this;
        },
        playAnimation:function(name){
            this.sprite.playAnimation(name);
            return this;
        },
        eventEnable:function(on){
        	this._eventenable=on;
        	return this;
        },
        addBehavior:function(behavior){
        	this.behaviorList.push(behavior);
        	return this;
        },
        removeChild:function(behavior){
            this.behaviorList.splice(this.behaviorList.indexOf(behavior),1);
            return this;
        },
		mouseDrag: function(e){
			return this;
		},
		mouseDown: function(e){
			return this;
		},
		mouseUp: function(e){
			return this;
		},
		touchStart: function(e){
			return this;
		},
		touchEnd: function(e){
			return this;
		},
		touchMove: function(e){
			return this;
		}
	}
})();
(function(){
    BKGM.Sprite = function(obj){
        if(obj){
            this.image=obj.image||this.image;            
            this.rows=obj.rows||this.rows;
            this.columns=obj.columns||this.columns;
            this.maxIndex=this.columns*this.rows-2;
            this.width=this.image.width/this.columns;
            this.height=this.image.height/this.rows;
            this.posX=0;
            this.posY=0;
        }
    }
    BKGM.Sprite.prototype= {
        rows:1,
        columns:1,
        image:null,
        // changeFS:200,
        lastTime:0,
        animation:{},
        init:function(){
            // this.actor=_actor;            
            // this.frame=0;
            
            return this;
        },
        addAnimation:function(name, arr, time, endfn){
            this.animation[name]={arr:arr,time:time};
            this.endfn=endfn;
            return this;
        },
        playAnimation:function(name){
            this.currentAnimation=this.animation[name];
            this.name=name;
            this.animationIndex=0;
            this.index=this.currentAnimation.arr[0];
            this.maxIndex=this.currentAnimation.arr.length;
            return this;
        },
        switchAnimationIndex:function(index){
            var self = this;
            this.state = {x:index%self.columns,y:index/self.rows>>0};

        },        
        draw:function(Game,rotation){
            var now=new Date();
            var dt = now - this.lastTime;
            if (dt > this.currentAnimation.time){
                if(this.animationIndex<this.maxIndex){
                     this.lastTime = now;
                    
                    var index=this.currentAnimation.arr[this.animationIndex];
                    this.switchAnimationIndex(index);
                    this.posX=this.width*this.state.x;
                    this.posY=this.height*this.state.y;
                    this.animationIndex++;
                } else if (this.animationIndex==this.maxIndex){
                    if (this.endfn) 
                        if (this.endfn=="loop") {
                            this.animationIndex=0;
                            this.index=this.currentAnimation.arr[0];
                        } else this.endfn();
                }
               
            }
            Game.ctx.save();
    //         if((rotation<Math.PI&&rotation>Math.PI/2)||(rotation<-Math.PI/2&&rotation>-Math.PI)){
				// 	Game.ctx.scale(1, -1);
				// }
			rotation ? Game.ctx.rotate(rotation):null;
            Game.ctx.drawImage(this.image,this.posX,this.posY,this.width,this.height,-this.width/2,-this.height/2,this.width,this.height)
            Game.ctx.restore();
        }
    };
})();
(function(){
BKGM.Vector =function (x, y) {
	this.x = Number(x) || 0;
	this.y = Number(y) || 0;
}

BKGM.Vector.prototype.set = function(x, y) {
	if(x instanceof BKGM.Vector) {
		this.x = x.x;
		this.y = x.y;
	}
	else {
		this.x = Number(x) || this.x;
		this.y = Number(y) || this.y;
	}
	
	return this;
};

BKGM.Vector.prototype.setAngle = function(ang) {
	var o = this.angle();
	this.rotate(-1*o);
	this.rotate(ang);
	return this;
};

BKGM.Vector.prototype.scale = function(s) {
	s = Number(s) || 1;
	this.x *= s;
	this.y *= s;
	return this;
};

BKGM.Vector.prototype.add = function(b, s) {
	s = Number(s) || 1;
	this.x += b.x*s;
	this.y += b.y*s;
	return this;
};

BKGM.Vector.prototype.subtract = function(b, s) {
	s = Number(s) || 1;
	this.x -= b.x*s;
	this.y -= b.y*s;
	return this;
};

BKGM.Vector.prototype.dot = function(b) {
	return (this.x*b.x + this.y*b.y);
};

BKGM.Vector.prototype.magnitude = function() {
	return Math.sqrt(this.x*this.x + this.y*this.y);
};

BKGM.Vector.prototype.rotate = function(ang) {
	var x = this.x*Math.cos(ang) + this.y*Math.sin(ang);
	var y = this.x*Math.sin(ang) - this.y*Math.cos(ang);
	
	this.x = x;
	this.y = -y;
	
	return this;
};

BKGM.Vector.prototype.angle = function() {
	return Math.atan2(-this.y, this.x);
};

BKGM.Vector.prototype.invert = function() {
	this.x = -this.x;
	this.y = -this.y;
	return this;
};

BKGM.Vector.prototype.isNear = function(x, y, r) {
	var a = (this.x - x);
	var b = (this.y - y);
	var m = a*a + b*b;
	
	if(m <= r*r)
		return true;
	
	return false;
};

BKGM.Box= function(position, width, height, ori) {
	this.position = position || new BKGM.Vector();
	this.width = Number(width) || 1;
	this.height = Number(height) || 1;
	
	this.axes = new Array(2);
	this.axes[0] = new BKGM.Vector(1, 0);
	this.axes[1] = new BKGM.Vector(0, -1);
	
	if(Number(ori))
		this.rotate(ori);
}

BKGM.Box.prototype.move = function(vec) {
	if(vec instanceof BKGM.Vector) {
		this.position.add(vec);
	}
};

BKGM.Box.prototype.rotate = function(ang) {
	this.axes[0].rotate(ang);
	this.axes[1].rotate(ang);
};

BKGM.Box.prototype.setAngle = function(ang) {
	this.axes[0].setAngle(ang);
	this.axes[1].setAngle(ang);
};

BKGM.Box.prototype.isColliding = function(b) {
	var t = new BKGM.Vector(b.position.x, b.position.y);
	t.subtract(this.position);
	var s1 = new BKGM.Vector(t.dot(this.axes[0]), t.dot(this.axes[1]));
	t.set(this.position);
	t.subtract(b.position);
	var s2 = new BKGM.Vector(t.dot(b.axes[0]), t.dot(b.axes[1]));
	
	var d = new Array(4);
	d[0] = this.axes[0].dot(b.axes[0]);
	d[1] = this.axes[0].dot(b.axes[1]);
	d[2] = this.axes[1].dot(b.axes[0]);
	d[3] = this.axes[1].dot(b.axes[1]);
	
	var ra = 0, rb = 0;
	
	ra = this.width * 0.5;
	rb = Math.abs(d[0])*b.width*0.5 + Math.abs(d[1])*b.height*0.5;
	if(Math.abs(s1.x) > ra+rb) {
		//delete t;
		//delete s1;
		//delete s2;
		//delete d;
		return 1;
	}
	
	ra = this.height * 0.5;
	rb = Math.abs(d[2])*b.width*0.5 + Math.abs(d[3])*b.height*0.5;
	if(Math.abs(s1.y) > ra+rb) {
		//delete t;
		//delete s1;
		//delete s2;
		//delete d;
		return 2;
	}
	
	ra = Math.abs(d[0])*this.width*0.5 + Math.abs(d[2])*this.height*0.5;
	rb = b.width*0.5;
	if(Math.abs(s2.x) > ra+rb) {
		//delete t;
		//delete s1;
		//delete s2;
		//delete d;
		return 3;
	}
	
	ra = Math.abs(d[1])*this.width*0.5 + Math.abs(d[3])*this.height*0.5;
	rb = b.height*0.5;
	if(Math.abs(s2.y) > ra+rb) {
		//delete t;
		//delete s1;
		//delete s2;
		//delete d;
		return 4;
	}
	
	//delete t;
	//delete s1;
	//delete s2;
	//delete d;
	return 0;
};

BKGM.Box.prototype.updateCorners = function() {
	this.p1 = this.p1 ? this.p1.set(this.position) : new BKGM.Vector(this.position.x, this.position.y);
	this.p2 = this.p2 ? this.p2.set(this.position) : new BKGM.Vector(this.position.x, this.position.y);
	this.p3 = this.p3 ? this.p3.set(this.position) : new BKGM.Vector(this.position.x, this.position.y);
	this.p4 = this.p4 ? this.p4.set(this.position) : new BKGM.Vector(this.position.x, this.position.y);
	
	this.p1.subtract(this.axes[0], this.width * 0.5);
	this.p1.add(this.axes[1], this.height * 0.5);
	
	this.p2.add(this.axes[0], this.width * 0.5);
	this.p2.add(this.axes[1], this.height * 0.5);
	
	this.p3.add(this.axes[0], this.width * 0.5);
	this.p3.subtract(this.axes[1], this.height * 0.5);
	
	this.p4.subtract(this.axes[0], this.width * 0.5);
	this.p4.subtract(this.axes[1], this.height * 0.5);
};
})();