import Web3 from 'web3';
import MelaSwap from "../build/contracts/MelaRouter.min.json";
import ERC20 from "../build/contracts/ERC20.json";


let web3;
let swaprouter;
let accounts = [];
let wbnb = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
let setInt = null;
let tokenInBalance = null;
let tokenOutBalance = null; 

const initWeb3 = () => {
    return new Promise((resolve,reject)=>{
        if (typeof window.ethereum !== "undefined") {
            //window.ethereum.enable()
            
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(()=>{
                    resolve(new Web3(window.ethereum));
                }).catch(e=>{reject(e)});
                return;
        }

        if (typeof window.web3 !== "undefined") {
            return resolve (new Web3(window.web3.currentProvider));
        }
        resolve(new Web3.providers.HttpProvider('http://localhost:7545'));
    })

}
const initContract = () => {
    const developmentKey = Object.keys(MelaSwap.networks)[0];
    return new web3.eth.Contract(
        MelaSwap.abi,
        MelaSwap.networks[developmentKey].address
    )
  
 }
const getAccounts = async() => {
    web3.eth.getAccounts().then(result=> {
        console.log('Account',result);
        accounts = result;
        return result;
        
    } );
    
}
ethereum.on('accountsChanged', function (accounts) {

    initContract();
    getAccounts();
    balanceOfToken();

  });
const getAmountMinOut = async(tokenIn,tokenOut,amount) => {
    let amountOuts = []
    return swaprouter.methods.getAmountOutMin(tokenIn,tokenOut,web3.utils.toWei(amount.toString(),'ether')).call({from:accounts[0]}).then(result=> {
        
        amountOuts = result;
        return web3.utils.fromWei(amountOuts,'ether');
    })
}
window.getAmountMinOut = getAmountMinOut;

const searchAddress = async(token) => {
    let erc20Token = null;
    return swaprouter.methods.findERC20Token(token).call({from:accounts[0]}).then (result => {
        erc20Token = result;
        //console.log('TOken',erc20Token)
        return erc20Token;
    })
}

window.searchAddress = searchAddress;


const balanceOfToken = async(tokenIn,tokenOut) => {
    let wbnb_balance;
    let token_balance = null;
    
    if (web3) {
        return web3.eth.getAccounts().then(async account=> {
            console.log("Balances",tokenIn,'tokenout',tokenOut,'acct',account[0]); 
            if (tokenIn == wbnb || tokenOut == wbnb) {
                if (tokenIn == wbnb)  {
                    wbnb_balance = await web3.eth.getBalance(account[0]);
                    if (tokenOut != null)
                        token_balance = await swaprouter.methods.getBalance(tokenOut).call({from:account[0]});
                    console.log("Balancesxx",wbnb_balance)
                } else {
                    token_balance = await web3.eth.getBalance(account[0]);
                    if (tokenIn != null)
                        wbnb_balance = await swaprouter.methods.getBalance(tokenIn).call({from:account[0]});
                }
                    
            }else {
                if (tokenIn != null)
                    wbnb_balance = await swaprouter.methods.getBalance(tokenIn).call({from:account[0]});
                if (tokenOut != null)
                    token_balance = await swaprouter.methods.getBalance(tokenOut).call({from:account[0]});
            } 
            if (token_balance != null && wbnb_balance != null)
                return [web3.utils.fromWei(wbnb_balance.toString(),'ether'),web3.utils.fromWei(token_balance.toString(),'ether')];
            else  if (token_balance == null && wbnb_balance != null)
                return [web3.utils.fromWei(wbnb_balance.toString(),'ether'),""];
            else if (token_balance != null && wbnb_balance == null)
                return ["",web3.utils.fromWei(token_balance.toString(),'ether')];
        });  

        
    }  
}
window.balanceOfToken = balanceOfToken;


//Swap Section
const checkAllowance = async(tokenAddr,Spender) => {
    let erc20 = await new web3.eth.Contract(
        ERC20.abi,tokenAddr);
    return web3.eth.getAccounts().then(async account =>{
        return erc20.methods.allowance(accounts[0],Spender).call({from:account[0]}).then(result => {
            //console.log("Approved Spend",result)
            return result;
        })
    } )
}
window.checkAllowance = checkAllowance;

const approveToken = async(tokenAddr,Spender) => {
    let erc20 = await new web3.eth.Contract(
        ERC20.abi,tokenAddr);
    return web3.eth.getAccounts().then(async account =>{
        return erc20.methods.approve(Spender,web3.utils.toWei('10000000000000000','ether')).send({from:account[0],gas:300000,gasPrice:null}).then(result => {
            console.log("Approved Spend",result)
            return result;
        })
    } )
}
window.approveToken = approveToken;

const swapBNBforToken = async(tokenOut,amountIn,amountMin) => {
    try {
        return web3.eth.getAccounts().then(async account=> {
            return swaprouter.methods.swapExactETHForTokens(wbnb,tokenOut,web3.utils.toWei(amountMin.toString(),'ether'),account[0]).send({from:account[0],value:web3.utils.toWei(amountIn.toString(),'ether'),gas:300000,gasPrice:null});
        })        
    } catch (error) {
       return error; 
    }

}
window.swapBNBforToken = swapBNBforToken;

const swapTokenforBNB = async(tokenIn,amountIn,amountMin) => {
    try {
        return web3.eth.getAccounts().then(async account=> {
            return swaprouter.methods.swapExactTokensForETH(tokenIn,wbnb,web3.utils.toWei(amountIn.toString(),'ether'),web3.utils.toWei(amountMin.toString(),'ether'),account[0]).send({from:account[0],gas:300000,gasPrice:null});
        })        
    } catch (error) {
       return error; 
    }

}
window.swapTokenforBNB = swapTokenforBNB;

const swapTokenforToken = async(tokenIn,tokenOut,amountIn,amountMin) => {
    try {
        return web3.eth.getAccounts().then(async account=> {
            return swaprouter.methods.swapExactTokensForTokens(tokenIn,tokenOut,web3.utils.toWei(amountIn.toString(),'ether'),web3.utils.toWei(amountMin.toString(),'ether'),account[0]).send({from:account[0],gas:300000,gasPrice:null});
        })        
    } catch (error) {
       return error; 
    }

}
window.swapTokenforToken = swapTokenforToken;

document.addEventListener("DOMContentLoaded", ()=>{
    initWeb3().then(web3_=>{
        web3 = web3_;
        
        console.log("Web3 initiaited",web3);
        swaprouter = initContract();
        getAccounts();
        console.log("First account:-",accounts)
    });

    
})
const getWeb3 = ()=>{
    return initWeb3().then(web3_=>{
        web3 = web3_;
        
        //console.log("Web3 initiaited",web3);
        swaprouter = initContract();
        return web3;
    });

    
}
window.getWeb3 = getWeb3;