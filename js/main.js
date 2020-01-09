var placeHolder=$('#placeholder');
var Params=ParseParam();

function wget(_url,_callback){
	$.ajax({
		url: _url,
		type: 'GET',
		dataType: 'html',
		success: function(res){
			if(_callback){
				_callback(res);
			}
		},
		error: function(a,b,c){
			console.log(b);
		}
	});
}
map=[];
function PasteLink(entry,sublink){
	if(!placeHolder.ul){
		var ul = $('<ul>');
		placeHolder.append(ul);
		placeHolder.ul = ul;
	}
	var li = $('<li>');
	var a=$('<a>');
	if(sublink){
	   entry.name+=sublink;
	}
	if(map[entry.name]) return false;
	a.text(entry.name);
	if(entry.url.indexOf('http') < 0){
		entry.url='http://'+entry.url;
		if(sublink){
			entry.url='http://'+entry.url+sublink;
		}
	}
	a.attr('href',entry.url);
	li.append(a);
	placeHolder.ul.append(li);
	map[entry.name]=entry;
}

function main(argc,argv){

	wget('/ngrok.json',function(res){
		var json = JSON.parse(res);
		if(json && json.data){
			for(var i=0; i<json.data.length; ++i){
			   PasteLink(json.data[i]);
			   if(json.data[i].name.endsWith('-80')){
				   PasteLink(json.data[i],'/ytdownload.html');
			   }
			}
		}
	});
}

main(Params.length,Params);
