/** @param {NS} ns */
export async function main(ns) {
  let fileName = ns.args[0];
  let hostServer = ns.args[1];
  let cctType = "";
  cctType = ns.codingcontract.getContractType(fileName, hostServer);
  ns.tprint(cctType);
}