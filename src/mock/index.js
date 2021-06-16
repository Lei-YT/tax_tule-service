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
Mock.mock(/\/api\/bill\/robot/, 'post', (req, res) => {
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
  return Mock.mock(((logJson)))
  // return Mock.mock(Encrypt(JSON.stringify(logJson)))
})

Mock.mock(/\/api\/ql\/result/, 'get', (req, res) => {
  console.log('mock res api/ql/result', req, resultJson)
  return Mock.mock(((resultJson)))
})
Mock.mock(/\/api\/ql\/result/, 'post', (req, res) => {
  console.log('mock res api/ql/result', req, resultJson)
  return Mock.mock(Encrypt(JSON.stringify(resultJson)))
})
Mock.mock(/\/api\/bill\/qlresult/, 'post', (req, res) => {
  console.log('mock res api/ql/result', req, resultJson)
  return Mock.mock('dKOLItEqjjY6T25vOwGheHdlyUNh9YPLfpARJjjWZH+AA6PT9pgecrk4pFTshsvT0ftdYp2+ipDvZoYgF50sUE+G31/q63YrrC9ZnC3wCEPcqW7QivL9XlRhoUMYc73C+TVYXG6JtLcaxvvbnn68zscmeMrCL15MdkdwhpibAsQVb9Cp621GIN2LJW6X0KINfPMe/6hyzLSlnciAjM6DUA6FH9NznDWef5gLBJb0MtGnml0rCgyVivrr1l+1hN60/FZhztvamSHRuquSMsK/bFXHOupXw+N3cqsyGZBkrz5PflG5kFmoEkI9ifZxGCowoOifLCp9Eq8IstgVZ0KVVji/0ZYmdc4vgqfXTNNYYouLfHwEnGlpztPvW3/bpCPuo2k11eRzuWJ+HeXXkZUc8kc2eQ7GXpwjNuvH0++4YpNep1ZT4p1Uzv7qz87g2Qkb2q0GDY/9VnOG1YjCMaI4KZIZXSZE93D+frLcuLP72w2XKGeb3VpLfpLNMpkvRHgsG+sXJA733ezMl+XuwL9UPwkyw3PjGoZ6Kyzxmma9kogD55W+35A7vsOtPbsb4U0/nKTNnCF8wYiV+gJs8jf4bQ0wyQiS6CY+8d+pg7tLgZ1scJcgjrSMZS3gJhXBvxOdDYYFcMgklhDiCKyXnwYJtQnk7xXUEgvF//AyNtqOKYraXQdeiUCq2VuCrvQG5jfw96btc4m0GMiReEIMa2s9+9/iPilKsAZ84Q7PnC8wyQcxbpk9r8lXU+VrcEkJMltXLVfsIdz/owWNdMpvom83sYiK+ha9jbmwt2Fp5b61opOsY+Q5KXioPj1Knqv5MgELMLhUHDmPRRDjc2Gr200rxaYiz27IJLUSVEnxQFfSZSK6Nnro/4n8FXxMuQGg1uN1+IuhvQviZ3uGiC2mjKMz8LbHUvTOaWbIEB3vXC23xTyj4DEM1JfpR8OXJkmJdyxz3uzkPtg6jNQWE9lbTuPrwDXmtEC9xbG3HqFN6cg8FkNxughMHBf1l97yKOF8HY4RFPGQM+Qn4DLjo+tiMssepWRR+9IyKn477XKbxzm8cShH78OFIlTctsmAvHnwhpiC48tYYvgPMdFDdJN1Tp2TO6To4SEGv4N0tpJXlhjNJPf8OsDdxC0rvT6yp4apPnjg376za0Bjk18h39FnwJQsjn1sslN1W5/pd5NQzjBnygImvEShXuGJy6XgdFa0/WcFR5ltJIvatNAwFHviibw+ssbprCeQ8ObCVEv2o8U/pdc0RnfZsGTcXixeR8KEEu5g7icWLDHhyxyPWXSFNdl/H0JaVcB9OEbFOTPgQ8FMCmR83FpiXLd/dR+aweDtY2FgqwW3cUDzzW8kC0GxmIQKAAr7Lw9oyxvbecvzP5NaLAbFmHZt+T/jwGxyKxlNDPNPQvoiG6Ii2g8f+6nmbMqmoxk9hMtCvrXA9WrsPYHrHXzf5gLstVyelidvgh9fWWaMJ3yWrg2haruHt2lBkP0PGBbhMexOl5yB5gF4cpSu/JaAKPndQHS5WZPy0E5YSwoNBrd2Owx62aVj+P9cgwVj1rDuG1nY6TQTrTpu+U9LH6Qeu2qgp4CzYjmgl/TO1AOb/Q+OpR+0TfE29rmwUSS9Ib7NCB38Ww+KJr3W8NwhaeJByZCLo4c81L/FpbWWw/XOfCsLcomaxMRGg9Sv3y+euvHFg4F32v91+chwVpgbSoIfqDtRlDsOmvMLq5nLVwNUW0FD+N2Wa/l++zlO9hEhBzoeyjCJQAEequFYnLrJBeDsUv/923Dn7mePQyyoI8FTB+a1b825v9LBuPpZ5vN4HruklEBYEK0qNfLE4Sqd0sVg5MnisGe8yPeVwxgP4iSjVlsqetViSqevmu40FSvNyLetACCLHSQu58vYxFTo25j45+yLgKMUu+aSTqNp7x89RE85VUE90oPZqWfWjcw6dRbaQM9ovbf42NpL4BsLnSGdjccTnQBCChAP9gS1gc98u9uS8/+EV3VLV2rhp4JiqnbmttinMnl/CE1WYI6q1KsHp+I9UNvOQD0XDTX3qTMCbgf+5vLiRzgUCWRjrqs1DYdQ2e0IIsXmLanDy/o6TYRBc/wU7bDmDNEFOW8bNSRFaAjNZFcDDcbjmwFh4ULDZZp39+rntZsPHgdcVsmdK/ySQT+gWVISLGFSA/bYt9MjDNNUKc6ePGW/8MOOxew0VzZrsSyUAfw3yaYWWTW7cLZr/N93vrKvF5f6ODiKGyRe43mUxEnOx63WwwGSpomfuExmZ4PT7dh0fjWCiS7c3fIjxi9eKrN/f4/upyAF9jDVcSWM7aPnKadEFGNwDC4Am/5iVlf1dLjAsUjF3kcDL69U+NomTRKf9mEoHqxJAp88kSkQ4CwTECH5hImd1slkxpPNmdcxAgsrDtNqk/Ut4XQa8dWDR1pGMpUV7IGI6HsDiGR2Fu9PR4jwIaMcbo4gJhj+hVQPPVl2Q0cTEerIEmFbN3zZqwHqzo9Jr88+vuuAXH1xDj7zX4MDv+3FvIRLUChnaX4l1WH4O3D/T+a/0+VeEVEhSHvpUEQx/BT/jV0tf1j7DHY2qiKj2iXLZjcVesrwr4mPXtI+Binkg1EhNdVRArljZ1IwCF+sOmE7l2n06K6xnV80k65TQRA5Hvh3Cns0pgQkwFFXEzYnEUQ4zRWFyvlQdFNdEmuy4LRtXghmf112J6v9OyGt70Ue8OTh7FsMFGTb7ZLFv8sdR9IkuT5S3B7w4ekJ0Q7Cx7pQsE41twW1GuLT9gn0HcBJMBWKkbvkFWHJOW9wEzKBggByBNh+dEzahdog7CxzZDQ6I/oLncfCfMyHw4zaSFtIDiGc8DX6L0/5G/Q3aj7wIw7hTGGlvBd/Lr7AqxMlDv1cPCcRu7+drRo9QrIEne3caXQWproQgZU1sQwl9Zmn8uvEbY8hWv2DKhstzSy4i9H1xOUqgLLjH2YdAlbj08m+G0cenFGQ3tmbKuv93ECCQ0xlFkjoRuuZGzLiUe8dkS1HqiTGmlGF1qZSnTocJsqahAidGmH+PlTBKwW5Ylda/s0qUjtluFPDUcZ2c8da1FX8G/urWLsXT5/QvUf4v81qtxWxCBcCztIQrrOAt0nfTr+YzpOY4ksrqjHQy3HOrfcX/+EsC+CIYPsq8hg0OsMYYSr4hakdMacmj40/NxUHrV7pSNKBb9SkSSVHIIrIKkg4k7id/5D6gr0Um1wC3+zyGFMeIN/o7OKZVaYHPjrgLYmW1oJ758jjSP3xyjue1AZJUEjDvl4jC3Hh2VINl3GrhLs3yZTVXsuW4pfm6vqXX7I+/tF+kz3uFGYGARcTM8Ou48wIZ/4NZ9qj78UkhAu91ICuD9HQaGdf0MJrnpCvxdJJZjHqdJUqx35phcROWN5z2pVaAM7llt6QtW1ycxyp5uIG7Xih08Wf5B8EK1fnosZ5ZbyR/jtsvo2mHN00eMuwM/B4B7EbNhCUSRDHS4uLlPTYqQ3OR9ZMCRooHl8l5Lp891W7dxEGjwFyy8eGf5EpZ4vOjCxFTWSJUDVpySr0QpdsrzQpD4Ih7urBH+fSa0lEyWQQAec16AC0zTl+KKsSUD3DlKTDfTHYt9Uj4ldkuG7AjpJN6L/nWR5ai544MVPqxkOPirgOd2enY4kg5i+L88d5xjTDrZR3uwn+gKy3DcoxoEUcZNJxB2Ciygp+bOrp8pxjNL3/lXQANEvLBhOVEvkY9P2uN62XwWlasIxQowZXyaS8Ta1Sboe3DJtljeq4gNZVwijxyfK8dPTrMtwu3isML6QY9+qyom73MBBMg1hJAVKlfYly3ekas1uR6jfy9CF1VxEHCJ1UHg5NggqN5qmVXggqK6wU+QTzedaGcVM79fA9Q3Q05u1QEaUXh647YCwpVh2Q6sKYUfnocXlny67RJ2bYrQe+f0KBRwrvDdc2yOTX2EaNb6tB/BE+SG8S9uWlrBGyi2053vMkiSooS+0fbrKRug4Qm2CvQXkW/+xBUFwkoFXWjpLRPCwALlVp2rpGvk8CKUnhXwv0KBJPpvD9Q1B4dh5UEGaNwJQbYfBCFfS49e3NvEx6vvh7O+B2wRl92c6XlwU+y1QJJwd/dyNt97fHFGUTUqFj3FaSIv6KYAQ30WLAcRVsQ2pjQmZYQSX8meSm35GuyMg+xtd3PFShVadAlkzLk+ZFhAT/s9CAsFQTOKFBZ/7RMnAXvpApzIddfPWLqeAgKtSNh2PkFFi4PkVqjWzEokLEwu/Fo7bNjkPGv3H46hPE7MEGgIw5jO9cteA6QTX1Iw4BsapyfLJPaDP5jzHCHEUUftkNA4aj3Ap0bnCcqaVaq82Av570WHGets18GxqzpUBE18poNoEuUoRhsiQ873OgMQTEgtjMHe9gbV5TUTQn95t46Na+5luzhte3r5Mz64gNOx5hVTYwmi+RnmaarkgANzreBdSSHYxgqsZRt7lrb48pwjN8/1jLYlr3NufnUgb9Z3x5PeUsEzlOsQMxTAz1x7Bnc0qFCq2wokqpuJZtZCyDgBEb2vG4WyGEvPDToe+3W5SCwuKLLifv/7Pq79gysR/YLqGtGsuXB+TVknpQ8ujJSLUT3pbJyOyu+Nzj8tS73uCE0zpL3A2XqdTRcswRupQg+0KL1F2Pdd0ZrQ5ra4vpktR1Ad1dT/wweUKakCofHsIN0k3KM9fYoC4KlQzdqq9pop45G1FmUhnHEVTisvS7Vll8EnmDzhyTs1Wxm4Zdtk9K+TVOvyQZr0iXWSDHY6GsCEh3ufnBhz8XpXLEyJfFvWGOMRog//qOskkFNpAH/tEJGJuWQt0avJ1jJF6q4LaSNWsnODfu109wOSXOMpViJuqeP+ROMiCbyqgb7ULU97FA8XdJxRRnPnvOF68bePHHLUwNtZaSfMH6Z8mszlY6nwAmWc1R+OKspsOLjhGB0/6j83puusCGsGDn+4/yVr6xM7s/plsxPRr0mAqoD60pKIn761m+VtV2X/0WGob6VhDb3CydAazvsJmgleY/Js4z7VXCxyktPC8QnpwDT206XszYP77CfI8PHBwXzdWNP2JrCqlKlMCys3auATamtNA1DQM4p1SACkQI1rDgQ3Qcx1opdRzQCHzObuhN90gJzb41nxjAFV/OfSytepOuxTnA3M3bmuUJYqIzJbaUwkE9s+DYqmrEtOEnhy8VYCfAfmOV+6yj5NjnWnEXxSRt3OZdcJC+mrObIeVf3dmVnP89VXcapIfmRTR0y7/yCX7bG1zNBTytXjC2MoXXKvnezT2VFiChuFD4lbVd7RXCZ4vmm1boLZfbDCcGCwykpd3DpRdOqhZwQcfiq6ukCUWE2taiXjk7/vr5oOIbeT6FLoh2nuUYZeBjDYiq7Be/DDZUAKDFSuJTuK5vSPophXf29jXmb+d2/RYxwQipDmL1rj94CDpWJAYnXxkbU3algtw1dAp62YcGgtjs0OT/6vM8ORoyECFu8hjIP28XxsdiUlC59CHytn64+h+pShFcoro6HYPHnweJFnOyEGtesnE7dh0Vl9jtWOX77wwilNChx9eThcHQia6dWgOPb/t6squddmIB4/+Si2A8rdU4nvwJa2kedOHs3mF2civkCy0AIPeUez/W5tlSFAQpEWDpIX4+ssx9Ge3ZUz5cSBlw+JKEoJvBYvg6lYrXN+feF4izVpMtnOtUvysilBQHTRYIeOIKYEUZfBotEWLm0AsCoMu8Mg99BtU24NOjgllL+Osg5O07wZlnezAiLg9yYEPA1de+DLKWNAu+49eLC1OT9yjDkeZZAb6ixJJ1hh0Gxz7uv16ZS9D7rMkEQ6aC5a2U79Qyk4eIbyuvzuDHP0vwaAP3E+a6zewUOzVojMkD4Ol8I754LJkHtFur6mDeJcdoNfrIonJ6xCjj4+4++s7Tpksy+N9sjdUqoGaGHtVyqaXwVL0kRmpchCzVZiDEndX7jFEBfG1r86hAau4/SZpBfh1gfLa3uljU85jOh7y9XCLQMyWud+2o7WHSMqM99E4ky/i8B/1elMiLNqtinnPp/oImjMJTWwN0BIM3bRgLTAjcMAQxuytB0Aiw3vyEb6Ct9YRGp0XYksEPVA3H2McRmW97IO9ZYuaPRMmMYRIy23qxy4gHRF7yxBchpDPsFMZJyqSP3+aIxE8UW3b3RfUxAW6fXQqH4HH5GfN8uL1eNQnpJXnCbv+U38TVwgIrlvt2n+iF84EluSa+rw5npAnLuCve1g8atvWjp7/9yaX0i8SylxO1kuYgwxSWGJTDA6w+QKZbQPq082BUiG1qHu7MrK5S/H95i4ZKww==')
})

// Mock.mock(/\/api\/ql\/rule\/data/, 'post', (req, res) => {
Mock.mock(/\/api\/bill\/qldata/, 'post', (req, res) => {
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
// Mock.mock(/\/billType\/findAll/, 'post', (req, res) => {
Mock.mock(/\/api\/bill\/findall/, 'post', (req, res) => {
  return Mock.mock(Encrypt(JSON.stringify(selectDataJson)))
})

// Mock.mock(/\/bill\/checkDateChart/, 'post', (req, res) => {
Mock.mock(/\/api\/bill\/checkdatechart/, 'post', (req, res) => {
  console.log('req',req, checkdateJson)
  return Mock.mock(Encrypt(JSON.stringify(checkdateJson)))
})
