import { WaitPids } from "./util.js"

/** @param {NS} ns */
export function IsPrepped(ns, target) {
  let serverSec = ns.getServerSecurityLevel(target);
  let serverMinSec = 0 + ns.getServerMinSecurityLevel(target);
  let serverMoney = ns.getServerMoneyAvailable(target);
  let serverMaxMoney = ns.getServerMaxMoney(target);
  return serverSec == serverMinSec && serverMoney == serverMaxMoney; //if true the server is prepped
}

export async function Prep(ns, target, attacker, threadsGr, threadsWk) {
  while (!IsPrepped(ns, target)) {
    let pids = [];
    console.log("now gr")
    pids.push(ns.exec("bin.gw.js", attacker, Math.min(threadsGr, 1), target));//then  if !target.moneyMax exec grow -t 12
    console.log("now Wk")
    pids.push(ns.exec("bin.wk.js", attacker, Math.min(threadsWk, 1), target));//then exec weaken 1 unitl target.moneyMax
    await WaitPids(ns, pids);
  }
}
