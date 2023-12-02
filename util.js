export async function WaitPids(ns, pids) {
    if (!Array.isArray(pids)) pids = [pids];
    while (pids.some(p => ns.getRunningScript(p) != undefined)) { await ns.sleep(5); }
}
export function PortOpenersOwned(ns){
  let portOpeners=0;
  if (fileExists("BruteSSH.exe", home)) {portOpeners++};
  if (fileExists("FTPCrack.exe", home)) {portOpeners++};
  if (fileExists("relaySMTP.exe", home)) {portOpeners++};
  if (fileExists("HTTPWorm.exe", home)) {portOpeners++};
  if (fileExists("SQLInject.exe", home)) {portOpeners++};
  return portOpeners
}