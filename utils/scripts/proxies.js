window.generateProxyConfig = (proxy) => {
  let proxyAuthentication = {
    username: null,
    password: null
  }
  let outProxy = proxy.replace("http://", "").replace("https://", "");
  if (outProxy.includes("@") || outProxy.split(":").length == 4) { // proxy authenticion needed
    if (outProxy.includes("@")) {
      let authenticion = outProxy.split("@")[0];
      proxyAuthentication.username = authenticion.split(":")[0];
      proxyAuthentication.password = authenticion.split(":")[1];
      outProxy = outProxy.split("@")[1];
    } else if (outProxy.split(":").length == 4) {
      let authenticion = outProxy.split(":")[2] + ":" + outProxy.split(":")[3];
      proxyAuthentication.username = authenticion.split(":")[0];
      proxyAuthentication.password = authenticion.split(":")[1];
      outProxy = outProxy.split(":")[0] + ":" + outProxy.split(":")[1];
    }
  }
  return { proxy: outProxy, authenticion: proxyAuthentication }
};
