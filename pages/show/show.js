var _ = require( '../../libs/underscore.js' );
var ajaxUrl = require('../../utils/url.js');
var app = getApp()
Page({
  data: {
    imgUrls: [
           
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        page:1,
        postsList:[
          
        ]
  },
  
  onLoad: function () {
    var that = this;
    //ajax请求数据
    wx.request({
      method:"GET",
      url: ajaxUrl.ajaxUrl()+"?method=index.getHomeData",
      
      data: {
           
      },
      header: {
          'Content-Type': 'application/json'
      },
      success: function(res) {
        
        if(res.data.result == 0){
          //console.log(res.data.data)
          //将图片从接口拿过来，并且用七牛参数处理一下
          var bannerImg = [];
          _.each(res.data.data.banner,function(v,i){
              bannerImg.push(ajaxUrl.cdnUrl() + v.image+"?imageView2/1/w/750/h/380/q/60");
          })
         
          that.setData({
            'imgUrls':bannerImg
          })
        }
       
      }
    })

    that.fetchImgListDate();
    console.log(that.data.postsList)
  },
  //跳转至详情页
  redictDetail:function(e){
    var userId =  e.currentTarget.dataset.userid;
    var suitId= e.currentTarget.dataset.suitid;
    var link = "../detail/detail?viewUserId="+userId+"&suitId="+suitId
    wx.navigateTo({
        url: link
      })
  },

  lower:function(e){
    var self = this;
    self.setData({
      page: self.data.page + 1
    });
    
    self.fetchImgListDate({page: self.data.page});
  },
 
  fetchImgListDate:function(data){
    var self = this;
      if (!data) data = {};
      if (!data.page) data.page = 1;
      if (data.page === 1) {
        self.setData({
          postsList: []
        });
      }
      wx.request({
          method:"GET",
          url:ajaxUrl.ajaxUrl()+"?method=index.getChoicenessList",
          data: {
              "fromPageId":0,
              "pageSize":10,
              "viewUserId":'',
              "page":self.data.page
          },
          header: {
          'Content-Type': 'application/json'
          },
          success: function(res) {
             // var contentObj = [];
               if(res.data.result == 0){
                  _.each(res.data.data.result,function(v,i){
                      self.data.postsList.push({
                        imgUrl: v.image+"?imageMogr/v2/auto-orient/thumbnail/750x/quality/80/",
                        userId:v.userId,
                        suitId:v.suitId
                      });
                  });
               }
               self.setData({
                 postsList:self.data.postsList
               })
              //   self.data.postsList = contentObj
               
          }
      })
      
  }


 
})