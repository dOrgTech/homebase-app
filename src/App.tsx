import React from "react";
import "./App.css";
import { useConnectWallet } from "./store/wallet/hook";

const App: React.FC = () => {
  const provider = useConnectWallet();
  console.log(provider);

  return (
    <div className="App">
      {/* <div>{provider && <div>{provider?.signer.publicKey}</div>}</div> */}
    </div>
  );
};

export default App;
