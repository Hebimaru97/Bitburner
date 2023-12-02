//deploy.js
/** @param {NS} ns **/
export async function main(ns) {

  const host = ns.args[0];
  const script = ns.args[1];
  const attackedMachine = ns.args[2];

  if (!ns.serverExists(host)) {
    ns.tprint(`Server '${host}' does not exist. Aborting.`);
    return;
  }
  if (!ns.ls(ns.getHostname()).find(f => f === script)) {
    ns.tprint(`Script '${script}' does not exist. Aborting.`);
    return;
  }
  try {
    const threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(script));
    ns.tprint(`Launching script '${script}' on server '${host}' with ${threads} threads and the following arguments: ${attackedMachine}`);
    ns.scp(script, ns.getHostname(), host);
    ns.exec(script, host, threads, attackedMachine);
  }
  catch { }
}