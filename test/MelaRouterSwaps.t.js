const MelaRouter = artifacts.require("MelaRouter");
const WETH = artifacts.require("WETH");
const ERC20 = artifacts.require("ERC20");

const toFixed = (x) =>{
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } else {
      var e = parseInt(x.toString().split('+')[1]);
      if (e > 20) {
          e -= 20;
          x /= Math.pow(10,e);
          x += (new Array(e+1)).join('0');
      }
    }
    return x;
  }
contract("Test MelaRouter getMinOut to Swaps", (accounts) => {
    //deploy
    let melarouter = null;
    let weth = null;
    let BUSD = '0x78867bbeef44f2326bf8ddd1941a4439382ef2a7';
    let INFLUX = '0xfc38b4e4840aca306c31891BB01E76E0979145Eb';
    let busd = null;
    let influx = null;
    let contractAddress = null;
    let busdBalance = null;
    before(async() => {
       melarouter = await MelaRouter.deployed();
       weth = await WETH.at('0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd');
       busd = await ERC20.at('0x78867bbeef44f2326bf8ddd1941a4439382ef2a7');
       influx = await ERC20.at('0xfc38b4e4840aca306c31891BB01E76E0979145Eb');
       contractAddress = melarouter.address;
       console.log("RouterAddress:-",contractAddress);

    });

    it ("Get the minium amount from a swap", async()=> {
        let amountMin = await melarouter.getAmountOutMin(weth.address,BUSD,'1000000000000000000');
        console.log("BUSD amount:-",amountMin.toString());
    });
    it ("Swap BNB to BUSD", async()=>{
        return melarouter.getAmountOutMin(weth.address,BUSD,'1000000000000000000').then(async result =>{
            let amountMin = result.toString();
            console.log("AmountMin:-",amountMin);
            //calculate Slipage of 5%
            let AmountAfterSlipage = parseInt(amountMin)-(parseInt(amountMin)*0.05);
            console.log("Slippage Expected Amount:-",AmountAfterSlipage)
            return melarouter.swapExactETHForTokens(weth.address,BUSD,AmountAfterSlipage.toString(),accounts[0],{from:accounts[0],value:'1000000000000000000'}).then(async ()=> {
                let ERC20Bal = await melarouter.getBalance(BUSD,{from:accounts[0]});
                busdBalance = ERC20Bal;
                console.log("ERC20 Address Balance:-",ERC20Bal.toString());
            } )
        })
    })
    it ("Check if A pair Exist", async()=>{
        let tokenPair = await melarouter.getTokenPair(weth.address,INFLUX);
        console.log("Token Pair:-",tokenPair);
    })
    it ("Swap BUSD to INFLUX", async()=>{
        return busd.approve(contractAddress,'100000000000000000000').then(async()=> {
            return melarouter.getAmountOutMin(BUSD,INFLUX,'1000000000000000000').then(async result =>{
                let amountMin = result.toString();
                console.log("AmountMin:-",amountMin);
                //calculate Slipage of 5%
                let AmountAfterSlipage = toFixed(parseInt(amountMin)-(parseInt(amountMin)*0.05));
                console.log("Slippage Expected Amount:-",AmountAfterSlipage.toString())
                
                return melarouter.swapExactTokensForTokens(BUSD,INFLUX,'1000000000000000000',AmountAfterSlipage.toString(),accounts[0]).then(async ()=> {
                    let ERC20Bal = await melarouter.getBalance(INFLUX,{from:accounts[0]});
                    console.log("INFlux ERC20 Address Balance:-",ERC20Bal.toString());
                } )
            })            
        } )

    })
    it ("Swap BUSD to BNB", async()=>{
        let BNBBal = await melarouter.getBNBBalance(accounts[0]);
        console.log("Address Balance:-",BNBBal.toString());
        return busd.approve(contractAddress,busdBalance.toString()).then(async()=> {
            
            return melarouter.getAmountOutMin(BUSD,weth.address,'100000000000000000000').then(async result =>{
                let amountMin = result.toString();
                console.log("AmountMin:-",amountMin);
                //calculate Slipage of 5%
                let AmountAfterSlipage = toFixed(parseInt(amountMin)-(parseInt(amountMin)*0.05));
                console.log("Slippage Expected Amount:-",AmountAfterSlipage.toString())
                
                return melarouter.swapExactTokensForETH(BUSD,weth.address,'100000000000000000000',AmountAfterSlipage.toString(),accounts[0]).then(async ()=> {
                    let BNBBal = await melarouter.getBNBBalance(accounts[0]);
                    console.log("Address Balance:-",BNBBal.toString());
                } )
            })            
        } )

    })
});