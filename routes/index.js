var express = require('express');
var router = express.Router();
var tags = require('../models/tags').tags;
var blogs = require('../models/blogs').blogs;

/* GET home page. */
/*router.get('/', function(req, res, next) {
    var query_doc = {};
    (function(){
	blogs.find(query_doc,function(err,doc){
	    if(err == null){
		res.render('list',{title:"木棉博客",data:doc});
	    }else{
		console.log(err);
		res.send("some error");
	    }
	});
    })(query_doc);
});*/

router.get('/',function(req,res,next){
    var cur = req.query.p ? req.query.p : 1;
    var pagesize = 10;
    blogs.count({},function(err,count){
	if(err == null){
	    if(count > 0){
		var pagecount = Math.ceil(count/pagesize);
		cur = cur < 1 ? 1 : cur;
		cur = cur > pagecount ? pagecount : cur;
		var startLine = (cur -1)*pagesize;
		blogs.find().sort({create_time:-1,_id:-1}).skip(startLine).limit(pagesize).exec(function(errb,datab){
		    if(errb == null){
			res.render('list',{title:"木棉博客",data:datab,cur:cur,pagecount:pagecount});
		    }else{
			res.send('mongodb query error.');
		    }
		});
	    }else{
		res.sender('list',{title:"木棉博客",data:[],cur:1,pagecount:1});
	    }
	}else{
	    res.send('mongodb query error');
	}
    });
});

router.get('/detail',function(req,res,next){
    var query_doc = {key:req.query.key};
    (function(){
	blogs.find(query_doc,function(err,doc){
	    if(err == null){
		var data = doc[0];
		res.render('detail',{data:data});
	    }else{
		res.send('some error');
		console.log(err);
	    }
	});
    })(query_doc);
});

module.exports = router;
