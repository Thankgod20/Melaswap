const MelaRouter = artifacts.require("MelaRouter");
const WETH = artifacts.require("WETH");

contract("Test MelaRouter Get token Pair to getMinOut", (accounts) => {
    //deploy
    let melarouter = null;
    let weth = null;
    let BUSD = '0x78867bbeef44f2326bf8ddd1941a4439382ef2a7';
    before(async() => {
       melarouter = await MelaRouter.deployed();
       weth = await WETH.at('0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd');

       let contractAddress = melarouter.address;
       console.log("RouterAddress:-",contractAddress);

    });

    it ("Check if A pair Exist", async()=>{
        let tokenPair = await melarouter.getTokenPair(BUSD,weth.address);
        console.log("Token Pair:-",tokenPair);
    })
    it ("Check for The BNB Balance of the Wallet", async()=>{
        let BNBBal = await melarouter.getBNBBalance(accounts[0]);
        console.log("Address Balance:-",BNBBal.toString());
    })
    it ("Check for The ERC20 Balance of the Wallet", async()=>{
        let ERC20Bal = await melarouter.getBalance(BUSD);
        console.log("ERC20 Address Balance:-",ERC20Bal.toString());
    })
    it ("Check for The pair Reserves of the Wallet", async()=>{
        return melarouter.getTokenPair(BUSD,weth.address).then(async result =>{
            let pairReserve = await melarouter.getTokenReserves(result,BUSD,weth.address);
            console.log("Pair Address Reserve:-",pairReserve);
        });
        
    })
});