var express = require('express');
var router = express.Router();
var tags = require('../models/tags').tags;
var users = require('../models/users').users;
var blogs = require('../models/blogs').blogs;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//login page
router.get('/login',function(req,res,next){
    res.render('login',{});
});

//login submit
router.post('/login',function(req,res,next){
    var account = req.body.username;
    var password = req.body.password;
    console.log(req.body);
    if(!account || !password){
	res.json({status:0,info:'username and password was required!'});
	return;
    }
    var doc_query = {username:account};
    (function(){
	users.findOne(doc_query,function(err,doc){
	    if(doc == null){
		res.json({status:0,info:'username or password error!'});
		return;
	    }
	    if(!err){
		if(password != doc.password){
		    res.json({status:0,info:'username or password error!'});
		    return;
		}else{
		    //login success save session the login info.
		    req.session.isLogin = true;
		    res.json({status:1,info:'/manager'}); 
		}
		console.log(doc);
	    }else{
		console.log(err);
		res.send('some error');
	    } 
	});
    })(doc_query);
});

//login after , manager page.
router.get('/manager',function(req,res,next){
    if(req.session.isLogin){
	var cur = req.query.p ? req.query.p : 1;
	var pagesize = 10;
	var sort = {create_time:-1};
	//blogs.execPageQuery(cur,pagesize,function(err,doc){
	    //console.log(doc);return;
	//});
	//res.render('manager',{});
	blogs.count(function(err,doc){
	    if(err == null){
		var count = doc;
		cur = cur < 1 ? 1 :cur;
		var pagecount = Math.ceil(doc/pagesize);
		cur = cur > pagecount ? pagecount : cur;
		var startLine = (cur - 1) * pagesize;
		blogs.find().skip(startLine).limit(pagesize).sort({_id:-1}).exec(function(err,data){
		    if(err == null){
			res.render('manager',{'data':data,'cur':cur,'pagecount':pagecount});
		    }else{
			res.send('some error');
		    }
		});
	    }else{
		res.send('some error');
	    }
	});
    }else{
	res.send(500);
    }
});

//edit page
router.get('/manager/editor',function(req,res,next){
    if(req.session.isLogin){
	tags.find({},function(err,data){
	    if(err == null){
		if(req.query.id){
		    blogs.findOne({_id:req.query.id},function(err,dat){
			res.render('editor',{tag:data,info:dat});
		    });
		}else{
		    res.render('editor',{tag:data,info:{_id:"",title:"",markdown:"",key:"",catkey:""}});
		}
	    }else{
		res.send('some error');
	    }
	});
    }else{
	res.send(500);
    }
});

//edit submit
router.post('/manager/editor',function(req,res,next){
    //todo verify
    var title = req.body.title ? req.body.title : "";
    var markdown = req.body.markdown ? req.body.markdown : "";
    var key = req.body.key ? req.body.key : "";
    var catkey = req.body.catkey ? req.body.catkey : "";
    var content = req.body.html ? req.body.html : "";
    tags.findOne({key:catkey},function(err,tag){
	if(err == null){
	    if(tag == null){
		res.json({status:0,info:'tag is not exits'});
	    }else{
		var catname = tag.name;
		var data = {'title':title,'markdown':markdown,'key':key,'catkey':catkey,'catname':catname,'content':content,'create_time':Date.parse(new Date()),'hits':0};
		if(req.body.id == ""){
		    var saveobj = new blogs(data);
		    saveobj.save(function(err){
			if(err){
			    res.json({status:0,info:'save error'});
			}else{
			    res.json({status:1,info:'save success'});
			}
		    }); 
		}else{
		    blogs.update({_id:req.body.id},data,function(err){
			if(err){
			    res.json({status:0,info:'update error'});
			}else{
			    res.json({status:1,info:'update success'});
			}
		    });
		}
	    }
	}else{
	    res.json({status:0,info:'select db tags error'});
	}
    });
});

module.exports = router;
