import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  1: {
    Swaplus: {
      address: "0xC6A09F78CfB85275e5261200442b0B9AA9D4D0ce", //dev
      // address: "0x2044E2869D5E8b464d1282afa483F3DB240ecD44", //testnet
      abi: [
        {
          "type": "constructor",
          "inputs": [
            {
              "name": "_factory",
              "type": "address",
              "internalType": "address"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "addLiquidity",
          "inputs": [
            {
              "name": "groupA",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "groupB",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "amountsADesired",
              "type": "uint256[]",
              "internalType": "uint256[]"
            },
            {
              "name": "amountsBDesired",
              "type": "uint256[]",
              "internalType": "uint256[]"
            },
            {
              "name": "amountsAMin",
              "type": "uint256[]",
              "internalType": "uint256[]"
            },
            {
              "name": "amountsBMin",
              "type": "uint256[]",
              "internalType": "uint256[]"
            },
            {
              "name": "to",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "deadline",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "amountsA",
              "type": "uint256[]",
              "internalType": "uint256[]"
            },
            {
              "name": "amountsB",
              "type": "uint256[]",
              "internalType": "uint256[]"
            },
            {
              "name": "liquidity",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "factory",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "address",
              "internalType": "address"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "removeLiquidity",
          "inputs": [],
          "outputs": [],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "swapExactTokensForTokens",
          "inputs": [
            {
              "name": "groupIn",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "groupOut",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "tokensIn",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "tokensOut",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "amountsIn",
              "type": "uint256[]",
              "internalType": "uint256[]"
            },
            {
              "name": "amountOutsMin",
              "type": "uint256[]",
              "internalType": "uint256[]"
            },
            {
              "name": "to",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "deadline",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "amountsOut",
              "type": "uint256[]",
              "internalType": "uint256[]"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "swapTokensForExactTokens",
          "inputs": [
            {
              "name": "groupIn",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "groupOut",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "tokensIn",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "tokensOut",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "amountsOut",
              "type": "uint256[]",
              "internalType": "uint256[]"
            },
            {
              "name": "amountInMax",
              "type": "uint256[]",
              "internalType": "uint256[]"
            },
            {
              "name": "to",
              "type": "address",
              "internalType": "address"
            },
            {
              "name": "deadline",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "amountsIn",
              "type": "uint256[]",
              "internalType": "uint256[]"
            }
          ],
          "stateMutability": "nonpayable"
        }
      ]      
    },
    PoolFactory: {
      address: "0x97915c43511f8cB4Fbe7Ea03B96EEe940eC4AF12", //dev
      // address: "0x13e744214f9288a79246fD1bAcd5C64AD19FD124",
      abi: [
        {
          "type": "function",
          "name": "GROUP_TOKEN_NUMBER_MAX",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "allPools",
          "inputs": [
            {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "address",
              "internalType": "address"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "allPoolsLength",
          "inputs": [],
          "outputs": [
            {
              "name": "",
              "type": "uint256",
              "internalType": "uint256"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "checkTokenAddress",
          "inputs": [
            {
              "name": "groupX",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "groupY",
              "type": "address[]",
              "internalType": "address[]"
            }
          ],
          "outputs": [],
          "stateMutability": "pure"
        },
        {
          "type": "function",
          "name": "createPool",
          "inputs": [
            {
              "name": "groupA",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "groupB",
              "type": "address[]",
              "internalType": "address[]"
            }
          ],
          "outputs": [
            {
              "name": "pool",
              "type": "address",
              "internalType": "address"
            }
          ],
          "stateMutability": "nonpayable"
        },
        {
          "type": "function",
          "name": "getPools",
          "inputs": [
            {
              "name": "groupA",
              "type": "address[]",
              "internalType": "address[]"
            },
            {
              "name": "groupB",
              "type": "address[]",
              "internalType": "address[]"
            }
          ],
          "outputs": [
            {
              "name": "pool",
              "type": "address",
              "internalType": "address"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "function",
          "name": "pools",
          "inputs": [
            {
              "name": "",
              "type": "bytes32",
              "internalType": "bytes32"
            },
            {
              "name": "",
              "type": "bytes32",
              "internalType": "bytes32"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "address",
              "internalType": "address"
            }
          ],
          "stateMutability": "view"
        },
        {
          "type": "event",
          "name": "PoolCreated",
          "inputs": [
            {
              "name": "groupX",
              "type": "address[]",
              "indexed": false,
              "internalType": "address[]"
            },
            {
              "name": "groupY",
              "type": "address[]",
              "indexed": false,
              "internalType": "address[]"
            },
            {
              "name": "pool",
              "type": "address",
              "indexed": true,
              "internalType": "address"
            },
            {
              "name": "",
              "type": "uint256",
              "indexed": false,
              "internalType": "uint256"
            }
          ],
          "anonymous": false
        }
      ]
    },
    Vault: {
      address: "0x77e6Bd5c1988d8d766698F9CeEa5C24559b999f8", //dev
      // address: "0x764bBfF7aD16E3A7dB4A773643c306DF0898242e", //testnet
      abi: [{"type":"function","name":"addLiquidity","inputs":[{"name":"groupA","type":"address[]","internalType":"address[]"},{"name":"groupB","type":"address[]","internalType":"address[]"},{"name":"amountsADesired","type":"uint256[]","internalType":"uint256[]"},{"name":"amountsBDesired","type":"uint256[]","internalType":"uint256[]"},{"name":"amountsAMin","type":"uint256[]","internalType":"uint256[]"},{"name":"amountsBMin","type":"uint256[]","internalType":"uint256[]"},{"name":"to","type":"address","internalType":"address"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"balanceOf","inputs":[{"name":"user","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"deposit","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"poolsOf","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"address[]","internalType":"address[]"}],"stateMutability":"view"},{"type":"function","name":"withdraw","inputs":[{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"Deposit","inputs":[{"name":"user","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Withdrawal","inputs":[{"name":"user","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false}]
    },
    PEPE: {
      address: "0xa86582Ad5E80abc19F95f8A9Fb3905Cda0dAbd59",
      abi: [{"type":"constructor","inputs":[{"name":"_name","type":"string","internalType":"string"},{"name":"_symbol","type":"string","internalType":"string"}],"stateMutability":"nonpayable"},{"type":"function","name":"allowance","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"approve","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"decimals","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"mint","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"transfer","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"transferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"event","name":"Approval","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"spender","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"ERC20InsufficientAllowance","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"allowance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC20InsufficientBalance","inputs":[{"name":"sender","type":"address","internalType":"address"},{"name":"balance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC20InvalidApprover","inputs":[{"name":"approver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidReceiver","inputs":[{"name":"receiver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidSender","inputs":[{"name":"sender","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidSpender","inputs":[{"name":"spender","type":"address","internalType":"address"}]}]
    }
  }
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
