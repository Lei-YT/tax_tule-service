import Mock from 'mockjs'
import logJson from '@/dataJson/log.json'
import loginJson from '@/dataJson/login.json'
import process from "@/dataJson/process.json";
import resultJson from '@/dataJson/result6.json'
import resultDataJson from '@/dataJson/result-data.json'
import resultDataJson2 from '@/dataJson/result-data6.json'
import userJson from '@/dataJson/user.json'
import selectDataJson from '@/dataJson/select.json'
import checkdateJson from '@/dataJson/checkdate.json'
import infoMange from "@/dataJson/infoMange2.json";
import logslist from "@/dataJson/logslist.json";
Mock.setup({
  timeout: 800 // 设置延迟响应，模拟向后端请求数据
})
const Random = Mock.Random

Mock.mock(/\/api\/login\/login/, 'get', (req, res) => {
  // console.log('mock res', req, loginJson)
  return Mock.mock(loginJson)
})
Mock.mock(/\/api\/login\/logout/, 'get', (req, res) => {
  return Mock.mock({
    'code': 0,
    'msg': '操作成功.'
  })
})

// Mock.mock(/\/api\/scene/, 'get', (req, res) => {
//   console.log('mock res', req, process)
//   return Mock.mock(process)
// })
Mock.mock(/\/bill\/robot/, 'get', (req, res) => {
  // console.log('mock res', req, process)
  console.log('mock res robot', req)
  return Mock.mock(	{
    "success": true,
    "code": 20000,
    "message": "成功",
    "data": {
        "checking": 0,
        "fail": 4,
        "success": 2,
        "timeout": 2
	    }
	})
})
Mock.mock(/\/api\/scene\/homelist/, 'get', (req, res) => {
  console.log('mock res', req, process)
  return Mock.mock(process)
})
Mock.mock(/\/api\/scene\/scenelist/, 'get', (req, res) => {
  console.log('mock res', req, infoMange)
  return Mock.mock(infoMange)
})
Mock.mock(/\/api\/scene\/logslist/, 'get', (req, res) => {
  console.log('mock res', req, logslist)
  return Mock.mock(logslist)
})

Mock.mock(/\/api\/scene\/infostatus/, 'get', (req, res) => {
  return Mock.mock({
    'code': 0,
    'msg': '操作成功.'
  })
})

Mock.mock(/\/bill\/page\/\d\/\d/, 'post', (req, res) => {
  console.log('mock res', req, logJson)
  return Mock.mock(logJson)
})

Mock.mock(/\/api\/ql\/result/, 'get', (req, res) => {
  console.log('mock res', req, resultJson)
  return Mock.mock(resultJson)
})

Mock.mock(/\/api\/ql\/rule\/data/, 'post', (req, res) => {
  /**
    {
    "ruleId":"YQ4685271606",
    "billNumber":"20210421171075168004623522",
    "taskId":"1387829612651159553"
    }
   */
  console.log('if rule', JSON.parse(req.body).hasOwnProperty('ruleId'))
  const ifR = JSON.parse(req.body).hasOwnProperty('ruleId');
  console.log('mock res', req, ifR ? resultDataJson2 : resultDataJson)
  // return Mock.mock((!ifR ? resultDataJson2 : resultDataJson))
  return Mock.mock(( resultDataJson2 ))
})

Mock.mock(/\/api\/user\/list/, 'get', (req, res) => {
  // console.log('mock res', req, userJson)
  return Mock.mock(userJson)
})
Mock.mock(/\/api\/user\/add/, 'get', (req, res) => {
  return Mock.mock({
    'code': 0,
    'msg': '操作成功.'
  })
})
Mock.mock(/\/api\/user\/edit/, 'get', (req, res) => {
  return Mock.mock({
    'code': 0,
    'msg': '操作成功.'
  })
})
Mock.mock(/\/api\/user\/del/, 'get', (req, res) => {
  return Mock.mock({
    'code': 0,
    'msg': '操作成功.'
  })
})
Mock.mock(/\/billType\/findAll/, 'get', (req, res) => {
  return Mock.mock(selectDataJson)
})

Mock.mock(/\/bill\/checkDateChart/, 'post', (req, res) => {
  console.log('req',req)
  return Mock.mock(checkdateJson)
})
