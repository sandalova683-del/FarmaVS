/* FormulaVS Health bridge. Browser-safe; native implementations are provided by Capacitor. */
(function(){
  const plugin=()=>window.Capacitor?.Plugins?.FormulaVSHealth||null;
  const isNative=()=>!!plugin();
  async function getStatus(){
    if(!isNative()) return {status:'unavailable',platform:'web'};
    return plugin().getStatus();
  }
  async function requestPermissions(){
    if(!isNative()) return {status:'unavailable',platform:'web'};
    return plugin().requestPermissions();
  }
  async function openSettings(){
    if(!isNative()) return {status:'unavailable',platform:'web'};
    return plugin().openSettings();
  }
  async function getSteps(date){
    if(!isNative()) return {status:'unavailable',platform:'web',value:null};
    return plugin().getSteps({date});
  }
  async function syncToday(date){
    const d=date||new Date().toISOString().slice(0,10);
    let status=await getStatus();
    if(status.status==='permission_required'||status.status==='not_connected'){
      status=await requestPermissions();
      if(status.status!=='connected') return status;
    }
    const result=await getSteps(d);
    if(result && result.value!=null){
      result.syncedAt=new Date().toISOString();
      result.sourceLabel=result.source==='healthkit'?'Apple Health':'Health Connect';
    }
    return result;
  }
  window.FormulaVSHealth={getStatus,requestPermissions,openSettings,getSteps,syncToday,isNative};
})();
