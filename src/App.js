import React, { useEffect, useState } from 'react';
import './App.css';
import { Dev3SDK, FunctionsOracleRegistry } from 'dev3-sdk';

const sdk = new Dev3SDK(
  "cULb/.NGU7SYhiDF5VlQA0bKK07bV83RMNEj+XcD5KGVu",
  "3141e2b5-7849-47c9-8e0e-7222348f1935"
);

function App () {
  const [functionsRegistry, setFunctionsRegistry] = useState(null);
  const [functionsRegistryConfig, setFunctionsRegistryConfig] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [inputId, setInputId] = useState('');
  const [inputAmount, setInputAmount] = useState('');
  const [inputOwner, setInputOwner] = useState('');
  const [inputAddress, setInputAddress] = useState('');
  const [inputAddConsumer, setInputAddConsumer] = useState('');
  const [inputRemoveConsumer, setInputRemoveConsumer] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const functionsRegistry = new FunctionsOracleRegistry();
    await functionsRegistry.init();
    setFunctionsRegistry(functionsRegistry);
  }

  const createSubscription = async () => {
    setFunctionsRegistry(functionsRegistry);
    const subscription = await functionsRegistry.createSubscription();
    setSubscription(subscription);
  };

  const getSubscription = async () => {
    const subscription = await functionsRegistry.getSubscription(inputId);
    setSubscription(subscription);
  };

  const getFunctionsRegistryConfig = async () => {
    const functionsRegistryConfig = await functionsRegistry.getConfig();
    setFunctionsRegistryConfig(functionsRegistryConfig);
  };

  const handleFund = async () => {
    const action = await subscription.fund(inputAmount);
    await action.present();
    getSubscription();
  };

  const handleCancel = () => {
    subscription.cancel(inputAddress);
  };

  const handleAddConsumer = async () => {
    const action = await subscription.addConsumer(inputAddConsumer);
    await action.present();
    getSubscription();
  };

  const handleRemoveConsumer = async () => {
    const action = await subscription.removeConsumer(inputRemoveConsumer);
    await action.present();
    getSubscription();
  };

  const handleAcceptSubscriptionOwnerTransfer = async () => {
    const action = await subscription.acceptSubscriptionOwnerTransfer();
    await action.present();
    getSubscription();
  };

  const handleRequestSubscriptionOwnerTransfer = async () => {
    const action = await subscription.requestSubscriptionOwnerTransfer(inputOwner);
    await action.present();
  };

  return (
    <div className="App">
      <div className='network'>
        <h2>This app is running on the Sepolia test network</h2>
      </div>
      <h1>Functions Oracle Registry Info</h1>
      <div>
        { functionsRegistryConfig && 
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Maximum Gas Limit</th>
                <th>Staleness Seconds</th>
                <th>Gas After Payment Calculation</th>
                <th>Fallback Wei Per Unit Link</th>
                <th>Gas Overhead</th>
              </tr>
            </thead>
            <tbody>
                <tr key={functionsRegistry.address}>
                  <td>{functionsRegistry.address}</td>
                  <td>{functionsRegistryConfig.maxGasLimit}</td>
                  <td>{functionsRegistryConfig.stalenessSeconds}</td>
                  <td>{functionsRegistryConfig.gasAfterPaymentCalculation}</td>
                  <td>{functionsRegistryConfig.fallbackWeiPerUnitLink}</td>
                  <td>{functionsRegistryConfig.gasOverhead}</td>
                </tr>
            </tbody>
          </table>
        }
        <button onClick={getFunctionsRegistryConfig}>Get Functions Registry Config</button>
      </div>
      <h1>Subscription Info & Management</h1>
      {subscription && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Balance</th>
              <th>Owner</th>
              <th>Authorized Consumers</th>
            </tr>
          </thead>
          <tbody>
              <tr key={subscription.id}>
                <td>{subscription.id}</td>
                <td>{subscription.balance}</td>
                <td>{subscription.owner}</td>
                <td>{subscription.authorizedConsumers.join(', ')}</td>
              </tr>
          </tbody>
        </table>
      )}
      <div className="subscription">
        <div>
          <input
            type="number"
            placeholder="Subscription ID"
            value={inputId}
            onChange={e => setInputId(e.target.value)}
          />
          { !inputId && <button onClick={createSubscription}>Create Subscription</button> }
          { inputId && <button onClick={getSubscription}>Get Subscription</button> }
        </div>
      </div>
      {subscription &&
      <>
        <div className='management'>
            <div>
              <input
                type="number"
                placeholder="Amount"
                value={inputAmount}
                onChange={e => setInputAmount(e.target.value )}
              />
              <button onClick={handleFund}>Fund</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Recipient Address"
                value={inputAddress}
                onChange={e => setInputAddress(e.target.value )}
              />
              <button onClick={handleCancel}>Cancel</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Consumer Address"
                value={inputAddConsumer}
                onChange={e => setInputAddConsumer(e.target.value )}
              />
              <button onClick={handleAddConsumer}>Add Consumer</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="Consumer Address"
                value={inputRemoveConsumer}
                onChange={e => setInputRemoveConsumer(e.target.value )}
              />
              <button onClick={handleRemoveConsumer}>Remove Consumer</button>
            </div>
            <div>
              <input
                type="text"
                placeholder="New Owner Address"
                value={inputOwner}
                onChange={e => setInputOwner(e.target.value )}
              />
              <button onClick={handleRequestSubscriptionOwnerTransfer}>Request Subscription Owner Transfer</button>
            </div>
            <div>
              <button onClick={handleAcceptSubscriptionOwnerTransfer}>Accept Subscription Owner Transfer</button>
            </div>
        </div>
      </>
      }
    </div>
  );
}

export default App;