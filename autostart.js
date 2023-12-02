/** @param {NS} ns */
export async function main(ns) {
  const servers = new Set(['home']);
  let i = 0;
  for (const server of servers) {
    const newserv = ns.scan(server)
    for (const found of newserv) {
      servers.add(found)
    }
    i++
  }
  for (const serv of servers) {
    try {
      ns.sqlinject(serv)
    } catch { }
    try {
      ns.httpworm(serv)
    } catch { }
    try {
      ns.relaysmtp(serv)
    } catch { }
    try {
      ns.ftpcrack(serv)
    }
    catch { }
    try {
      ns.brutessh(serv)
    } catch { }
    try {
      ns.nuke(serv);
      await ns.sleep(100);
      ns.scp("basicHack.js", serv);
      ns.killall(serv);
      ns.exec("deploy.js", "home", 1, serv, "basicHack.js", "harakiri-sushi")
    } catch { }
  }
  ns.tprint("done");
}