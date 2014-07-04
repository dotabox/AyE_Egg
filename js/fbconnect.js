(function(FBConnect){
    var Base64Binary = {
        _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        /* will return a  Uint8Array type */
        decodeArrayBuffer: function(input) {
            var bytes = Math.ceil( (3*input.length) / 4.0);
            var ab = new ArrayBuffer(bytes);
            this.decode(input, ab);

            return ab;
        },

        decode: function(input, arrayBuffer) {
            //get last chars to see if are valid
            var lkey1 = this._keyStr.indexOf(input.charAt(input.length-1));      
            var lkey2 = this._keyStr.indexOf(input.charAt(input.length-1));      

            var bytes = Math.ceil( (3*input.length) / 4.0);
            if (lkey1 == 64) bytes--; //padding chars, so skip
            if (lkey2 == 64) bytes--; //padding chars, so skip

            var uarray;
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            var j = 0;

            if (arrayBuffer)
                uarray = new Uint8Array(arrayBuffer);
            else
                uarray = new Uint8Array(bytes);

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            for (i=0; i<bytes; i+=3) {  
                //get the 3 octects in 4 ascii chars
                enc1 = this._keyStr.indexOf(input.charAt(j++));
                enc2 = this._keyStr.indexOf(input.charAt(j++));
                enc3 = this._keyStr.indexOf(input.charAt(j++));
                enc4 = this._keyStr.indexOf(input.charAt(j++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                uarray[i] = chr1;           
                if (enc3 != 64) uarray[i+1] = chr2;
                if (enc4 != 64) uarray[i+2] = chr3;
            }

            return uarray;  
        }
    };

    // var BKGM = BKGM||{}; 
    
    if ( XMLHttpRequest.prototype.sendAsBinary === undefined ) {
        XMLHttpRequest.prototype.sendAsBinary = function(string) {
            var bytes = Array.prototype.map.call(string, function(c) {
                return c.charCodeAt(0) & 0xff;
            });
            this.send(new Uint8Array(bytes).buffer);
        };
    }
    function PostImageToFacebook(authToken, filename, mimeType, imageData, obj)
    {
        if (imageData != null)
        {
            //Prompt the user to enter a message
            //If the user clicks on OK button the window method prompt() will return entered value from the text box. 
            //If the user clicks on the Cancel button the window method prompt() returns null.
            var message = prompt('Facebook', 'Enter a message');

            if (message != null)
            {
                var ajax = {
                    success: obj.success ? obj.success : null,
                    error: obj.error ? obj.error : null,
                    complete: obj.complete ? obj.complete : null
                }
                // this is the mult
                // let's encode ouripart/form-data boundary we'll use
                var boundary = '----ThisIsTheBoundary1234567890';
                var formData = '--' + boundary + '\r\n'
                formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
                formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
                for (var i = 0; i < imageData.length; ++i)
                {
                    formData += String.fromCharCode(imageData[ i ] & 0xff);
                }
                formData += '\r\n';
                formData += '--' + boundary + '\r\n';
                formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
                formData += message + '\r\n'
                formData += '--' + boundary + '--\r\n';

                var xhr = new XMLHttpRequest();
                xhr.open('POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true);
                xhr.onreadystatechange = function(ev){
                    if (xhr.status==200) {
                        if(ajax.success) ajax.success(xhr.responseText);
                        if (xhr.readyState==4)
                            if (ajax.complete) ajax.complete(xhr.responseText)            
                    } else {
                        if (ajax.error) ajax.error(xhr.responseText);
                    }            
                };
                xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
                xhr.sendAsBinary(formData);
            }
        }
    };
    BKGM.FBConnect = function(){        
        // return this;
    }
    BKGM.FBConnect.prototype= {
        init:function(obj,callback){
            var self=this;
            var app_id="296632137153437";
            if (obj){
                app_id=obj.appId;
            }
            try {
                this._isCordova ? FB.init({ appId: app_id, nativeInterface: CDV.FB, useCachedDialogs: false }) : FB.init({ appId: app_id,status: true,xfbml: true,cookie: true,frictionlessRequests: true,oauth: true});
                
            } catch (e) {
                alert(e);
            }
            // FB.Event.subscribe('auth.statusChange', self.handleStatusChange);
        },
        handleStatusChange:function(session) {
            if (session.authResponse) {
                 var str="";
                    for (var x in session.authResponse){
                        str+=x;
                    }
                    alert(str);
            }
        },
        logout:function(callback) {
            var self=this;
            FB.logout(function(response) {
                if(callback) callback(response);
            });
        },            
        login:function(callback) {
            var self=this;
            FB.login(
                function(response) {
                    if (response.session) {
                        if(callback) callback(response);
                    } else {
                        if(callback) callback(response);
                    }
                },
                { scope: "publish_actions" }
            );
        },
        getLoginStatus: function(callback) {
            var self=this;
            FB.getLoginStatus(function(response) {
                              if (response.status == 'connected') {
                                self.isLogin=true;
                                if (response.authResponse && callback) 
                                    callback(response.authResponse);
                              } else {
                                self.isLogin=false;
                                if (callback) callback(false);
                              }
                              });
            return this;
        },
        getAuthResponse: function(callback1){
            var self=this;
            FB.getLoginStatus(function(response) {
                  if (response.status == 'connected') {
                    if (response.authResponse && callback1) 
                        {
                            callback1(response.authResponse.accessToken,response.authResponse.userId);
                        }
                  } else {
                    self.login(function(response){
                        if(response && response.authResponse) {authResponse=response.authResponse; if (callback1) callback1(authResponse.accessToken,authResponse.userId);}
                    })
                  }
                  });
        },
        postCanvas:function(message, callback) {
            this.getAuthResponse(function(access_token,uid){
                // var uid = authResponse.userID;
                // var access_token = authResponse.accessToken;
                var canvas = document.getElementById("game");
                var imageData = canvas.toDataURL("image/png");
                var mess =message || "http://fb.com/BKGameMaker.com";
                var encodedPng = imageData.substring(imageData.indexOf(',')+1,imageData.length);
                var decodedPng = Base64Binary.decode(encodedPng);
                PostImageToFacebook(access_token, "filename.png", 'image/png', decodedPng);
              
            });

            

        }
    };
   
})();