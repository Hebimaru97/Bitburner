/** @param {NS} ns **/

import { IsPrepped, Prep } from "./prep.js"
import { WaitPids, PortOpenersOwned } from "./util.js"

function dpList(ns, current = "home", set = new Set()) {
  let connections = ns.scan(current)
  let next = connections.filter(c => !set.has(c))
  next.forEach(n => {
    set.add(n);
    return dpList(ns, n, set)
  })
  return Array.from(set.keys())
}
export async function main(ns) {
  const reservedHomeRam = 20
  let target = "";
  let sList = dpList(ns)
  let servers = [];
  let server = "";
  for (let s of sList) {
    servers.push(s);
  }
  for (let server of servers) {
    await ns.scp(["bin.gr.js", "bin.hk.js", "bin.wk.js"], server, "home");
  }
  let serversWithRam = [];//compile list of servers with >0 Ram
  for (let server of servers) {
    if (server.maxRam > 0) {
      serversWithRam.push(server)

    }
  }

  if (!server.hasAdminRights) {//gain admin on servers with ram
    try {
      ns.brutessh(server)
      ns.ftpcrack(server)
      ns.relaysmtp(server)
      ns.httpworm(server)
      ns.sqlinject(server)
    } catch { }

    try {
      ns.nuke(server)
    } catch { }
  }

  //if formulas.exe is on home X
  //else {
  let targets = [];
  server = "";
  target = "";
  PortOpenersOwned;
  let portOpeners = 0;
  //if (hackingLevel) { //if arg0 hacking skill level > no formulas.exe
  for (server of servers) {
    if (ns.getServerRequiredHackingLevel(server) / 2 <= ns.getHackingLevel()) {//determine target list
      if (ns.getServerNumPortsRequired(server) <= portOpeners) {
        targets.push(server)
      }
    }
  }
  let serverObjects = targets.map(ns.getServer); //define target
  serverObjects.sort((a, b) => (b.moneyMax / b.minDifficulty) - (a.moneyMax / a.minDifficulty))
  //const nextTarget = serverObjects.entries();//for when i can cycle targets
  target = (serverObjects[0].hostname);//optimal target (probably)

  ns.tprint("attacking ", target);
  console.log("attacking ", target);
  let targetHackTime = ns.getHackTime(target); //calculate time for hgw
  let targetWeakenTime = targetHackTime * 4;
  let targetGrowTime = targetHackTime * 3.2;

  //attacking from home for now
  let attacker = "home"

  //prep server
  //threads=ramfree/mem script
  const costPerInstHk = 1.70//ram cost of hwg scripts per thread
  const costPerInstWk = 1.75
  const costPerInstGr = 1.75

  let freeRam = Math.max(0, ns.getServerMaxRam(attacker) - ns.getServerUsedRam(attacker) - (attacker.hostname === "home" ? reservedHomeRam : 20));
  Math.floor(freeRam);

  let threadsWk = Math.floor(freeRam / costPerInstWk);
  let threadsHk = Math.floor(freeRam / costPerInstHk);
  let threadsGr = Math.floor(freeRam / costPerInstGr);
  //weaken to 0, then grow x12, then weaken 1 loop
  if (!IsPrepped(ns, target)) {
    console.log("prepping")
    await Prep(ns, target, attacker, threadsGr, threadsWk);
  } else {
    while (true) {
      console.log("attacking ", target, " with HWGW, sice it is prepped")
      let pids = [];//do the HWGW loop
      console.log("exec Hk")
      pids.push(ns.exec("bin.hk.js", attacker, Math.min(threadsHk, 100), target));
      console.log("exec Wk")
      pids.push(ns.exec("bin.wk.js", attacker, Math.min(threadsWk, 100), target));
      console.log("exec Gr")
      pids.push(ns.exec("bin.gr.js", attacker, Math.min(threadsGr, 100), target));
      console.log("exec Wk")
      pids.push(ns.exec("bin.wk.js", attacker, Math.min(threadsWk, 100), target));
      await WaitPids(ns, pids);
    }
  }
}
