var agent = require('superagent-promise')(require('superagent'), Promise);
var _ = require('lodash')
var fs = require('fs')

var stdnums = {
	2014213966: '徐海超',
	2013211363: '张涛',
	2014213898: '杜泽萱'
}

var requests = _.map(stdnums, (val, stuNum) => {
	return agent.post('http://hongyan.cqupt.edu.cn/api/kebiao')
			.type('form')
			.send({stuNum: stuNum})
})

Promise.all(requests).then((request) => {
	var datas = _.flatten(request.map((val) => {
		return val.body.data
	}))

	var uniqed = _.uniqWith(datas, (pre, next) => {
		return pre.hash_day === next.hash_day && pre.hash_lession === next.hash_lession && pre.begin_lession === next.begin_lession && pre.weekBegin === next.weekBegin && pre.weekEnd === next.weekEnd;
	})

	fs.writeFileSync( './classData.json', JSON.stringify(datas))
})