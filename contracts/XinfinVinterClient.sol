pragma solidity 0.4.24;

import "https://github.com/GoPlugin/contracts/blob/main/src/v0.4/PluginClient.sol";
import "https://github.com/GoPlugin/contracts/blob/main/src/v0.4/vendor/Ownable.sol";

contract XinfinVinterClient is PluginClient, Ownable {
    
  //Initialize Oracle Payment     
  uint256 constant private ORACLE_PAYMENT = 1 * PLI;
  uint256 public currentPrice;

  //Initialize event RequestPriceFulfilled   
  event RequestPriceFulfilled(
    bytes32 indexed requestId,
    uint256 indexed price
  );

  //Initialize event requestCreated   
  event requestCreated(address indexed requester,bytes32 indexed jobId, bytes32 indexed requestId);

  //Constructor to pass Pli Token Address during deployment
  constructor(address _pli) public Ownable() {
    setPluginToken(_pli);
  }
  
  //requestPrice function will initate the request to Oracle to get the price from Vinter API
  function requestPrice(address _oracle, string _jobId,string _endpoint,string _symbol)
    public
    onlyOwner
    returns (bytes32 requestId)
  {
    Plugin.Request memory req = buildPluginRequest(stringToBytes32(_jobId), this, this.fulfillPrice.selector);
    req.add("endpoint",_endpoint);
    req.add("symbol",_symbol);
    req.addInt("times", 100);
    requestId = sendPluginRequestTo(_oracle, req, ORACLE_PAYMENT);
    emit requestCreated(msg.sender, stringToBytes32(_jobId), requestId);
  }

  //callBack function
  function fulfillPrice(bytes32 _requestId, uint256 _price)
    public
    recordPluginFulfillment(_requestId)
  {
    emit RequestPriceFulfilled(_requestId, _price);
    currentPrice = _price;
  }

  function getPluginToken() public view returns (address) {
    return pluginTokenAddress();
  }

  //With draw pli can be invoked only by owner
  function withdrawPli() public onlyOwner {
    PliTokenInterface pli = PliTokenInterface(pluginTokenAddress());
    require(pli.transfer(msg.sender, pli.balanceOf(address(this))), "Unable to transfer");
  }

  //Cancel the existing request
  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  )
    public
    onlyOwner
  {
    cancelPluginRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  //String to bytes to convert jobid to bytest32
  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }
    assembly { 
      result := mload(add(source, 32))
    }
  }

}