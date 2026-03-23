# Skill: Blockchain & Smart Contracts
> Activar quando: smart contracts Solidity, wagmi, Base blockchain, $WAGE token

---

## Stack Blockchain

```
Rede:          Base Sepolia (testnet) → Base Mainnet (produção)
Token:         $WAGE — ERC-20 padrão com extensões
Linguagem:     Solidity ^0.8.20
Framework:     Hardhat + ethers.js
Frontend:      wagmi v2 + viem
Carteiras:     MetaMask, Coinbase Wallet
```

---

## Smart Contract $WAGE

```solidity
// contracts/WageToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract WageToken is ERC20, Ownable, Pausable {
    // ── Constantes imutáveis ──────────────────────────
    uint256 public constant MAX_SUPPLY    = 1_000_000_000 * 10**18; // 1 bilião
    uint256 public constant TREASURY_RATE = 50;   // 0.5% (basis points)
    uint256 public constant BURN_RATE     = 200;  // 2.0% (basis points)
    uint256 public constant BASIS_POINTS  = 10_000;

    // ── Estado ───────────────────────────────────────
    address public treasury;
    uint256 public totalBurned;

    // ── Eventos ──────────────────────────────────────
    event WageMinted(address indexed worker, uint256 net, uint256 fee, uint256 burned);
    event WageBurned(address indexed holder, uint256 amount);
    event TreasuryUpdated(address indexed newTreasury);

    constructor(address _treasury) ERC20("WageCoin", "$WAGE") Ownable(msg.sender) {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
    }

    // ── Minting (apenas owner = Edge Function) ───────
    function mintWage(address worker, uint256 grossAmount)
        external
        onlyOwner
        whenNotPaused
    {
        require(worker != address(0), "Invalid worker");
        require(grossAmount > 0, "Amount must be positive");
        require(totalSupply() + grossAmount <= MAX_SUPPLY, "Supply cap reached");

        uint256 fee    = (grossAmount * TREASURY_RATE) / BASIS_POINTS;
        uint256 burned = (grossAmount * BURN_RATE)     / BASIS_POINTS;
        uint256 net    = grossAmount - fee - burned;

        // Mintar para o trabalhador e tesouro
        _mint(worker,   net);
        _mint(treasury, fee);
        // burned não é mintado — deflação programada

        totalBurned += burned;
        emit WageMinted(worker, net, fee, burned);
    }

    // ── Burn voluntário (utilizador queima os seus tokens) ──
    function burnWage(uint256 amount) external {
        _burn(msg.sender, amount);
        totalBurned += amount;
        emit WageBurned(msg.sender, amount);
    }

    // ── Admin ─────────────────────────────────────────
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        treasury = _treasury;
        emit TreasuryUpdated(_treasury);
    }

    function pause()   external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // ── Supply info ───────────────────────────────────
    function circulatingSupply() external view returns (uint256) {
        return totalSupply(); // MAX_SUPPLY - não mintado - burned
    }
}
```

---

## Deploy Script

```typescript
// contracts/scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const TREASURY   = process.env.TREASURY_ADDRESS!;

  console.log("Deploying with:", deployer.address);
  console.log("Treasury:", TREASURY);

  const WageToken = await ethers.getContractFactory("WageToken");
  const token = await WageToken.deploy(TREASURY);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("WageToken deployed to:", address);

  // Verificar no BaseScan
  if (process.env.BASESCAN_API_KEY) {
    await run("verify:verify", {
      address,
      constructorArguments: [TREASURY],
    });
  }
}

main().catch(console.error);
```

---

## Configuração wagmi (Frontend)

```typescript
// src/lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { baseSepolia, base } from "wagmi/chains";
import { coinbaseWallet, metaMask } from "wagmi/connectors";

const isProd = import.meta.env.PROD;

export const wagmiConfig = createConfig({
  chains: isProd ? [base] : [baseSepolia],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: "WageCompany" }),
  ],
  transports: {
    [baseSepolia.id]: http(import.meta.env.VITE_BASE_SEPOLIA_RPC),
    [base.id]:        http(import.meta.env.VITE_BASE_RPC),
  },
});

// ABI mínima necessária para o frontend
export const WAGE_TOKEN_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs:  [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "burnWage",
    type: "function",
    stateMutability: "nonpayable",
    inputs:  [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "WageMinted",
    type: "event",
    inputs: [
      { name: "worker",  type: "address", indexed: true },
      { name: "net",     type: "uint256", indexed: false },
      { name: "fee",     type: "uint256", indexed: false },
      { name: "burned",  type: "uint256", indexed: false },
    ],
  },
] as const;
```

---

## Hook de Carteira

```typescript
// src/hooks/useWallet.ts
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { formatUnits } from "viem";
import { WAGE_TOKEN_ABI } from "@/lib/wagmi";

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors }         = useConnect();
  const { disconnect }                  = useDisconnect();

  const { data: wageBalance } = useBalance({
    address,
    token: import.meta.env.VITE_WAGE_CONTRACT_ADDRESS as `0x${string}`,
    query: { enabled: isConnected },
  });

  return {
    address,
    isConnected,
    chain,
    wageBalance: wageBalance
      ? parseFloat(formatUnits(wageBalance.value, 18)).toFixed(4)
      : "0.0000",
    connect: () => connect({ connector: connectors[0] }),
    disconnect,
  };
}
```

---

## Segurança no Contrato

- `onlyOwner` em `mintWage` — apenas a Edge Function (via chave privada do servidor) pode mintar
- `whenNotPaused` — circuit breaker de emergência
- `MAX_SUPPLY` verificado em cada mint — impossível ultrapassar
- Chave privada do deployer: APENAS em variáveis de ambiente do servidor, nunca no código
- Auditoria com Slither antes de mainnet: `npx slither contracts/`
