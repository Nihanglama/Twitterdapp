import connectABI from "./abi.json";
import Web3 from "web3";

const contractAddress = "0x5F3673316ACa884a48324b0037AFE0125Ac65E23";

let contract;

async function init() {
  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Access the contract instance
      contract = new window.web3.eth.Contract(connectABI, contractAddress);
      console.log("Contract loaded");
    } catch (error) {
      console.error(
        "User denied account access or MetaMask not installed",
        error,
      );
    }
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider);
    // Access the contract instance
    contract = new window.web3.eth.Contract(connectABI, contractAddress);
    console.log("Contract loaded");
  }
  // Non-dapp browsers...
  else {
    console.log(
      "Non-Ethereum browser detected. You should consider trying MetaMask!",
    );
  }
}
async function connectWallet() {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setConnected(accounts[0]);
    getTweets(accounts[0]);
  } catch (error) {
    if (error.code === 4001) {
      console.log("Please connect to MetaMask.");
    } else {
      console.error(error);
    }
  }
}

function setConnected(address) {
  let shortadd =
    address.substring(0, 6) + "...." + address.substring(address.length - 4);
  document.getElementById("address").innerHTML = "connected to :" + shortadd;
  document.getElementById("myform").style.display = "block";
}

async function createTweet() {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  let tweet = document.querySelector("input").value;
  console.log(tweet);
  try {
    contract.methods.createTweet(tweet).send({ from: accounts[0] });
    document.querySelector("input").value = "";
  } catch (error) {
    alert("could not create tweet :", error);
  }
}
async function getTweets(userAccount) {
  console.log(userAccount);
  let mytweet;

  try {
    let mytweets = await contract.methods.getAllTweets(userAccount).call();
    for (let i = 0; i < mytweets.length; i++) {
      mytweet += `<div id="tweets"> 
        <span>${mytweets[i]["author"]}</span>
         <p>${mytweets[i]["content"]}</p> 
         <span>${mytweets[i]["likes"]}</span>
         `;
      console.log(i);
    }
    document.getElementById("mytweets").innerHTML = mytweet;
  } catch (error) {
    console.log("cannot get tweets", error);
  }
}

document.getElementById("connect").addEventListener("click", connectWallet);
document.getElementById("createTweet").addEventListener("click", createTweet);

init();
