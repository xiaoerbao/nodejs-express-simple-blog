/**
 * Created by xiaoerbao on 2017/3/17.
 */
var express = require('express');
var router = express.Router();
var blogs = require('../models/blogs').blogs;
var tags = require('../models/tags').tags;
var htmltrim = require('trim-html');

/**
 * 获取博客列表的api
 */
router.get('/api/list' , function(req , res , next){
    var cur = req.query.p ? req.query.p : 1;
    var catkey = req.query.catkey ? req.query.catkey : '';
    var where = {};
    if(catkey){
        where = {catkey : catkey}
    }
    var pagesize = 10;
    blogs.count(where,function(err,count){
        if(err == null){
            if(count > 0){
                var pagecount = Math.ceil(count/pagesize);
                cur = cur < 1 ? 1 : cur;
                cur = cur > pagecount ? pagecount : cur;
                var startLine = (cur -1)*pagesize;
                blogs.find(where).sort({create_time:-1,_id:-1}).skip(startLine).limit(pagesize).exec(function(errb,datab){
                    if(errb == null){
                        res.jsonp({status : 1 , title:"木棉博客" , data:datab , cur:cur , pagecount:pagecount});
                    }else{
                        res.jsonp({status : 0 , info : 'DB query error'});
                    }
                });
            }else{
                res.jsonp({status : 1 , title:"木棉博客" , data:[] , cur:1 , pagecount:1});
            }
        }else{
            res.jsonp({status : 0 , info : 'DB system get count error'});
        }
    });
});

/**
 * 获取博客详情的api
 */
router.get('/api/detail' , function(req , res , next){
    var query_doc = {key:req.query.key};
    (function(){
        blogs.find(query_doc,function(err,doc){
            if(err == null){
                var data = doc[0];
                res.jsonp({status : 1 , data : data});
            }else{
                res.jsonp({status : 0 , info : 'DB query error'});
            }
        });
    })(query_doc);
});

/**
 * 修改博客点击的api
 * hits
 */
router.get('/api/click' , function(req , res , next){
    var keystr = req.query.key;
    blogs.update({key : keystr} , {$inc : {hits : 1}} , function(err){
        if(err){
            res.jsonp({status : 0 , info : 'DB operation error'});
        }else{
            res.jsonp({status : 1 , info : 'success'});
        }
    });
});

/**
 * 博客首页信息获取api
 */
router.get('/api/site' , function (req , res , next) {
    tags.find({} , function(err , tagsData){
        if(err){
            res.jsonp({status : 0 , info : 'DB query error'});
            res.end();
        }
        //获取博文数量
        blogs.count({} , function(err , count){
            if(err){
                res.jsonp({status : 0 , info : 'DB count error'});
                res.end();
            }
            blogs.aggregate(
                { $group: { _id: null, sum: { $sum: '$hits' }}},
                function (err, sum) {
                    if(err){
                        res.jsonp({status : 0 , info : 'DB sum error'});
                        res.end();
                    }
                    res.jsonp({status : 1 , tags : tagsData , artCount : count , hitSum : sum});
                });
        });
    });
});

module.exports = router;
