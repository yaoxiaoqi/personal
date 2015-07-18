  // CREATE A REFERENCE TO FIREBASE
  var messagesRef = new Firebase('https://popping-inferno-7997.firebaseio.com/');

  // REGISTER DOM ELEMENTS
  var messageField = $('#messageInput');
  var nameField = $('#nameInput');
  var messageList = $('#example-messages');
  var namelist = $('#chat-namelist');
  var oldname = "administrator"; //��֮ǰ�����ֽ����ж�

  //�������ص��û���
  var mname = new Array();
  // LISTEN FOR KEYPRESS EVENT
  messageField.keypress(function (e) {
    if (e.keyCode == 13) {
      //FIELD VALUES
      var username = nameField.val();
      var message = messageField.val();
	  var lastchar = username.charAt(username.length - 1);
	  var tmp = lastchar.charCodeAt() % 10;
	  var picture = 'img/'+tmp+'.jpg';
	  if($.inArray(username, mname)<0 || username == oldname){
		if($.inArray(username, mname)<0){
			oldname = username;
	    }
		if(message){
				messagesRef.push({name:username, text:message, face:picture});
				messageField.val('');
			}
		else{alert("�ף�������Ϣ������Ϊ��Ӵ~");}
	  }
	  else{
		alert("������һ��"+username+"��Ӵ~����Խ�"+username+"С��ʹ~�ٺ�");
		//nameField.val() = "С��ʹ";
	  }    
	}
  });
  
  //LISTEN FOR MOUSE CLICK
  $(".sendButton").click(function(){
	  var username = nameField.val();
      var message = messageField.val();
	  var lastchar = username.charAt(username.length - 1);
	  var tmp = lastchar.charCodeAt() % 10;
	  var picture = 'img/'+tmp+'.jpg';
	  if($.inArray(username, mname)<0 || username == oldname){
		if($.inArray(username, mname)<0){
			oldname = username;
	    }
		if(message){
				messagesRef.push({name:username, text:message, face:picture});
				messageField.val('');
			}
		else{alert("�ף�������Ϣ������Ϊ��Ӵ~");}
	  }
	  else{
		alert("������һ��"+username+"��Ӵ~����Խ�"+username+"С��ʹ~�ٺ�");
		//nameField.val() = "С��ʹ";
	  }  
  });

  // Add a callback that is triggered for each chat message.
  messagesRef. limitToLast(10).on('child_added', function (snapshot) {
    //GET DATA
    var data = snapshot.val();
	
    var username = data.name || "anonymous";
	var message = data.text;
	var picture = data.face;
	
    //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
	var faceElement = $("<img>");
    var messageElement = $("<li>");
    var nameElement = $("<strong class='example-chat-username'></strong>")
	faceElement.attr("src",picture);
	faceElement.attr("class","chat-face");
    nameElement.text(username);
    messageElement.text(message).prepend(faceElement,nameElement);
	
    //ADD MESSAGE
    messageList.append(messageElement)
	
    //SCROLL TO BOTTOM OF MESSAGE LIST
    messageList[0].scrollTop = messageList[0].scrollHeight;
  });
  
  //��ʾ�û��б�
  messagesRef .orderByChild('name').on('child_added', function (snapshot){
	//GET DATA
    var data = snapshot.val();
	
    var username = data.name || "anonymous";
	if(mname.length === 0){
		mname.push(username);
		var nameElement = $("<li>");
		nameElement.text(username);
		namelist.append(nameElement);
	}
	else{
		if($.inArray(username, mname) >= 0){
		}
		else{
			mname.push(username);
			var nameElement = $("<li>");
			nameElement.text(username);
			namelist.append(nameElement);
		}
	}
	
  }, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});