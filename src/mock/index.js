import { Encrypt, Decrypt } from "@/libs/aes";

import Mock from 'mockjs'
import logJson from '@/dataJson/log2.json'
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

Mock.mock(/\/api\/login\/login/, 'post', (req, res) => {
  console.log('mock res login', req, loginJson)
  // const resS = 'eyJpdiI6IkhFUER3MnlybzNyVm9oZVZaZFV4cmc9PSIsInZhbHVlIjoiOGppaEZhMUFFa1NzcFV2UWRXUnEwQ2pYVlg5YlJMTW9cL3ZmeHh5TkZRSmtSeFFyOUo4UVJnbG5vUGQ1Wkl0dHBlYTJaRDZtS0thWjBSTzcrU1E4VGRBPT0iLCJtYWMiOiJmNjBmNDVmNWYxOThlZmQxZWE5NWVkZTc3YTk4MDU2MjQyMzdiNDQ3MGNjZTIwMzc1ZTQzMzMxMTY5MWEwZWZmIn0=';
  // const resS = 'Kmr65Sb0TcQCd3UF1PkyyX7ZpnPGDImkzYbrFIcMAAkTUUjhfqC5Y7nGNjiZdWaS';
  // const d = Decrypt(resS);
  // console.log('Decrypt', d)

  return Mock.mock(Encrypt(JSON.stringify(loginJson)))
})
Mock.mock(/\/api\/login\/logout/, 'post', (req, res) => {
  return Mock.mock(Encrypt(JSON.stringify({
    'code': 0,
    'msg': '操作成功.'
  })))
})
Mock.mock(/\/api\/login\/passwordchange/, 'post', (req, res) => {
  return Mock.mock(Encrypt(JSON.stringify({
    'code': 0,
    'msg': '操作成功.'
  })))
})

// Mock.mock(/\/api\/scene/, 'post', (req, res) => {
//   console.log('mock res', req, process)
//   return Mock.mock(process)
// })
Mock.mock(/\/bill\/robot/, 'post', (req, res) => {
  // console.log('mock res', req, process)
  // console.log('mock res robot', req)
  return Mock.mock(Encrypt(JSON.stringify(	{
    "success": true,
    "code": 20000,
    "message": "成功",
    "data": {
        "checking": 1,
        "fail": 99,
        "success": 9,
        "timeout": 1
	    }
	})))
})
Mock.mock(/\/api\/scene\/homelist/, 'post', (req, res) => {
  // console.log('mock res homelist', req, process)
  return Mock.mock(Encrypt(JSON.stringify(process)))
})
Mock.mock(/\/api\/scene\/scenelist/, 'post', (req, res) => {
  // console.log('mock res scenelist', req, infoMange)
  return Mock.mock(Encrypt(JSON.stringify(infoMange)))
})
Mock.mock(/\/api\/scene\/logslist/, 'post', (req, res) => {
  // console.log('mock res logslist', req, logslist)
  return Mock.mock(Encrypt(JSON.stringify(logslist)))
})
Mock.mock(/\/api\/scene\/setbill/, 'post', (req, res) => {
  // console.log('mock res setbill', req)
  return Mock.mock(Encrypt(JSON.stringify({
    'code': 1,
    'msg': '操作成功.'
  })))
})

Mock.mock(/\/api\/scene\/infostatus/, 'post', (req, res) => {
  console.log('mock res infostatus', req)
  return Mock.mock(Encrypt(JSON.stringify({
    'code': 1,
    'msg': '操作成功.'
  })))
})
Mock.mock(/\/api\/scene\/initiastatus/, 'post', (req, res) => {
  console.log('mock res initiastatus', req)
  return Mock.mock(Encrypt(JSON.stringify({
    'code': 1,
    'msg': '操作成功.'
  })))
})

Mock.mock(/\/bill\/page\/\d\/\d/, 'post', (req, res) => {
  console.log('mock res', req, logJson)
  return Mock.mock(Encrypt(JSON.stringify(logJson)))
})

Mock.mock(/\/api\/ql\/result/, 'post', (req, res) => {
  console.log('mock res api/ql/result', req, resultJson)
  return Mock.mock(Encrypt(JSON.stringify(resultJson)))
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
  return Mock.mock(( Encrypt(JSON.stringify(resultDataJson2 ))))
})

Mock.mock(/\/api\/user\/list/, 'post', (req, res) => {
  // console.log('mock res', req, userJson)
  return Mock.mock(Encrypt(JSON.stringify(userJson)))
})
Mock.mock(/\/api\/user\/add/, 'post', (req, res) => {
  return Mock.mock(Encrypt(JSON.stringify({
    'code': 0,
    'msg': '操作成功.'
  })))
})
Mock.mock(/\/api\/user\/edit/, 'post', (req, res) => {
  return Mock.mock(Encrypt(JSON.stringify({
    'code': 0,
    'msg': '操作成功.'
  })))
})
Mock.mock(/\/api\/user\/del/, 'post', (req, res) => {
  return Mock.mock(Encrypt(JSON.stringify({
    'code': 0,
    'msg': '操作成功.'
  })))
})
Mock.mock(/\/billType\/findAll/, 'post', (req, res) => {
  return Mock.mock(Encrypt(JSON.stringify(selectDataJson)))
})

Mock.mock(/\/bill\/checkDateChart/, 'post', (req, res) => {
  console.log('req',req, checkdateJson)
  return Mock.mock(Encrypt(JSON.stringify(checkdateJson)))
})
