"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

export function getTokenBySymbol(symbol: string): TokenInfo | null {
  return tokenList.find(item => item.symbol === symbol) || null
}

export function getTokenByAddress(address: string): TokenInfo | null {
  return tokenList.find(item => item.address === address) || null
}

export type TokenInfo = {
  symbol: string,
  name: string,
  address: string,
  weight: string,
  logo: string,
}

export default function TokenSelector({ selectedToken, setSelectedToken }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 选择 Token 按钮 */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center bg-gray-200 text-white px-3 py-2 rounded-lg hover:bg-gray-500 transition"
      >
        {selectedToken ? (
          <>
            <img src={selectedToken.logo} alt={selectedToken.symbol} className="w-5 h-5 mr-2 rounded-full" />
            <span className="text-black">{selectedToken.symbol}</span>
          </>
        ) : (
          <span className="text-black">select token</span>
        )}
        <ChevronDown className="ml-1" />
      </button>

      {/* 选择 Token 弹窗 */}
      {isOpen && (
        <div className="absolute top-10 left-0 w-64 bg-white shadow-lg rounded-lg p-4 border border-gray-200 z-50 max-h-80 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-bold">select token</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black">
              <X />
            </button>
          </div>
          <div className="space-y-2">
            {tokenList.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  setSelectedToken(token);
                  setIsOpen(false);
                }}
                className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <img src={token.logo} alt={token.symbol} className="w-6 h-6 mr-2 rounded-full" />
                <span className="font-semibold">{token.symbol}</span>
                <span className="ml-auto text-gray-500 text-sm">{token.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


const tokenListDev: TokenInfo[] = [
  { symbol: "WETH", name: "Wrapped Ether", address: "0xA002B84Ca3c9e8748209F286Ecf99300CA50161A", weight: "1893.76", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png" },
  { symbol: "USDT", name: "Tether USD", address: "0x039d7496e432c6Aea4c24648a59318b3cbe09942", weight: "1", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png" },
  { symbol: "USDC", name: "USD Coin", address: "0xaE7b7A1c6C4d859e19301ccAc2C6eD28A4C51288", weight: "1.0004", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
  { symbol: "DAI", name: "Dai Stablecoin", address: "0x7722f5d7964a04672761cdfdC7c17B7Ac8f197b7", weight: "0.99991", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png" },
  { symbol: "AAVE", name: "Aave", address: "0xA7240bcff60Eef40F31B8eD5d921BaD6DB13B199", weight: "175.01", logo: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110" },
  { symbol: "MKR", name: "Maker", address: "0x2C56932223cdE0D363266f1308c48Ff1BF9F9041", weight: "1430", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png" },
  { symbol: "PEPE", name: "Pepe", address: "0xdA796117bF6905DD8DB2fF1ab4397f6d2c4ADda3", weight: "0.00000765", logo: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1682922725" },
  { symbol: "1INCH", name: "1inch", address: "0x88777418972fB3F58489303d763d4DaF398A6527", weight: "0.1951", logo: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028" },
  // { symbol: "A8", name: "Ancient8", address: "0xaE7b7A1c6C4d859e19301ccAc2C6eD28A4C51288", weight: "", logo: "https://assets.coingecko.com/coins/images/39170/standard/A8_Token-04_200x200.png?1720798300" },
  { symbol: "BLUR", name: "Blur", address: "0x37d0eD258f37a966f33b75b5AE7486917a0ae614", weight: "0.1081", logo: "https://assets.coingecko.com/coins/images/28453/large/blur.png?1670745921" },
  // { symbol: "BUSD", name: "Binance USD", address: "0xA7240bcff60Eef40F31B8eD5d921BaD6DB13B199", weight: "", logo: "https://assets.coingecko.com/coins/images/9576/thumb/BUSD.png?1568947766" },
  // { symbol: "cbBTC", name: "Coinbase Wrapped BTC", address: "0x2C56932223cdE0D363266f1308c48Ff1BF9F9041", weight: "", logo: "https://assets.coingecko.com/coins/images/40143/standard/cbbtc.webp" },
  // { symbol: "cbETH", name: "Coinbase Wrapped Staked ETH", address: "0xdA796117bF6905DD8DB2fF1ab4397f6d2c4ADda3", weight: "", logo: "https://assets.coingecko.com/coins/images/27008/large/cbeth.png" },
  { symbol: "COMP", name: "Compound", address: "0x48288D0e3079A03f6EC1846554CFc58C2696Aaee", weight: "40.35", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png" },
  { symbol: "CRV", name: "Curve DAO Token", address: "0x7c77704007C9996Ee591C516f7319828BA49d91E", weight: "0.4851", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png" },
  // { symbol: "DEXT", name: "DexTools", address: "0x48288D0e3079A03f6EC1846554CFc58C2696Aaee", weight: "", logo: "https://assets.coingecko.com/coins/images/11603/thumb/dext.png?1605790188" },
  // { symbol: "DPI", name: "DeFi Pulse Index", address: "0x7c77704007C9996Ee591C516f7319828BA49d91E", weight: "", logo: "https://assets.coingecko.com/coins/images/12465/thumb/defi_pulse_index_set.png?1600051053" },
  { symbol: "DYDX", name: "dYdX", address: "0x081F08945fd17C5470f7bCee23FB57aB1099428E", weight: "0.6747", logo: "https://assets.coingecko.com/coins/images/17500/thumb/hjnIm9bV.jpg?1628009360" },
  { symbol: "EIGEN", name: "EigenLayer", address: "0x5EdB3Ff1EA450d1FF6d614F24f5C760761F7f688", weight: "0.966", logo: "https://assets.coingecko.com/coins/images/37441/large/eigen.jpg?1728023974" },
  // { symbol: "ELON", name: "Dogelon Mars", address: "0x98F74b7C96497070ba5052E02832EF9892962e62", weight: "", logo: "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413" },
  { symbol: "ENA", name: "Ethena", address: "0x98F74b7C96497070ba5052E02832EF9892962e62", weight: "0.3813", logo: "https://assets.coingecko.com/coins/images/36530/standard/ethena.png" },
  { symbol: "ENS", name: "Ethereum Name Service", address: "0xF47e3B0A1952A81F1afc41172762CB7CE8700133", weight: "16.31", logo: "https://assets.coingecko.com/coins/images/19785/thumb/acatxTm8_400x400.jpg?1635850140" },
  { symbol: "ETHFI", name: "Ether.fi", address: "0xfC3983DE3F7cBe1Ba01084469779470AD0BbeFfa", weight: "0.602", logo: "https://assets.coingecko.com/coins/images/35958/standard/etherfi.jpeg" },
  // { symbol: "EURC", name: "Euro Coin", address: "0xB1fC11F03b084FfF8daE95fA08e8D69ad2547Ec1", weight: "", logo: "https://assets.coingecko.com/coins/images/26045/thumb/euro-coin.png?1655394420" },
  { symbol: "GRT", name: "The Graph", address: "0xD6b8Eb34413f07a1a67A469345cFEa6633efd58d", weight: "0.0930", logo: "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png?1608145566" },
  { symbol: "GTC", name: "Gitcoin", address: "0xB1fC11F03b084FfF8daE95fA08e8D69ad2547Ec1", weight: "0.316", logo: "https://assets.coingecko.com/coins/images/15810/thumb/gitcoin.png?1621992929" },
  { symbol: "INJ", name: "Injective", address: "0x7306a649B451AE08781108445425Bd4E8AcF1E00", weight: "9.03", logo: "https://assets.coingecko.com/coins/images/12882/thumb/Secondary_Symbol.png?1628233237" },
  // { symbol: "L3", name: "Layer3", address: "0x88D3CAaD49fC2e8E38C812c5f4ACdd0a8B065F66", weight: "", logo: "https://assets.coingecko.com/coins/images/37768/large/Square.png" },
  { symbol: "LINK", name: "ChainLink Token", address: "0x934A389CaBFB84cdB3f0260B2a4FD575b8B345A3", weight: "13.99", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png" },
  // { symbol: "MATIC", name: "Polygon", address: "0x99aA73dA6309b8eC484eF2C95e96C131C1BBF7a0", weight: "", logo: "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912" },
  // { symbol: "MIR", name: "Mirror Protocol", address: "0xFBc00Fa47a7d3bbE3e82B5Aa560B47008c1bD64c", weight: "", logo: "https://assets.coingecko.com/coins/images/13295/thumb/mirror_logo_transparent.png?1611554658" },
  { symbol: "MOVE", name: "Movement", address: "0xB90AcF57C3BFE8e0E8215defc282B5F48b3edC74", weight: "0.4860", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/32452.png" },
  { symbol: "OMNI", name: "Omni Network", address: "0x88D3CAaD49fC2e8E38C812c5f4ACdd0a8B065F66", weight: "2.88", logo: "https://assets.coingecko.com/coins/images/36465/standard/Symbol-Color.png?1711511095" },
  { symbol: "POL", name: "Polygon Ecosystem Token", address: "0xAf7868a9BB72E16B930D50636519038d7F057470", weight: "0.2057", logo: "https://assets.coingecko.com/coins/images/32440/large/polygon.png?1698233684" },
  // { symbol: "PYUSD", name: "PayPal USD", address: "0xEFdc56feF9E089b086DD0a335F2c8c8CcB7E3031", weight: "", logo: "https://assets.coingecko.com/coins/images/31212/large/PYUSD_Logo_%282%29.png?1691458314" },
  { symbol: "QUICK", name: "Quickswap", address: "0x99aA73dA6309b8eC484eF2C95e96C131C1BBF7a0", weight: "0.02683", logo: "https://assets.coingecko.com/coins/images/13970/thumb/1_pOU6pBMEmiL-ZJVb0CYRjQ.png?1613386659" },
  // { symbol: "SAFE", name: "Safe", address: "0x58d0d610674C69F27B7519a6e2746E8b814548DE", weight: "", logo: "https://assets.coingecko.com/coins/images/27032/standard/Artboard_1_copy_8circle-1.png?1696526084" },
  { symbol: "SHIB", name: "Shiba Inu", address: "0xFBc00Fa47a7d3bbE3e82B5Aa560B47008c1bD64c", weight: "0.00001287", logo: "https://assets.coingecko.com/coins/images/11939/thumb/shiba.png?1622619446" },
  // { symbol: "SKY", name: "SKY Governance Token", address: "0x9118EA4a52C6c7873729c8d8702cCd85E573f9E9", weight: "", logo: "https://assets.coingecko.com/coins/images/39925/large/sky.jpg?1724827980" },
  { symbol: "SNX", name: "Synthetix Network Token", address: "0x3aD2306eDfBe72ce013cdb6b429212d9CdDE4F96", weight: "0.799", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png" },
  { symbol: "SOL", name: "SOL Wormhole", address: "0xfDD930c22708c7572278cf74D64f3721Eedc18Ad", weight: "128.29", logo: "https://assets.coingecko.com/coins/images/22876/thumb/SOL_wh_small.png?1644224316" },
  { symbol: "STRK", name: "Starknet", address: "0x7930AC7ddD1e35fD4b25230121A9C45923894e67", weight: "0.1565", logo: "https://assets.coingecko.com/coins/images/26433/standard/starknet.png?1696525507" },
  { symbol: "SUSHI", name: "Sushi", address: "0xEFdc56feF9E089b086DD0a335F2c8c8CcB7E3031", weight: "0.607", logo: "https://assets.coingecko.com/coins/images/12271/thumb/512x512_Logo_no_chop.png?1606986688" },
  // { symbol: "UNFI", name: "Unifi Protocol DAO", address: "0x6B99600daD0a1998337357696827381D122825F3", weight: "", logo: "https://assets.coingecko.com/coins/images/13152/thumb/logo-2.png?1605748967" },
  // { symbol: "VGX", name: "Voyager Token", address: "0xca9507C5F707103e86B45DF4b35C37FE2700BB5B", weight: "", logo: "https://assets.coingecko.com/coins/images/794/thumb/Voyager-vgx.png?1575693595" },
  { symbol: "WBTC", name: "Wrapped BTC", address: "0xb26012b855Fc76A974261455B12190e41fC4C228", weight: "84081.71", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png" },
  { symbol: "ZRX", name: "0x Protocol Token", address: "0x58d0d610674C69F27B7519a6e2746E8b814548DE", weight: "0.2488", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png" },
  { symbol: "SAND", name: "The Sandbox", address: "0x76C9284988B979f750BC504173ADc08E00c04398", weight: "0.2761", logo: "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg?1597397942" },
  // { symbol: "RNDR", name: "Render Token", address: "0x9C5E1B46Cf9D94Ec55F8ca6D2075D9DfB988673E", weight: "", logo: "https://assets.coingecko.com/coins/images/11636/thumb/rndr.png?1638840934" },
  { symbol: "REN", name: "Republic Token", address: "0x9118EA4a52C6c7873729c8d8702cCd85E573f9E9", weight: "0.01446", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x408e41876cCCDC0F92210600ef50372656052a38/logo.png" },
];

const tokenListProd: TokenInfo[] = [
  { symbol: "WETH", name: "Wrapped Ether", address: "0x02711d896B761D3CC5246233ea9893aEca058aB3", weight: "1893.76", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png" },
  { symbol: "USDT", name: "Tether USD", address: "0x530808bf315C12E82AC3EC4640c214fBb842fA59", weight: "1", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png" },
  { symbol: "USDC", name: "USD Coin", address: "0x7e49d6E4688A15950564c83697acd8aE6e8BbbBa", weight: "1.0004", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" },
  { symbol: "DAI", name: "Dai Stablecoin", address: "0xaAE36077988BB6d191cba18E202782f79bF58DF2", weight: "0.99991", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png" },
  { symbol: "AAVE", name: "Aave", address: "0x1608B6B829007b95f3d167AccD8E6D551Bc16695", weight: "175.01", logo: "https://assets.coingecko.com/coins/images/12645/thumb/AAVE.png?1601374110" },
  { symbol: "MKR", name: "Maker", address: "0xA2EE7B4a0450c10E8573C8780e5761cE225A5bf2", weight: "1430", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2/logo.png" },
  { symbol: "PEPE", name: "Pepe", address: "0x754452283d1A346DEE9E2045FD27A373812AFA95", weight: "0.00000765", logo: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1682922725" },
  { symbol: "1INCH", name: "1inch", address: "0xaf00993f6cAEA0FffcF5C64af391C11F5c2EDa3f", weight: "0.1951", logo: "https://assets.coingecko.com/coins/images/13469/thumb/1inch-token.png?1608803028" },
  // { symbol: "A8", name: "Ancient8", address: "0xaE7b7A1c6C4d859e19301ccAc2C6eD28A4C51288", weight: "", logo: "https://assets.coingecko.com/coins/images/39170/standard/A8_Token-04_200x200.png?1720798300" },
  { symbol: "BLUR", name: "Blur", address: "0xdBDf68dDd848E2Ab667f01fbB64e7719B9FBB3cc", weight: "0.1081", logo: "https://assets.coingecko.com/coins/images/28453/large/blur.png?1670745921" },
  // { symbol: "BUSD", name: "Binance USD", address: "0xA7240bcff60Eef40F31B8eD5d921BaD6DB13B199", weight: "", logo: "https://assets.coingecko.com/coins/images/9576/thumb/BUSD.png?1568947766" },
  // { symbol: "cbBTC", name: "Coinbase Wrapped BTC", address: "0x2C56932223cdE0D363266f1308c48Ff1BF9F9041", weight: "", logo: "https://assets.coingecko.com/coins/images/40143/standard/cbbtc.webp" },
  // { symbol: "cbETH", name: "Coinbase Wrapped Staked ETH", address: "0xdA796117bF6905DD8DB2fF1ab4397f6d2c4ADda3", weight: "", logo: "https://assets.coingecko.com/coins/images/27008/large/cbeth.png" },
  { symbol: "COMP", name: "Compound", address: "0xB8fC6F1e56D7E2590945ff92f2F05a0f757f7876", weight: "40.35", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png" },
  { symbol: "CRV", name: "Curve DAO Token", address: "0x1C4FEc162EDF212c5F34D58ba75C429312e658Cd", weight: "0.4851", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png" },
  // { symbol: "DEXT", name: "DexTools", address: "0x48288D0e3079A03f6EC1846554CFc58C2696Aaee", weight: "", logo: "https://assets.coingecko.com/coins/images/11603/thumb/dext.png?1605790188" },
  // { symbol: "DPI", name: "DeFi Pulse Index", address: "0x7c77704007C9996Ee591C516f7319828BA49d91E", weight: "", logo: "https://assets.coingecko.com/coins/images/12465/thumb/defi_pulse_index_set.png?1600051053" },
  { symbol: "DYDX", name: "dYdX", address: "0x14cBBB4a3DbB90E95c7C8EeF541d8B0757F2D261", weight: "0.6747", logo: "https://assets.coingecko.com/coins/images/17500/thumb/hjnIm9bV.jpg?1628009360" },
  { symbol: "EIGEN", name: "EigenLayer", address: "0xCe652Be1131871242D99E90c68964b9f8175184D", weight: "0.966", logo: "https://assets.coingecko.com/coins/images/37441/large/eigen.jpg?1728023974" },
  // { symbol: "ELON", name: "Dogelon Mars", address: "0x98F74b7C96497070ba5052E02832EF9892962e62", weight: "", logo: "https://assets.coingecko.com/coins/images/14962/thumb/6GxcPRo3_400x400.jpg?1619157413" },
  { symbol: "ENA", name: "Ethena", address: "0xA05AdF0c75Baa0df2b95FC9b7b7cbb3eB5149C80", weight: "0.3813", logo: "https://assets.coingecko.com/coins/images/36530/standard/ethena.png" },
  { symbol: "ENS", name: "Ethereum Name Service", address: "0x94E04DB746014200e1e78Ac448B9925B5A74ce2e", weight: "16.31", logo: "https://assets.coingecko.com/coins/images/19785/thumb/acatxTm8_400x400.jpg?1635850140" },
  { symbol: "ETHFI", name: "Ether.fi", address: "0xaDEE9E9A309e3f13F1C92462C3cD6B9d2229FEED", weight: "0.602", logo: "https://assets.coingecko.com/coins/images/35958/standard/etherfi.jpeg" },
  // { symbol: "EURC", name: "Euro Coin", address: "0xB1fC11F03b084FfF8daE95fA08e8D69ad2547Ec1", weight: "", logo: "https://assets.coingecko.com/coins/images/26045/thumb/euro-coin.png?1655394420" },
  { symbol: "GRT", name: "The Graph", address: "0xB8b1c5882449743775F1a54Cea629175C25F160A", weight: "0.0930", logo: "https://assets.coingecko.com/coins/images/13397/thumb/Graph_Token.png?1608145566" },
  { symbol: "GTC", name: "Gitcoin", address: "0x30400b819a7AA74Ee00d6f48F0D3f7F88A868335", weight: "0.316", logo: "https://assets.coingecko.com/coins/images/15810/thumb/gitcoin.png?1621992929" },
  { symbol: "INJ", name: "Injective", address: "0x0cfad0A1dF1c0dFeA1802c8C310E29F41390Ae13", weight: "9.03", logo: "https://assets.coingecko.com/coins/images/12882/thumb/Secondary_Symbol.png?1628233237" },
  // { symbol: "L3", name: "Layer3", address: "0x88D3CAaD49fC2e8E38C812c5f4ACdd0a8B065F66", weight: "", logo: "https://assets.coingecko.com/coins/images/37768/large/Square.png" },
  { symbol: "LINK", name: "ChainLink Token", address: "0x2b276a8792232fFF4df7c6de6919C6eb9bbA2978", weight: "13.99", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png" },
  // { symbol: "MATIC", name: "Polygon", address: "0x99aA73dA6309b8eC484eF2C95e96C131C1BBF7a0", weight: "", logo: "https://assets.coingecko.com/coins/images/4713/thumb/matic-token-icon.png?1624446912" },
  // { symbol: "MIR", name: "Mirror Protocol", address: "0xFBc00Fa47a7d3bbE3e82B5Aa560B47008c1bD64c", weight: "", logo: "https://assets.coingecko.com/coins/images/13295/thumb/mirror_logo_transparent.png?1611554658" },
  { symbol: "MOVE", name: "Movement", address: "0x2d9D22E20e2bA1C61ff9c19662076A475dcF7eA4", weight: "0.4860", logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/32452.png" },
  { symbol: "OMNI", name: "Omni Network", address: "0xa37a9Ca2e89A1713b00bE26af6D5E3324238d18A", weight: "2.88", logo: "https://assets.coingecko.com/coins/images/36465/standard/Symbol-Color.png?1711511095" },
  { symbol: "POL", name: "Polygon Ecosystem Token", address: "0x8f6bFf73Edf0A806eC15268525cfe7346dafEF05", weight: "0.2057", logo: "https://assets.coingecko.com/coins/images/32440/large/polygon.png?1698233684" },
  // { symbol: "PYUSD", name: "PayPal USD", address: "0xEFdc56feF9E089b086DD0a335F2c8c8CcB7E3031", weight: "", logo: "https://assets.coingecko.com/coins/images/31212/large/PYUSD_Logo_%282%29.png?1691458314" },
  { symbol: "QUICK", name: "Quickswap", address: "0x2A26cde00d39f5c59E3A771c2287950B31A57969", weight: "0.02683", logo: "https://assets.coingecko.com/coins/images/13970/thumb/1_pOU6pBMEmiL-ZJVb0CYRjQ.png?1613386659" },
  // { symbol: "SAFE", name: "Safe", address: "0x58d0d610674C69F27B7519a6e2746E8b814548DE", weight: "", logo: "https://assets.coingecko.com/coins/images/27032/standard/Artboard_1_copy_8circle-1.png?1696526084" },
  { symbol: "SHIB", name: "Shiba Inu", address: "0x5480A738823437Fddf03373D0932E88D50a88AE6", weight: "0.00001287", logo: "https://assets.coingecko.com/coins/images/11939/thumb/shiba.png?1622619446" },
  // { symbol: "SKY", name: "SKY Governance Token", address: "0x9118EA4a52C6c7873729c8d8702cCd85E573f9E9", weight: "", logo: "https://assets.coingecko.com/coins/images/39925/large/sky.jpg?1724827980" },
  { symbol: "SNX", name: "Synthetix Network Token", address: "0x8bF8e5328fd977205a7781ef0Ac0988E9A66eD47", weight: "0.799", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png" },
  { symbol: "SOL", name: "SOL Wormhole", address: "0x7c5D15a55e9cD9474cc4F2288307B894645Ac94F", weight: "128.29", logo: "https://assets.coingecko.com/coins/images/22876/thumb/SOL_wh_small.png?1644224316" },
  { symbol: "STRK", name: "Starknet", address: "0xFF0eE022124CF40fEB3C069574071b3ff062D710", weight: "0.1565", logo: "https://assets.coingecko.com/coins/images/26433/standard/starknet.png?1696525507" },
  { symbol: "SUSHI", name: "Sushi", address: "0x8075607E34ac60A6156b6B90A3F038c7a97090a6", weight: "0.607", logo: "https://assets.coingecko.com/coins/images/12271/thumb/512x512_Logo_no_chop.png?1606986688" },
  // { symbol: "UNFI", name: "Unifi Protocol DAO", address: "0x6B99600daD0a1998337357696827381D122825F3", weight: "", logo: "https://assets.coingecko.com/coins/images/13152/thumb/logo-2.png?1605748967" },
  // { symbol: "VGX", name: "Voyager Token", address: "0xca9507C5F707103e86B45DF4b35C37FE2700BB5B", weight: "", logo: "https://assets.coingecko.com/coins/images/794/thumb/Voyager-vgx.png?1575693595" },
  { symbol: "WBTC", name: "Wrapped BTC", address: "0xaB2E5686bd1747ff42DD7cE7d95D579b1F09d854", weight: "84081.71", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png" },
  { symbol: "ZRX", name: "0x Protocol Token", address: "0x319a54cDDc25df7Cc76BD4DBF659990F1a79F311", weight: "0.2488", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xE41d2489571d322189246DaFA5ebDe1F4699F498/logo.png" },
  { symbol: "SAND", name: "The Sandbox", address: "0xBDA86b7c96Ea0f347C6c1dA37a9F20d196A65D7f", weight: "0.2761", logo: "https://assets.coingecko.com/coins/images/12129/thumb/sandbox_logo.jpg?1597397942" },
  // { symbol: "RNDR", name: "Render Token", address: "0x9C5E1B46Cf9D94Ec55F8ca6D2075D9DfB988673E", weight: "", logo: "https://assets.coingecko.com/coins/images/11636/thumb/rndr.png?1638840934" },
  { symbol: "REN", name: "Republic Token", address: "0x1fe5FFe0553b2E6e9B14aD237f8A15eeE00f05ec", weight: "0.01446", logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x408e41876cCCDC0F92210600ef50372656052a38/logo.png" },
];

export const tokenList: TokenInfo[] = process.env.NODE_ENV === "production" ? tokenListProd : tokenListDev;
