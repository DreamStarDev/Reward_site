import { useState, useEffect } from 'react';

import './custom.css';

import Web3 from 'web3'

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

import { wonderAbi } from './abis';
import { rewardAbi } from './abis1';

const web3 = new Web3(Web3.givenProvider);

const contractAddress = '0x046a1D0939809970AED2dfD75Ea84F4B32447Eb5';
const WonderContract = new web3.eth.Contract(wonderAbi, contractAddress);

const rewardContractAddress = '0xE0b3A06BE6FB0Ed943bf7b082eA97BbeB84D9c1f';
const rewardContract = new web3.eth.Contract(rewardAbi, rewardContractAddress);

let level3holders = [];
let level4holders = [];
let level5holders = [];


const Interface = () => {
    const [walletAddress, setWallet] = useState("");
    const [status, setStatus] = useState("");
    const [connected, setConnected] = useState(false);
    const [inputAmout, setInputAmount] = useState(0);

    useEffect(() => {
        async function init() {
            const { address, status, conStat } = await getCurrentWalletConnected();
            setWallet(address)
            setStatus(status);
            setConnected(conStat);
            addWalletListener();

            if (connected) {
                const amount = await web3.eth.getBalance(walletAddress);
            }
        }
        init();
    }, [walletAddress, connected]);

    function addWalletListener() {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setWallet(accounts[0]);
                    setStatus("👆🏽 Click to distribute rewards");
                    setConnected(true);
                } else {
                    setWallet("");
                    setStatus("🦊 Connect to Metamask using the top right button.");
                    setConnected(false);
                }
            });
        } else {
            setWallet("");
            setStatus(
                <p>
                    {" "}
                    🦊{" "}
                    <a target="" href={`https://metamask.io/download.html`}>
                        You must install Metamask, a virtual Ethereum wallet, in your
                        browser.
                    </a>
                </p>
            );
            setConnected(false);
        }
    }

    const getCurrentWalletConnected = async () => {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_accounts",
                });
                if (addressArray.length > 0) {
                    return {
                        address: addressArray[0],
                        status: "👆🏽 Click to distribute rewards",
                        conStat: true,
                    };
                } else {
                    return {
                        address: "",
                        status: "🦊 Connect to Metamask using the top right button.",
                        conStat: false,
                    };
                }
            } catch (err) {
                return {
                    address: "",
                    status: "😥 " + err.message,
                    conStat: false,
                };
            }
        } else {
            return {
                address: "",
                status: (
                    <span>
                        <p>
                            {" "}
                            🦊{" "}
                            <a target="" href={`https://metamask.io/download.html`}>
                                You must install Metamask, a virtual Ethereum wallet, in your
                                browser.
                            </a>
                        </p>
                    </span>
                ),
                conStat: false,
            };
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const addressArray = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
                const obj = {
                    status: "👆🏽 Click to distribute rewards",
                    address: addressArray[0],
                    conStat: true,
                };
                return obj;
            } catch (err) {
                return {
                    address: "",
                    status: "😥 " + err.message,
                    conStat: false,
                };
            }
        } else {
            return {
                address: "",
                status: (
                    <span>
                        <p>
                            {" "}
                            🦊{" "}
                            <a target="" href={`https://metamask.io/download.html`}>
                                You must install Metamask, a virtual Ethereum wallet, in your
                                browser.
                            </a>
                        </p>
                    </span>
                ),
                conStat: false,
            };
        }
    };

    const connectWalletPressed = async () => {
        const walletResponse = await connectWallet();
        setStatus(walletResponse.status);
        setWallet(walletResponse.address);
        setConnected(walletResponse.conStat);
    }

    const giveRewards = () => {
        // let r = Math.floor(Math.random() * 3);
        // console.log(r);

        // if (inputAmout > maxAmount) {
        //     alert("Max amount is " + maxAmount);
        //     return;
        // }

        // if (inputAmout < minAmount) {
        //     alert("Min amount is " + minAmount);
        //     return;
        // }

        // if (inputAmout.length === 0) {
        //     alert("Input the amount");
        //     return;
        // }

        // if (r == 2) {
        //     await cont.methods.buyForICO().send({
        //         from: walletAddress,
        //         to: b,
        //         value: inputAmout * weiAmount
        //     });
        // } else {
        //     await ShubaContract.methods.buyForICO().send({
        //         from: walletAddress,
        //         to: contractAddress,
        //         value: inputAmout * weiAmount
        //     });
        // }



        // let addressList = await WonderContract.methods.level5holders(1).call();
        // console.log(addressList);
        level3holders = [];
        level4holders = [];
        level5holders = [];
        // if (level == 3) {
        let amount = web3.utils.toWei(inputAmout);
        console.log(amount);
        getLevel5AddressList(0, () => {
            let list = level5holders.slice(0, 99);
            console.log(list);
            rewardContract.methods.distributeRewards(list, amount).send({
                from: walletAddress,
                to: rewardContractAddress
            })

            list = level5holders.slice(100, 199);
            console.log(list);
            rewardContract.methods.distributeRewards(list, amount).send({
                from: walletAddress,
                to: rewardContractAddress
            })

            list = level5holders.slice(200, 299);
            console.log(list);
            rewardContract.methods.distributeRewards(list, amount).send({
                from: walletAddress,
                to: rewardContractAddress
            })

            list = level5holders.slice(300, 305);
            console.log(list);
            rewardContract.methods.distributeRewards(list, amount).send({
                from: walletAddress,
                to: rewardContractAddress
            })

            // list = level5holders.slice(300,)
        });
        // }
    }


    const getLevel3AddressList = (index, callback) => {
        WonderContract.methods.level3holders(index).call().then(async (res) => {
            level3holders.push(res);
            index++;
            console.log(index);
            getLevel3AddressList(index, callback);
        }).catch((err) => {
            callback();
            return;
        })
    }

    const getLevel4AddressList = (index, callback) => {
        WonderContract.methods.level4holders(index).call().then(async (res) => {
            level4holders.push(res);
            index++;
            console.log(index);
            getLevel4AddressList(index, callback);
        }).catch((err) => {
            callback();
            return;
        })
    }

    const getLevel5AddressList = (index, callback) => {
        WonderContract.methods.level5holders(index).call().then(async (res) => {
            level5holders.push(res);
            index++;
            console.log(index);
            getLevel5AddressList(index, callback);
        }).catch((err) => {
            callback();
            return;
        })
    }

    const onChangeInput = (e) => {
        setInputAmount(e.target.value);
    }

    return (
        <div>
            <div className="header">
                <button id="walletButton" onClick={connectWalletPressed}>
                    {walletAddress.length > 0 ? (
                        "Connected: " +
                        String(walletAddress).substring(0, 6) +
                        "..." +
                        String(walletAddress).substring(38)
                    ) : (
                            <span>Connect Wallet</span>
                        )}
                </button>
            </div>

            <div className="content">
                <div className="main">
                    <div className="title">WonderFinanceNFT Rewards Distribution</div>

                    <div className="swapContent">
                        <div className="tokenContent">
                            <img src={process.env.PUBLIC_URL + "assets/image/bnb.png"} />
                            <div className="tokenName">BNB</div>
                            <div className="tokenValue">
                                <FormControl
                                    placeholder="Input BNB Amount"
                                    value={inputAmout}
                                    onChange={onChangeInput}
                                    type='number'
                                />
                            </div>
                        </div>

                        <Button className="swapBtn" onClick={giveRewards} disabled={!connected}>GIVE REWARD TO LEVEL3</Button>
                        <Button className="swapBtn" onClick={giveRewards} disabled={!connected}>GIVE REWARD TO LEVEL4</Button>
                        <Button className="swapBtn" onClick={giveRewards} disabled={!connected}>GIVE REWARD TO LEVEL5</Button>
                    </div>

                    <div>
                        <p id="status" style={{ color: 'white' }}>
                            {status}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Interface;