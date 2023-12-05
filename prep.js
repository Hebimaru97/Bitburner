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
  const minSec = ns.getServerMinSecurityLevel(target);
  const sec = ns.getServerSecurityLevel(target);
  while (!IsPrepped(ns, target)) {
    if (sec !== minSec) {
      console.log("weakening to 0")
      let pids = [];
      console.log("now Wk")
      pids.push(ns.exec("bin.wk.js", attacker, Math.min(threadsWk, 100), target));//then exec weaken 1 unitl target.moneyMax
    } else {
      console.log("running GW until prepped")
      let pids = [];
      console.log("now gr")
      pids.push(ns.exec("bin.gr.js", attacker, Math.min(threadsGr, 100), target));//then  if !target.moneyMax exec grow -t 12
      console.log("now Wk")
      pids.push(ns.exec("bin.wk.js", attacker, Math.min(threadsWk, 100), target));//then exec weaken 1 unitl target.moneyMax
      await WaitPids(ns, pids);
    }
  }
}
