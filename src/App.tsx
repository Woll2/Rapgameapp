import { TonConnectButton } from "@tonconnect/ui-react";
import { useTonConnect } from "./hooks/useTonConnect";
import { usePresaleContract } from "./hooks/usePresaleContract";
import { useState } from "react";
import WebApp from "@twa-dev/sdk";

// Token configuration
const PRESALE_SUPPLY = 20000; // Amount allocated for presale
const RAP_TOKEN_ADDRESS = "EQAdgc5lDTT02t1jLT6gr_L26kv4HILWZYiVRBhcJX2lgZ6Y";

function App() {
  const { connected, connect } = useTonConnect();
  const { balance, purchase, loading } = usePresaleContract();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSwap = async () => {
    try {
      setError("");
      await purchase(Number(amount));
      WebApp.showAlert("Swap successful!");
      setAmount("");
    } catch (e: any) {
      setError(e.message);
      WebApp.showAlert(`Error: ${e.message}`);
    }
  };

  // Calculate expected output
  const getExpectedOutput = (input: string) => {
    const value = Number(input);
    return value ? value.toFixed(2) : "0.00";
  };

  if (loading) {
    return (
      <div className="Container">
        <div className="Card">
          <h2>Initializing</h2>
          <div className="Info">
            <p>Loading blockchain data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Container">
      <div className="Header">
        <h1>PRESALE</h1>
      </div>

      <div className="Card">
        <div className="CardHeader">
          <img src="RGcoinlogo.jpg" alt="RAP Logo" className="SwapLogo" />
          <h2>RAP</h2>
        </div>

        <div className="SwapCard">
          <div className="SwapSection">
            <div className="SwapHeader">
              <span>From</span>
              <span>Balance: {balance ? `${balance} TON` : "..."}</span>
            </div>

            <div className="TokenInput">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                min="0.5"
                max="1000"
                step="0.1"
              />
              <div className="TokenSelect">
                <img src="https://ton.org/download/ton_symbol.png" alt="TON" />
                <span>TON</span>
              </div>
            </div>
          </div>

          <div className="SwapArrow">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L12 20M12 20L18 14M12 20L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="SwapSection">
            <div className="SwapHeader">
              <span>To (estimated)</span>
              <span>Balance: 0.0 RAP</span>
            </div>

            <div className="TokenInput">
              <input
                type="number"
                value={getExpectedOutput(amount)}
                readOnly
                placeholder="0.0"
              />
              <div className="TokenSelect">
                <img src="RGcoinlogo.jpg" alt="RAP" />
                <span>RAP</span>
              </div>
            </div>
          </div>

          {connected ? (
            <button
              className="SwapButton"
              onClick={handleSwap}
              disabled={!amount || Number(amount) < 0.5 || Number(amount) > 1000}
            >
              {!amount 
                ? "Enter amount" 
                : Number(amount) < 0.5 
                ? "Amount too low" 
                : Number(amount) > 1000 
                ? "Amount too high"
                : "Swap TON to RAP"}
            </button>
          ) : (
            <TonConnectButton />
          )}

          <div className="ProgressSection">
            <div className="ProgressInfo">
              <span>Progress</span>
              <span>{balance ? ((PRESALE_SUPPLY - Number(balance)) / PRESALE_SUPPLY * 100).toFixed(2) : "0"}%</span>
            </div>

            <div className="ProgressBar">
              <div 
                className="Progress" 
                style={{ 
                  width: `${balance ? ((PRESALE_SUPPLY - Number(balance)) / PRESALE_SUPPLY) * 100 : 0}%` 
                }}
              />
            </div>
          </div>

          <div className="SwapInfo">
            <div className="SwapRate">
              <span>Exchange Rate</span>
              <span>1 TON = 1 RAP</span>
            </div>
            <div className="SwapRate">
              <span>Min. Swap</span>
              <span>0.5 TON</span>
            </div>
            <div className="SwapRate">
              <span>Max. Swap</span>
              <span>1,000 TON</span>
            </div>
          </div>

          {error && <div className="Error">{error}</div>}
        </div>
      </div>

      <div className="Card">
        <h2>Info</h2>
        <div className="Info">
          <p>
            Total Swapped: <span>{balance ? PRESALE_SUPPLY - Number(balance) : "..."} / {PRESALE_SUPPLY} RAP</span>
          </p>
          <p>
            Available: <span>{balance ? `${balance} RAP` : "..."}</span>
          </p>
          <p className="TokenInfo">
            <span className="Address">{RAP_TOKEN_ADDRESS}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
