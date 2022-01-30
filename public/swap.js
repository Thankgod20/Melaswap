$(document).ready(function() {
    var fromSwapLogo = 'logo.svg';
    var fromSwapTokenName = 'BNB';
    var fromSwapAddress = '0xae13d989dac2f0debff460ac112a837c89baa7cd';
    let router = '0x2DC60C5f1c471070758e20E4ced435e91c176CA3';
    let fromSwapAddressTemp = null;
    let toSwapAddressTemp = null;

    var toSwapLogo = null;
    var toSwapTokenName = null;
    var toSwapAddress = null;
    let count = 0;

    let fromSwapValue = null;
    let toSwapValue = null;
    var divClicked = 0;
    let inputs = $('.token-amount-input').val();
    
    $('.from-d-VzRt').html('<img src="'+fromSwapLogo+'" class="BNB-pics">'+
                                '<span class="token-symbol-container">'+fromSwapTokenName+'</span><input type="hidden" class="address" value="'+fromSwapAddress+'">');
    $('.to-d-VzRt').html('<span class="token-symbol-container">Select a token</span>');   
    
    function updateSelectionTokenOne() {
        $('.from-d-VzRt').html('<img src="'+fromSwapLogo+'" class="BNB-pics">'+
                                '<span class="token-symbol-container">'+fromSwapTokenName+'</span><input type="hidden" class="address" value="'+fromSwapAddress+'">');
    }
    function updateSelectionTokenTwo() {
        $('.to-d-VzRt').html('<img src="'+toSwapLogo+'" class="BNB-pics">'+
                                '<span class="token-symbol-container">'+toSwapTokenName+'</span><input type="hidden" class="address" value="'+toSwapAddress+'">');
    }




    $.getJSON('./coins/coin.json', function(data) {
        var output = '';
        $.each(data.DexCoin, function(key, value) {
            output += '<li class ="coin-names"> <img class ="coin-icons" src ="./coin-icons/'+value.icon+'"/><span class="coin-name">' + value.name + '</span><input type="hidden" class="address" value="'+value.address+'"></li>';
        });
        $('.coins').html(output); 
    });

    //Search for token

    $('.searchToken').bind('input', function() { 
        var numberOfSearch = 0;
        var findValue = $(this).val();
        var findValueLength = $(this).val().length;
        console.log($(this).val().length);
        $.getJSON('./coins/coin.json', function(data) {
        var output = '';
        $.each(data.DexCoin, function(key, value) {
            var cname = String(value.name);
            var caddrss = String(value.address);
            if (cname.indexOf(findValue)>= 0 || caddrss.indexOf(findValue)>= 0) {
                numberOfSearch += 1;
                output += '<li class ="coin-names"> <img class ="coin-icons" src ="./coin-icons/'+value.icon+'"/><span class="coin-name">' + value.name + '</span><input type="hidden" class="address" value="'+value.address+'"></li>';
            }
        });
        console.log('number Fo',numberOfSearch);
        console.log('subStr Fo',findValue.substr(0,2));

        if (findValueLength>10 && findValue.substr(0,2)=='0x' && numberOfSearch == 0) {
            searchAddress(findValue).then(result=> {
                setSearchedTokenResult(result,findValue)  
            } )
        }
        $('.coins').html(output); 
        });


    });
    //Load searched token to list
    function setSearchedTokenResult(name,address) {
        var output = '<li class ="coin-names"> <img class ="coin-icons" src ="./coin-icons/question-mark.png"/><span class="coin-name">' + name + '</span><input type="hidden" class="address" value="'+address+'"></li>';

        $('.coins').html(output); 
        //console.log("ree",name,'Address',address);
    }
    //close popup menu
    $('.bk').click(function() {
        $('.dialog-box').fadeOut();
    })
    $('.bk-trn').click(function() {
        $('.dialog-box-trnx-report').fadeOut();
    })
    //Open popup menu
    $('.open-currency').click(function() {
       // alert($(this).find('.from-d-VzRt').html())
       if ($(this).find('.from-d-VzRt').html()) {
            divClicked = 1;
       } else if ($(this).find('.to-d-VzRt').html()) {
            divClicked = 2;
       }
        $('.dialog-box').fadeIn();
    });
    //Function to set token clicked
    $('.coins').on("click", ".coin-names", function(event){
        
            if (divClicked == 1) {
                fromSwapTokenName = $(this).find('.coin-name').html();
                fromSwapLogo = $(this).find('.coin-icons').attr('src');
                fromSwapAddress = $(this).find('.address').val();

                console.log("Address",fromSwapAddress,"ToSwap",toSwapAddress)
                updateSelectionTokenOne();
                $('.dialog-box').fadeOut();
                divClicked = 0;
                inputs = $('.token-amount-input').val();
                minOutput();
                if(toSwapAddress == null) {
                    toSwapAddress = $('.to-d-VzRt').find('.address').val();
                }
                getBalanceOfTokens(fromSwapAddress,toSwapAddress);
                Allowance(fromSwapAddress,router,fromSwapTokenName);
            }else if (divClicked == 2) {
                console.log(divClicked)
                toSwapTokenName = $(this).find('.coin-name').html();
                toSwapLogo = $(this).find('.coin-icons').attr('src');
                toSwapAddress = $(this).find('.address').val();

                console.log("Address",toSwapAddress)
                updateSelectionTokenTwo();
                $('.dialog-box').fadeOut();
                divClicked = 0;
                inputs = $('.token-amount-input').val();
                minOutput();
                if(fromSwapAddress == null) {
                    fromSwapAddress = $('.from-d-VzRt').find('.address').val();
                }
                getBalanceOfTokens(fromSwapAddress,toSwapAddress);
                
            }

    });
 
//Toggle between swap and pool
    $('.Swapp').click(function() {
        $('.pool').removeClass('active');
        $(this).addClass('active');
        $(".addLiquidity").fadeOut(function() {
            $(".swapToken").fadeIn()
        })
    })
    $('.pool').click(function() {
        $('.Swapp').removeClass('active');
        $(this).addClass('active');
        $(".swapToken").fadeOut(function() {
            $(".addLiquidity").fadeIn()
        })
    });
    //Swap inputs
    $('.circle-Li').click(function () {
        inputs = $('.token-amount-input').val();
        if (count == 0) {
            $('.to-d-VzRt').html('<img src="'+fromSwapLogo+'" class="BNB-pics">'+
                                    '<span class="token-symbol-container">'+fromSwapTokenName+'</span><input type="hidden" class="address" value="'+fromSwapAddress+'">');
            if (toSwapLogo != null) {
                $('.from-d-VzRt').html('<img src="'+toSwapLogo+'" class="BNB-pics">'+
                                    '<span class="token-symbol-container">'+toSwapTokenName+'</span><input type="hidden" class="address" value="'+toSwapAddress+'">');
                fromSwapAddressTemp = fromSwapAddress;
                toSwapAddressTemp = toSwapAddress;

                fromSwapAddress = toSwapAddressTemp;
                toSwapAddress = fromSwapAddressTemp;
                minOutput();
                
 

                getBalanceOfTokens(fromSwapAddress,toSwapAddress);  
            }
            else {
     
                getBalanceOfTokens(toSwapAddress,fromSwapAddress);
                $('.from-d-VzRt').html('<span class="token-symbol-container">Select a token</span>'); 
            }  
            count =1;          
        } else {
            $('.from-d-VzRt').html('<img src="'+fromSwapLogo+'" class="BNB-pics">'+
                                    '<span class="token-symbol-container">'+fromSwapTokenName+'</span><input type="hidden" class="address" value="'+fromSwapAddress+'">');
            if (toSwapLogo != null) {
                $('.to-d-VzRt').html('<img src="'+toSwapLogo+'" class="BNB-pics">'+
                                    '<span class="token-symbol-container">'+toSwapTokenName+'</span><input type="hidden" class="address" value="'+toSwapAddress+'">');
                fromSwapAddressTemp = toSwapAddress;
                toSwapAddressTemp = fromSwapAddress;

                fromSwapAddress = fromSwapAddressTemp;
                toSwapAddress = toSwapAddressTemp;
                minOutput();
      

                getBalanceOfTokens(fromSwapAddress,toSwapAddress); 
            }
            else {
         

                getBalanceOfTokens(fromSwapAddress,toSwapAddress);
                $('.to-d-VzRt').html('<span class="token-symbol-container">Select a token</span>'); 
            }  
            count  = 0;          
        }

        //alert(fromSwapLogo)
    })

    // get AmountMinOutPut
    $('.token-amount-input').bind('input', function() { 
        let inputs = $(this).val();
        if (toSwapAddress != null && parseFloat(inputs)>0) {
            
            //console.log("Inputs",inputs)
            getAmountMinOut(fromSwapAddress,toSwapAddress,inputs).then(result => {
                console.log("Amount Min",result);
                fromSwapValue = inputs;
                toSwapValue = result;
                addAmountMinToInput(toSwapValue)
            })
        }
    });
    function addAmountMinToInput(amountMin) {
        $('.token-amount-output').val(amountMin);
    }

    function minOutput () {
       
        if (inputs !="") { 
            
                getAmountMinOut(fromSwapAddress,toSwapAddress,inputs).then(result => {
                        console.log("Amount Min",result);
                        fromSwapValue = inputs;
                        toSwapValue = result;
                        addAmountMinToInput(toSwapValue)
                    })
            }
    }

  function getBalanceOfTokens(tokenIn,tokenOut) {
        
        $('.BalanceTokenOne').html('');
        $('.BalanceTokenTwo').html('');
        
        getWeb3().then(res => {
            console.log("Web3...",res);
            if (res) {
                balanceOfToken(tokenIn,tokenOut).then(result => {    
                    if (result)   {
                        console.log("Balance of Token",result); 
                        $('.BalanceTokenOne').html('<span>Balance:- '+parseFloat(result[0]).toFixed(6)+'</span>')
                        if (result[1] != '') {
                            $('.BalanceTokenTwo').html('<span>Balance:- '+parseFloat(result[1]).toFixed(6)+'</span>')
                        }
                    }           
                         
                });
            }
        })

  }
  getBalanceOfTokens(fromSwapAddress,toSwapAddress);


  //Check Allowance
  function Allowance(tokenAddr,routerAddr,tokenName) {
    if (tokenName != 'BNB') {
        checkAllowance(tokenAddr,routerAddr).then(result => {
            console.log("Client APprove",result)
            if (parseInt(result)== 0)
                $(".approve-btn").fadeIn()
        })       
    }

  }
  $(".approve-btn").click(function() {
     let AddrforApproval = $('.from-d-VzRt').find('.address').val();
     console.log("Approve This Address",AddrforApproval);

     approveToken(AddrforApproval,router).then(result => {
        $(".approve-btn").fadeOut();
        $('.dialog-box-trnx-report').fadeIn();
        $('.tran-details').html("<span style='margin: 15%;color: white;'><a href='https://testnet.bscscan.com/tx/"+result.transactionHash+"' style='color: white;text-decoration: none;font-weight: bold;' target='_blank'>Click Here to View Transaction</a></span>");
         console.log("Approval Result",result)
     })
  })
  getWeb3().then(res =>{
    if (res) {
        $(".swap_btn").html("Swap");
    }
  })

  $(".swap_btn").click(function() {
      var tokenIn = $('.from-d-VzRt').find('.address').val();
      var tokenInName = $('.from-d-VzRt').find('.token-symbol-container').html();
      var tokenOut = $('.to-d-VzRt').find('.address').val();
      var tokenOutName = $('.to-d-VzRt').find('.token-symbol-container').html();

      var amountIn = $('.token-amount-input').val();
      
      var amountMinOut = parseFloat($('.token-amount-output').val())-(parseFloat($('.token-amount-output').val())*0.12);
     
      if (tokenIn != null && tokenOut != null) { 
         $('.dialog-box-trnx-report').fadeIn()
          if (tokenInName == 'BNB') { 
            swapBNBforToken(tokenOut,amountIn,amountMinOut).then(result => {  
                getBalanceOfTokens(tokenIn,tokenOut);
                
              
                $('.tran-details').html("<span style='margin: 15%;color: white;'><a href='https://testnet.bscscan.com/tx/"+result.transactionHash+"' style='color: white;text-decoration: none;font-weight: bold;' target='_blank'>Click Here to View Transaction</a></span>");
                console.log("Swap Result",result.transactionHash)
              })
          } else if (tokenOutName == 'BNB') { 
            
            swapTokenforBNB(tokenIn,amountIn,amountMinOut).then(result => {  
                try {
                    getBalanceOfTokens(tokenIn,tokenOut);
                    //$('.dialog-box-trnx-report').fadeIn()
                
                    $('.tran-details').html("<span style='margin: 15%;color: white;'><a href='https://testnet.bscscan.com/tx/"+result.transactionHash+"' style='color: white;text-decoration: none;font-weight: bold;' target='_blank'>Click Here to View Transaction</a></span>");
                    console.log("Swap Result",result.transactionHash)                    
                } catch (error) {
                    console.error("Erroer",error);
                    
                }

              })
          } else {
                swapTokenforToken(tokenIn,tokenOut,amountIn,amountMinOut).then(result => {  
                    try {
                        getBalanceOfTokens(tokenIn,tokenOut);
                        //$('.dialog-box-trnx-report').fadeIn()
                    
                        $('.tran-details').html("<span style='margin: 15%;color: white;'><a href='https://testnet.bscscan.com/tx/"+result.transactionHash+"' style='color: white;text-decoration: none;font-weight: bold;' target='_blank'>Click Here to View Transaction</a></span>");
                        console.log("Swap Result",result.transactionHash)                    
                    } catch (error) {
                        console.error("Erroer",error);
                        
                    }

                })
          }
        
      }
  })
}); 