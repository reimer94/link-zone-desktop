export default class LinkZone {
  proxyURL = "/api";

  constructor() { }

  linkZoneRequest(payload) {

    fetch(this.proxyURL, {
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        console.log(JSON.stringify(data));
        return data
      })
      .catch(err => {
        console.log(err)
        return err
      })
    return {}
  }

  getSystemStatus () {

    const data = {
      jsonrpc: "2.0",
      method: "GetSystemStatus",
      id: "13.4"
    }
    const res = this.linkZoneRequest(data)

    return res
  }

  setNetworkSettings(networkMode) {

    const data = {
      jsonrpc:"2.0",
      method:"SetNetworkSettings",
      params: {
        NetworkMode: networkMode.value,
        NetselectionMode: 0
      },
      id:"4.7"
    }

    const res = this.linkZoneRequest(data)
    const status = res.ok ? "OK" : "ERROR"

    return status
  }

  connect(){

    const data = {
      jsonrpc:"2.0",
      method:"Connect",
      id:"3.2"
    }
    return this.linkZoneRequest(data)
  }

  disconnect(){

    const data = {
      jsonrpc:"2.0",
      method:"DisConnect",
      id:"3.2"
    }
    return this.linkZoneRequest(data)
  }

  sendUSSD(code){
    const data = {
      jsonrpc: "2.0",
      method: "SendUSSD",
      params: {
        UssdContent: code,
        UssdType: 1
      },
      id: "8.1"
    }
    return this.linkZoneRequest(data)
  }

  setNetwork(networkMode) {
    this.disconnect()
    this.setNetworkSettings(networkMode)
    this.connect()
  }

  getUSSDSendResult() {

    const data = {
      jsonrpc: "2.0",
      method: "GetUSSDSendResult",
      id: "8.2"
    }
    const res = this.linkZoneRequest(data)
    if (!res.ok)
      return null

    if (res.result['SendState'] === 1)
      return this.getUSSDSendResult()

    if (res.result['SendState'] === 2)
      return res.result['UssdContent']

    return null
  }

  sendUssdCode(code) {

    this.sendUSSD(code)
    const message = this.getUSSDSendResult()

    const status = message ? "OK" : "ERROR"

    return status
  }
}